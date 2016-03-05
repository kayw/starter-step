import WebpackIsomorphicPlugin from 'webpack-isomorphic-tools/plugin';

module.exports = {
  webpack_assets_file_path: 'public/assets.json',
  webpack_stats_file_path: 'public/stats.json',

  assets: {
    images: {
      extensions: ['png', 'jpg', 'gif', 'ico', 'svg'],
      parser: WebpackIsomorphicPlugin.url_loader_parser
    },
    style_decriptor: {
      extensions: ['css', 'scss'],
      filter: (module, regex, options, log) => {
        let filtered;
        if (options.development) {
          // in development mode there's webpack "style-loader",
          // so the module.name is not equal to module.name
          filtered = WebpackIsomorphicPlugin.style_loader_filter(module, regex, options, log);
        } else {
          // in production mode there's no webpack "style-loader",
          // so the module.name will be equal to the asset path
          filtered = regex.test(module.name);
        }
        return filtered;
      },
      path: (module, options, log) => {
        let path;
        if (options.development) {
          // in development mode there's webpack "style-loader",
          // so the module.name is not equal to module.name
          path = WebpackIsomorphicPlugin.style_loader_path_extractor(module, options, log);
        } else {
          // in production mode there's no webpack "style-loader",
          // so the module.name will be equal to the asset path
          path = module.name;
        }
        return path;
      },
      parser: (module, options, log) => {
        let source;
        if (options.development) {
          source = WebpackIsomorphicPlugin.css_modules_loader_parser(module, options, log);
        } else {
          // in production mode there's Extract Text Loader which extracts CSS text away
          source = module.source;
        }
        return source;
      }
    }
  }
};
