const path = require('path');

const webpackConfig = require('./webpack.config');

module.exports = {
  devtool: 'inline-source-map',
  externals: {
    cheerio: 'window',
    jsdom: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
  },
  resolve: {
    root: path.resolve(__dirname, './src'),
    extensions: ['', '.js', '.jsx'],
    alias: {
      sinon: 'sinon/pkg/sinon',
    },
  },
  module: {
    loaders: webpackConfig.module.loaders,
    noParse: [
      /node_modules\/sinon\//,
    ],
  },
};
