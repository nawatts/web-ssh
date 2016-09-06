const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const process = require('process');
const webpack = require('webpack');

const isProd = !!(process.env.NODE_ENV === 'production');

const DEV_SERVER_PORT = 3000;

const webpackConfig = {
  debug: !isProd,
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    port: DEV_SERVER_PORT,
    stats: {
      colors: true,
    },
  },
  devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
  entry: './index.jsx',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'build'),
    pathinfo: true,
    publicPath: isProd ? '/' : `http://localhost:${DEV_SERVER_PORT}/`,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      minify: false,
      template: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
  resolve: {
    alias: {
      'web-ssh/client': isProd ? '../client' : '../client/src',
    },
    extensions: ['', '.js', '.jsx'],
  },
  stats: {
    colors: true,
    progress: true,
  },
};

if (isProd) {
  webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ]);
}

module.exports = webpackConfig;
