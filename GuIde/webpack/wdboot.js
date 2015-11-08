// https://github.com/erikras/react-redux-universal-hot-example/blob/94f69f71acf89b8696725d8897b9edde15c04620/webpack/webpack-dev-server.js
const WebpackDevServer = require('webpack-dev-server');
const config = require('./dev');
const host = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT, 10) + 1 || 3001;
const serverOptions = {
  contentBase: 'http://' + host + ':' + port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: config.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};
const webpackDevServer = new WebpackDevServer(config, serverOptions);

const consoleF = console;
webpackDevServer.listen(port, host, function afterConnect() {
  consoleF.info('==> 🚧  Webpack development server listening on %s:%s', host, port);
});
