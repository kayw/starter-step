const path = require('path');
const webpack = require('webpack');
const wpconfig = require('../webpack/dev');
const debug = require('debug')('app:karma');
debug('karma config');

module.exports = function (config) {
  config.set({
    basePath: '../',  // project root in relation to tests/karma.conf.js

    browsers: ['PhantomJS'],

    singleRun: !!process.env.CI,

    frameworks: [ 'mocha' ],

    reporters: [
      'mocha',
      'coverage',
    ],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      {
        pattern: './tests/bundler.js',
        watched: true,
        served: true,
        included: true,
      }
    ],

    preprocessors: {
      'tests/bundler.js': [ 'webpack' ]
    },

    plugins: [
      require("karma-webpack-with-fast-source-maps"),
      require("karma-mocha"),
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-coverage',
    ],

    webpack: {
      devtool: 'cheap-module-source-map',
      // *optional* isparta options: istanbul behind isparta will use it
      // https://github.com/deepsweet/isparta-loader
      isparta: {
        embedSource: true,
        noAutoWrap: true,
        // these babel options will be passed only to isparta and not to babel-loader
        babel: {
          plugins: ['transform-decorators-legacy'],
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      module: {
        preLoaders: [{
          test: /\.(js|jsx)$/,
          include: [ path.resolve(__dirname, '..') ],
          loader: 'isparta',
          exclude: /node_modules|-spec.js/
        }],
        loaders: wpconfig.module.loaders
      },
      resolve: wpconfig.resolve,
      plugins: [
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __API_ROOT__: false,
          __DEV__: true,
          __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
        })
      ],
      postcss: wpconfig.postcss
    },

    webpackMiddleware: {
      noInfo: true
    },

    // http://stackoverflow.com/questions/34095639/module-not-found-error-cannot-resolve-module-react-addons-test-utils
    coverageReporter: {
      dir: './coverage/',
      reporters: [
        {
          type: 'lcovonly',
          subdir: '.',
          file: 'lcov.info'
        }, {
          type: 'html',
          subdir: 'html'
        },
        // https://github.com/onefinestay/react-daterange-picker/pull/72/files
        { type: 'text-summary' }
      ]
    }
  });
};

