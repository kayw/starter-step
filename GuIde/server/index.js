/* eslint no-console: 0 */
require('babel-core/register')({
  plugins: ['transform-decorators-legacy'],
  presets: ['es2015', 'stage-0', 'react'],
});
require('babel-polyfill');
const config = require('../universal/config');
const rootDir = config.get('project_root');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

global.__API_ROOT__ = `http://localhost:${config.get('server_port')}/api/`;
global.__CLIENT__ = false;
global.__DEV__ = config.get('__DEV__');
global.__DEVTOOLS__ = config.get('__DEVTOOLS__');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/isomorphic'))
  .development(__DEV__)
  .server(rootDir, () => {
    require('./koa');
  });

process.on('uncaughtException', (err) => {
  console.log('Caught exception:', err);
});

process.on('exit', (code) => {
  console.log('exit', code);
});
