require('babel/register')({
  stage: 0
});
const config = require('../universal/config');
const rootDir = config.get('project_root');
const globals = config.get('globals');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/isomorphic'))
.development(globals.__DEV__)
.server(rootDir, function run() {
  require('./koa');
});

