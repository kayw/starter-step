const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const wpConfig = require('./wpbase');
const config = require('../universal/config');
wpConfig.entry.app = [
  config.get('client_entry')
];
wpConfig.devtool = 'cheap-source-map';
wpConfig.plugins.push(
  // css files from the extract-text-plugin loader
  new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
  // optimizations
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
);
wpConfig.module.loaders.push({
  test: wpConfig.cssTestRe,
  loader: ExtractTextPlugin.extract('style', wpConfig.cssTransformer)
});
console.log(wpConfig.output);
console.log(wpConfig.plugins);

module.exports = wpConfig;
