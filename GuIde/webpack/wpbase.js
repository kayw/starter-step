require('babel-core/register')({
  presets: ['es2015-node5']
});

const webpack = require('webpack');
const path = require('path');
const autoprefix = require('autoprefixer');
const precss = require('precss');
const config = require('../universal/config');

const WebpackIsomorphicPlugin = require('webpack-isomorphic-tools/plugin');
const isomorphicPlugin = new WebpackIsomorphicPlugin(require('./isomorphic'));
const nodeModulesPath = path.resolve(__dirname, '..', 'node_modules');

const wpConfig = {
  // Entry point to the project
  entry: {
    vendor: config.get('vendor_dependencies')
  },
  context: path.resolve(__dirname, '..'),
  /*
  node: {
    fs: 'empty',
    child_process: 'empty'
  },*/
  // Webpack config options on how to obtain modules
  resolve: {
    // When requiring, you don't need to add these extensions
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(__dirname, '..')
  },
  output: {
    path: config.get('dist_path'), // Path of output file
    publicPath: config.get('webpack_public_path'),
    filename: '[name]-[hash].js'  // Name of output file
  },
  plugins: [
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __API_ROOT__: JSON.stringify(config.get('__API_ROOT__')),
      __DEV__: config.get('__DEV__'),
      __DEVTOOLS__: config.get('__DEVTOOLS__')
    }),
    config.get('__DEV__') ? isomorphicPlugin.development() : isomorphicPlugin,
  ],
  module: {
    // eslint loader
    preLoaders: [{
      test: /\.(js|jsx)$/,
      loader: 'eslint-loader',
      include: [path.resolve(__dirname, '..')],
      exclude: [nodeModulesPath]
    }],
    loaders: [{
      test: /\.(js|jsx)$/, // All .js and .jsx files
      loader: 'babel', // babel loads jsx and es6-7
      include: [path.resolve(__dirname, '..')],
      exclude: [nodeModulesPath],  // exclude node_modules so that they are not all compiled
      query: {
        // cacheDirectory: true,
        plugins: ['transform-decorators-legacy'],
        presets: ['es2015', 'react', 'stage-0'],
        env: {
          development: {
            plugins: [
              ['react-transform', {
                transforms: [{
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module']
                }, {
                  transform: 'react-transform-catch-errors',
                  imports: ['react', 'redbox-react']
                }]
              }]
            ]
          },
          production: {
            plugins: [
              'transform-react-remove-prop-types',
              'transform-react-inline-elements',
              'transform-react-constant-elements',
            ]
          }
        }
      }
    }, {
      test: isomorphicPlugin.regular_expression('images'),
      loader: 'url-loader?limit=10240'
      // any image below or equal to 10K will be converted to inline base64 instead
    }]
  },
  postcss: function postcss() {
    // return [autoprefix({ browsers: ['> 5%', 'last 2 versions'] }), precss];
    return [autoprefix, precss];
  },
  eslint: {
    configFile: './.eslintrc.json',
    // failOnError: config.get('__PROD__'),
    emitWarning: config.get('__DEV__')
  }
};

wpConfig.cssTestRe = /\.(css|scss)$/;
wpConfig.cssTransformer = `css?modules&importLoaders=1&sourceMap&
  localIdentName=[local]___[hash:base64:5]!postcss?parser=postcss-scss`;

// ----------------------------------
// Vendor Bundle Configuration
// ----------------------------------
// NOTE: this is a temporary workaround. I don't know how to get Karma
// to include the vendor bundle that webpack creates, so to get around that
// we remove the bundle splitting when webpack is used with Karma.
const commonChunkPlugin = new webpack.optimize.CommonsChunkPlugin(
  'vendor', '[name]-[hash].js'
);
commonChunkPlugin.__KARMA_IGNORE__ = true;
wpConfig.plugins.push(commonChunkPlugin);

module.exports = wpConfig;
