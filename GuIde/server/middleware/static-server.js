import fs from 'fs';

const readFileThunk = src =>
  new Promise((resolve, reject) => {
    fs.readFile(src, { encoding: 'utf8' }, (err, data) => {
      let thened;
      if (err) {
        thened = reject(err);
      } else {
        thened = resolve(data);
      }
      return thened;
    });
  });

// http://stackoverflow.com/questions/24024566/display-a-static-html-file-with-koa-js
export default function serveStatic(htmlFile) {
  return function* serveStaticGen() {
    this.body = yield readFileThunk(__dirname + htmlFile);
  };
}
