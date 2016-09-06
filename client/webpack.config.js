const process = require('process');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

const isProd = !!(process.env.NODE_ENV === 'production');

const webpackConfig = {
  debug: !isProd,
  devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
  entry: './src/index.js',
  externals: [{
    react: {
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React',
    },
  }],
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
    filename: 'index.js',
    library: 'web-ssh-client',
    libraryTarget: 'umd',
    path: __dirname,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
  resolve: {
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
      output: {
        // Use UglifyJS's comment configuration. Removes module names added by webpack.
        comments: /@preserve|@license|@cc_on/,
      },
    }),
  ]);
}

module.exports = webpackConfig;
