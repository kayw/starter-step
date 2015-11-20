process.env.NODE_ENV = (process.env.NODE_ENV || 'development').trim();

import path from 'path';

const config = new Map();
const __DEV__ = process.env.NODE_ENV === 'development';

// ------------------------------------
// Environment
// ------------------------------------
config.set('env', process.env.NODE_ENV);
config.set('__DEV__', __DEV__);
config.set('__PROD__', config.get('env') === 'production');
config.set('__DEVTOOLS__', config.get('env') === 'development');

// ------------------------------------
// Server
// ------------------------------------
config.set('server_host', 'localhost');
config.set('server_port', 3000);
config.set('rethinkdb', {
  host: 'localhost',
  port: 28015,
  db: 'guide'
});

// ------------------------------------
// Webpack
// ------------------------------------
config.set('webpack_port', 3001);
config.set('webpack_dev_path',
  `http://${config.get('server_host')}:${config.get('webpack_port')}/`
);
config.set('webpack_output_path', 'dist');

config.set('webpack_lint_in_dev', true);
if (__DEV__) {
  config.set('webpack_public_path', `${config.get('webpack_dev_path')}${config.get('webpack_output_path')}/`);
  config.set('__API_ROOT__', `http://${config.get('server_host')}:${config.get('server_port')}/api/`);
} else {
  config.set('webpack_public_path', `/${config.get('webpack_output_path')}/`);
  config.set('__API_ROOT__', '');
}

// ------------------------------------
// Project
// ------------------------------------
config.set('project_root', path.resolve(__dirname, '..'));
config.set('dist_path', path.resolve(__dirname, '..', 'public', config.get('webpack_output_path')));
config.set('assets_path', path.resolve(__dirname, '..', 'public'));
config.set('client_entry', path.resolve(__dirname, '..', 'client/centry.js'));

config.set('vendor_dependencies', [
  'immutable',
  'react',
  'react-redux',
  'react-router',
  'redux',
  'redux-devtools',
  'react-tap-event-plugin',
  'material-ui'
]);

export default config;
