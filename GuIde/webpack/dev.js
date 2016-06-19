const webpack = require('webpack');
const wpConfig = require('./wpbase');
const config = require('../universal/config');

wpConfig.entry.app = [
  'webpack/hot/only-dev-server',
  config.get('client_entry'),
];
// Configuration for dev server
wpConfig.devServer = {
  contentBase: config.get('webpack_dev_path'),
  hot: true,
  quiet: true,
  noInfo: true,
  inline: true,
  progress: true,
  stats: {
    colors: true,
  },
  port: config.get('webpack_port'),
};
wpConfig.devtool = 'source-map';
// sync with browser while developing
wpConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
wpConfig.module.loaders.push({
  test: wpConfig.cssTestRe,
  loader: `style!${wpConfig.cssTransformer}`,
});

module.exports = wpConfig;
