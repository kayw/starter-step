import WebpackIsomorphicPlugin from 'webpack-isomorphic-tools/plugin';

export default {
  webpack_assets_file_path:  'public/assets.json',
  assets: {
    images: {
      extensions: ['png', 'jpg', 'gif', 'ico', 'svg'],
      parser: WebpackIsomorphicPlugin.url_loader_parser // see Configuration and API sections for more info on this parameter
    },
    style_decriptor: {
      extensions: ['css'],
      filter: (m, regex, options, log) => {
        if (!options.development) {
          return regex.test(m.name);
        }
        /*
         * filter by modules with '.scss' inside name string, that also have name and moduleName that end with 'ss'(allows for css, less, sass, and scss extensions)
           this ensures that the proper scss module is returned, so that namePrefix variable is no longer needed
          */
        return regex.test(m.name) && m.name.slice(-2) === 'ss' && m.reasons[0].moduleName.slice(-2) === 'ss';
      },
      naming: (m, options, log) => {
        // find index of '/client' inside the module name, slice it and resolve path
        const srcIndex = m.name.indexOf('/client');
        let name = '.' + m.name.slice(srcIndex);
        if (name) {
          // Resolve the e.g.: "C:\"  issue on windows
          const i = name.indexOf(':');
          if (i >= 0) {
            name = name.slice(i + 1);
          }
        }
        return name;
      },
      parser: (m, options, log) => {
        if (m.source) {
          const regex = options.development ? /exports\.locals = ((.|\n)+);/ : /module\.exports = ((.|\n)+);/;
          const match = m.source.match(regex);
          return match ? JSON.parse(match[1]) : {};
        }
      }
    }
  }
};
