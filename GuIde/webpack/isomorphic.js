import WebpackIsomorphicPlugin from 'webpack-isomorphic-tools/plugin';

export default {
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
        if (module.name.slice(-2) === 'ss') {
          log.info(module.name, regex.toString());
        }
        if (options.development) {
          // in development mode there's webpack "style-loader",
          // so the module.name is not equal to module.name
          return WebpackIsomorphicPlugin.style_loader_filter(module, regex, options, log);
        } else {
          // in production mode there's no webpack "style-loader",
          // so the module.name will be equal to the asset path
          return regex.test(module.name);
        }
      },
      path: (module, options, log) => {
        if (options.development) {
          // in development mode there's webpack "style-loader",
          // so the module.name is not equal to module.name
          return WebpackIsomorphicPlugin.style_loader_path_extractor(module, options, log);
        } else {
          // in production mode there's no webpack "style-loader",
          // so the module.name will be equal to the asset path
          return module.name;
        }
      },
      parser: (module, options, log) => {
        if (options.development) {
          return WebpackIsomorphicPlugin.css_modules_loader_parser(module, options, log);
        } else {
          // in production mode there's Extract Text Loader which extracts CSS text away
          return module.source;
        }
      }
    }
  }
};
