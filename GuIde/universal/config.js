process.env.NODE_ENV = (process.env.NODE_ENV || 'development').trim();

import path from 'path';

const config = new Map();

// ------------------------------------
// Environment
// ------------------------------------
config.set('env', process.env.NODE_ENV);
config.set('globals', {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.get('env'))
  },
  'NODE_ENV'     : config.get('env'),
  '__DEV__'      : config.get('env') === 'development',
  '__PROD__'     : config.get('env') === 'production',
  '__DEBUG__'    : config.get('env') === 'development'
});

// ------------------------------------
// Server
// ------------------------------------
config.set('server_host', 'localhost');
config.set('server_port', process.env.PORT || 3000);

// ------------------------------------
// Webpack
// ------------------------------------
config.set('webpack_port', 3001);
config.set('webpack_dev_path',
  `http://${config.get('server_host')}:${config.get('webpack_port')}/`
);
config.set('webpack_output_path', 'dist');
config.set('webpack_public_path',
  `${config.get('webpack_dev_path')}${config.get('webpack_output_path')}/`
);

config.set('webpack_lint_in_dev', true);

// ------------------------------------
// Project
// ------------------------------------
config.set('project_root', path.resolve(__dirname, '..'));
config.set('dist_path', path.resolve(__dirname, '..', config.get('webpack_output_path')));
config.set('client_entry', path.resolve(__dirname, '..', 'client/centry.js'));

config.set('vendor_dependencies', [
  'immutable',
  'react',
  'react-redux',
  'react-router',
  'redux',
  'redux-devtools',
  'redux-devtools/lib/react',
  'react-tap-event-plugin',
  'material-ui'
]);

export default config;
