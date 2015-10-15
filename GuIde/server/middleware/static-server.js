import fs from 'fs';

const readFileThunk = (src) => {
  return new Promise((resolve, reject) => {
    fs.readFile(src, {'encoding': 'utf8'}, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
};

// http://stackoverflow.com/questions/24024566/display-a-static-html-file-with-koa-js
export default function serveStatic(htmlFile) {
  return function *serveStaticGen() {
    this.body = yield readFileThunk(__dirname + htmlFile);
  };
}
