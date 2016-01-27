import React from 'react';
import ReactDom from 'react-dom/server';
import { reduxReactRouter, match } from 'redux-router/server';
import createHistory from 'history/lib/createMemoryHistory';
import createStore from './redux/configureStore';
import getRoutes from './components/routes';
import App from './components/app';
import Html from './components/html';
import OldView from '../client/views/old';
// import { match } from 'react-router';
// import createLocation from 'history/lib/createLocation';

export default function render(url, initialState) {
  return new Promise((resolve, reject) => {
    const store = createStore(reduxReactRouter, getRoutes, createHistory, initialState);
    /*
    const routes = getRoutes();
    const location = createLocation(url);
    match({ routes, location }, (err, redirection, props) => {
      if (err) {
        reject([500], err);
      } else if (redirection) {
        reject([301, redirection]);
      } else if (!props) {
        reject([404]);
      } else {
        console.log('store getstate', store.getState());
        const component = (<App store= { store } />);
        const htmls = ReactDom.renderToStaticMarkup(
          <Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>
        );
        resolve(`<!doctype html>\n${htmls}`);
      }
    });
   */
    store.dispatch(match(url, (err, redirection, routerState) => {
      if (err) {
        reject([500], err);
      } else if (redirection) {
        reject([301, redirection]);
      } else if (!routerState) {
        reject([404]);
      } else {
        store.getState().router.then(() => {
          console.log('store getstate', store.getState());
          const component = (<App store= { store } />);
          let htmls = '';
          try {
            htmls = ReactDom.renderToStaticMarkup(
              <Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>
            );
          } catch (e) {
            console.log('render static markup error', e && e.stack);
          }
          resolve(`<!doctype html>\n${htmls}`);
        });
      }
    }));
  });
}

export function renderOldPage() {
  const component = (<OldView />);
  return ReactDom.renderToString(component);
}
