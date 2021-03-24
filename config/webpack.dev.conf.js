const webpack = require('webpack');
const { merge } = require('webpack-merge');
const address = require('address');
const chalk = require('chalk');
const portfinder = require('portfinder');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const common = require('./webpack.base.conf');
const paths = require('./paths');

const GREEN = '#07c160';
const PORT = (process.env.PORT && Number(process.env.PORT)) || 8080;

const devWebpackConfig = merge(common, {
  mode: 'development',

  devtool: 'inline-source-map',

  devServer: {
    historyApiFallback: true,
    contentBase: paths.build,
    compress: true,
    hot: true,
    quiet: true,
    host: '0.0.0.0',
  },

  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 },
          },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'sass-loader',
            options: { implementation: require('sass'), sourceMap: true },
          },
        ],
      },
    ],
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
});

module.exports = new Promise(async (resolve, reject) => {
  try {
    portfinder.basePort = PORT;

    const port = await portfinder.getPortPromise();
    const ip = address.ip();
    const local = `http://localhost:${port}/`;
    const network = `http://${ip}:${port}/`;
    const localInfo = `${chalk.bold('Local')}:    ${chalk.hex(GREEN)(local)}`;
    const newworkInfo = `${chalk.bold('Network')}:  ${chalk.hex(GREEN)(
      network,
    )}`;

    devWebpackConfig.devServer.port = port;
    devWebpackConfig.plugins.push(
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`App running at:\n  ${localInfo}\n  ${newworkInfo}`],
        },
      }),
    );
    resolve(devWebpackConfig);
  } catch (err) {
    reject(err);
  }
});
