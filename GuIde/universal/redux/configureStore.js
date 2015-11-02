import { compose, createStore, applyMiddleware } from 'redux';
import createClientApi from './middlewares/api';
import rootReducer from './reducers/combiner';

export default function configureStore (initialState) {
  let createMiddlewaredStore;
  const apiMiddleware = createClientApi();
  if (__DEV__) {
    const createLogger = require('./middlewares/logger');
    const logger = createLogger(/* https://github.com/fcomb/redux-logger/blob/master/examples/basic/containers/root.jsx
                                   {
      predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN, // log all actions except AUTH_REMOVE_TOKEN
        level: `info`,
      duration: true,
      actionTransformer: (action) => {
        return {
          ...action,
          type: String(action.type),
        };
      }
    }*/);
    const storeEnhancers = [applyMiddleware(apiMiddleware, logger)];
    if (__DEVTOOLS__) {
      const DevTools = require('../components/redux-dev-dock');
      storeEnhancers.push(DevTools.instrument());
    }
    createMiddlewaredStore = compose(...storeEnhancers)(createStore);
  } else {
    createMiddlewaredStore = applyMiddleware(apiMiddleware)(createStore);
  }
  const store = createMiddlewaredStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('./reducers/combiner', () => {
      const nextRootReducer = require('./reducers/combiner');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
