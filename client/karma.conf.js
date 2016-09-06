const karmaWebpackConfig = require('./karma.webpack.config');

module.exports = (config) => {
  config.set({
    browsers: ['PhantomJS'],
    files: [
      '../node_modules/babel-polyfill/dist/polyfill.js',
      '../node_modules/phantomjs-polyfill/bind-polyfill.js',
      './tests/**/*.spec.js',
      './tests/**/*.spec.jsx',
    ],
    frameworks: [
      'chai',
      'mocha',
    ],
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
    ],
    preprocessors: {
      './tests/**/*.spec.js': ['webpack', 'sourcemap'],
      './tests/**/*.spec.jsx': ['webpack', 'sourcemap'],
    },
    reporters: ['spec'],
    singleRun: true,
    webpack: karmaWebpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
