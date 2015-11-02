import React from 'react';
import ReactDom from 'react-dom/server';
import { match } from 'react-router';
import createLocation from 'history/lib/createLocation';
import createStore from './redux/configureStore';
import routes from './components/routes';
import App from './components/app';
import Html from './components/html';

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
        // console.log({ ...props });
        const store = createStore(initialState);
        const component = (<App routingContext = { props } store= { store } />);
        const htmls = ReactDom.renderToStaticMarkup(
          <Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>
        );
        resolve(`<!doctype html>\n${htmls}`);
      }
    });
  });
}
