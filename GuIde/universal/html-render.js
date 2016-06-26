import React from 'react';
import ReactDom from 'react-dom/server';
import createStore from './redux/configureStore';
import getRoutes from '../client/routes';
import App from './components/app';
import Html from './components/html';
import OldView from '../client/views/old';
import { match } from 'react-router';
import debug from './helpers/inspector';

// https://github.com/este/este/blob/master/src/server/frontend/render.js
function fetchComponentData(components, locals, deferred) {
  const promises = (Array.isArray(components) ? components : [components])
  .filter(component => component) // filter undefined because of redux-router addition
  .reduce((fetchers, component) => fetchers.concat(
    (deferred ? component.deferredfetchers : component.fetchers) || []
  ), [])
  .map(fetcher => fetcher(locals));

  return Promise.all(promises);
}
function loadOnServer(renderProps, store) {
  const { getState, dispatch } = store;
  const { components, location, params } = renderProps;
  const locals = { state: getState(), dispatch, location, params };
  return new Promise(resolve => {
    const doTransition = () =>
    Promise.all(fetchComponentData(components, locals, true))
    .then(resolve, resolve);
    fetchComponentData(components, locals)
      .then(doTransition, doTransition)
      .catch(error => {
        debug(error);
        return doTransition();
      });
  });
}
export default function render(url, initialState) {
  return new Promise((resolve, reject) => {
    const store = createStore(initialState);
    const routes = getRoutes();
    match({ routes, location: url }, (err, redirection, props) => {
      if (err) {
        reject([500], err);
      } else if (redirection) {
        reject([301, redirection]);
      } else if (!props) {
        reject([404]);
      } else {
        loadOnServer(props, store).then(() => {
          debug('store getstate', store.getState());
          const component = (<App routingContext={props} store={store} />);
          let htmls = '';
          try {
            htmls = ReactDom.renderToStaticMarkup(
              <Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />
            );
          } catch (e) {
            debug('render static markup error', e && e.stack);
          }
          resolve(`<!doctype html>\n${htmls}`);
        });
      }
    });
    /*
    const consoleF = console;
    store.dispatch(match(url, (err, redirection, routerState) => {
      if (err) {
        reject([500], err);
      } else if (redirection) {
        reject([301, redirection]);
      } else if (!routerState) {
        reject([404]);
      } else {
        store.getState().router.then(() => {
          consoleF.log('store getstate', store.getState());
          const component = (<App store= { store } />);
          let htmls = '';
          try {
            htmls = ReactDom.renderToStaticMarkup(
              <Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />
            );
          } catch (e) {
            consoleF.log('render static markup error', e && e.stack);
          }
          resolve(`<!doctype html>\n${htmls}`);
        });
      }
    }));
   */
  });
}

export function renderOldPage() {
  const component = (<OldView />);
  return ReactDom.renderToString(component);
}
