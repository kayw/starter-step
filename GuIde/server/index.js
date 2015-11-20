require('babel/register')({
  stage: 0
});
const config = require('../universal/config');
const rootDir = config.get('project_root');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

global.__API_ROOT__ = `http://localhost:${config.get('server_port')}/api/`;
global.__CLIENT__ = false;
global.__DEV__ = config.get('__DEV__');
global.__DEVTOOLS__ = config.get('__DEVTOOLS__');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/isomorphic'))
  .development(__DEV__)
  .server(rootDir, function run() {
    require('./koa');
  });
