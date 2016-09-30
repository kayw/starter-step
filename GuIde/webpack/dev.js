const webpack = require('webpack');
const wpConfig = require('./wpbase');
const config = require('../universal/config');

wpConfig.entry.app = [
  // 'webpack/hot/only-dev-server',
  config.get('client_entry'),
];
// Configuration for dev server
wpConfig.devServer = {
  contentBase: config.get('webpack_dev_path'),
  hot: true,
  quiet: true,
  inline: true,
  progress: true,
  stats: {
    colors: true,
  },
  port: config.get('webpack_port'),
};
wpConfig.devtool = 'source-map';

// ----------------------------------
// Vendor Bundle Configuration
// ----------------------------------
// NOTE: this is a temporary workaround. I don't know how to get Karma
// to include the vendor bundle that webpack creates, so to get around that
// we remove the bundle splitting when webpack is used with Karma.
const commonChunkPlugin = new webpack.optimize.CommonsChunkPlugin(
  'vendor', '[name].js'
);
commonChunkPlugin.KARMA_IGNORE = true;
wpConfig.plugins.push(commonChunkPlugin);

// sync with browser while developing
wpConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
wpConfig.module.loaders.push({
  test: wpConfig.cssTestRe,
  loader: `style!${wpConfig.cssTransformer}`,
});

module.exports = wpConfig;
