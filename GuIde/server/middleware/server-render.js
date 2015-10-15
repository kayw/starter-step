import { match } from 'react-router';
import createLocation from 'history/lib/createLocation';
import routes from '../../universal/components/routes';
import renderHtml from '../../universal/html-render';

export default function render(url, initialState) {
  return new Promise((resolve, reject) => {
    const location = createLocation(url);
    match({ routes, location }, (err, redirection, props) => {
      if (err) {
        reject([500], err);
      } else if (redirection) {
        reject([301, redirection]);
      } else if (!props) {
        reject([404]);
      } else {
        const htmls = renderHtml(initialState);
        resolve(`<!doctype html>\n${htmls}`);
      }
    });
  });
}
