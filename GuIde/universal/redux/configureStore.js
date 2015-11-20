import { compose, createStore, applyMiddleware } from 'redux';
import createClientApi from './middlewares/api';
import transitionMw from './middlewares/transition';
import rootReducer from './reducers/combiner';

// https://github.com/emmenko/redux-react-router-async-example/blob/master/lib/utils/configure-store.js
export default function configureStore(reduxReactRouter, getRoutes, createHistory, initialState) {
  let createMiddlewaredStore;
  const apiMiddleware = createClientApi();
  const storeEnhancers = [reduxReactRouter({getRoutes, createHistory}), applyMiddleware(apiMiddleware, transitionMw)];
  if (__DEVTOOLS__) {
    const DevTools = require('../components/redux-dev-dock');
    storeEnhancers.push(DevTools.instrument());
  }
  createMiddlewaredStore = compose(...storeEnhancers)(createStore);
  const store = createMiddlewaredStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('./reducers/combiner', () => {
      const nextRootReducer = require('./reducers/combiner');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
