require('babel/register')({
  stage: 0,
  ignore: /node_modules/
});

const webpack = require('webpack');
const path = require('path');
const argv = require('yargs');
const config = require('../universal/config');
const globals = config.get('globals');
globals.__DEBUG_NW__ = !!argv.nw;

const WebpackIsomorphicPlugin = require('webpack-isomorphic-tools/plugin');
const isomorphicPlugin = new WebpackIsomorphicPlugin(require('./isomorphic'));
const nodeModulesPath = path.resolve(__dirname, '..', 'node_modules');

const wpConfig = {
  // Entry point to the project
  entry: {
    vendor: config.get('vendor_dependencies'),
    app: [
      'webpack/hot/dev-server',
      'webpack/hot/only-dev-server',
      config.get('client_entry')
    ]
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
    alias: {
      ace: path.resolve(__dirname, 'node_modules/ace'),
      codemirror: path.resolve(__dirname, 'node_modules/codemirror')
    },
    // Modules will be searched for in these directories
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, '..')
    ]
  },
  // Configuration for dev server
  devServer: {
    contentBase: config.get('webpack_dev_path'),
    hot: true,
    inline: true,
    progress: true,
    stats: {
      colors: true
    },
    port: config.get('webpack_port')
  },
  devtool: 'eval-source-map',
  output: {
    path: config.get('dist_path'), // Path of output file
    publicPath: config.get('webpack_public_path'),
    filename: '[name]-[hash].js'  // Name of output file
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),// sync with browser while developing
    isomorphicPlugin.development(),
    // Allows error warninggs but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin()
  ],
  module: {
    // eslint loader
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, '..')],
        exclude: [nodeModulesPath]
      }
    ],
    loaders: [{
      test: /\.(js|jsx)$/, // All .js and .jsx files
      loader: 'babel', // babel loads jsx and es6-7
      include: [path.resolve(__dirname, '..')],
      exclude: [nodeModulesPath],  // exclude node_modules so that they are not all compiled
      query: {
        optional: ['runtime'],
        stage: 0,
        env: {
          development: {
            plugins: [
              'react-transform'
            ],
            extra: {
              'react-transform': {
                transforms: [{
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals:  ['module']
                }, {
                  transform: 'react-transform-catch-errors',
                  imports: ['react', 'redbox-react']
                }]
              }
            }
          }
        }
      }
    }, {
      test: isomorphicPlugin.regular_expression('images'),
      loader: 'url-loader?limit=10240' // any image below or equal to 10K will be converted to inline base64 instead
    }]
  },
  eslint: {
    configFile: './.eslintrc',
    failOnError : globals.__PROD__,
    emitWarning : globals.__DEV__
  }
};

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
