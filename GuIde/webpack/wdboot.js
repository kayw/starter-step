// https://github.com/erikras/react-redux-universal-hot-example/blob/94f69f71acf89b8696725d8897b9edde15c04620/webpack/webpack-dev-server.js
var WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('./dev'),
  host = process.env.HOST || 'localhost',
  port = parseInt(process.env.PORT) + 1 || 3001,
  serverOptions = {
    contentBase: 'http://' + host + ':' + port,
    quiet: true,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: config.output.publicPath,
    headers: {"Access-Control-Allow-Origin": "*"},
    stats: {colors: true}
  },
  webpackDevServer = new WebpackDevServer(compiler, serverOptions);

webpackDevServer.listen(port, host, function() {
  console.info('==> 🚧  Webpack development server listening on %s:%s', host, port);
});
