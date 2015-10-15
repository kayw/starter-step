const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const config = {
  entry: [
    path.join(__dirname, '/src/app/app.jsx')
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.txt'],
    alias: {
      'material-ui': path.resolve(__dirname, '../src'),
      codemirror: path.resolve(__dirname, 'node_modules/codemirror')
    },
    modulesDirectories: [
      'web_modules',
      'node_modules',
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, 'src/app/components/raw-code')
    ],
  },
  devtool: 'source-map',
  output: {
    path: buildPath,    
    filename: 'app.js' 
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
        inject: false,
        template: path.join(__dirname, '/src/www/index.html')
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
        //eslint loader
        preLoaders: [
          {
            test: /\.(js|jsx)$/,
            loader: 'eslint-loader',
            include: [path.resolve(__dirname, '../src')],
            exclude: [path.resolve(__dirname, '../src/svg-icons'), path.resolve(__dirname, '../src/utils/modernizr.custom.js')]
          }
        ],
        loaders: [
          {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader?stage=0',
            include: [__dirname, path.resolve(__dirname, '../src')],
            exclude: [nodeModulesPath]
          },
          {
            test:/\.txt$/,
            loader: 'raw-loader',
            include: path.resolve(__dirname, 'src/app/components/raw-code')
          }
        ]
  },
  eslint: {
    configFile: '../.eslintrc'
  }
};

module.exports = config;
