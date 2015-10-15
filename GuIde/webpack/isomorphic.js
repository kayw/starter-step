import WebpackIsomorphicPlugin from 'webpack-isomorphic-tools/plugin';

export default {
  webpack_assets_file_path:  'webpack/assets.json',
  assets: {
    images: {
      extensions: ['png', 'jpg', 'gif', 'ico', 'svg'],
      parser: WebpackIsomorphicPlugin.url_loader_parser // see Configuration and API sections for more info on this parameter
    }
  }
};
