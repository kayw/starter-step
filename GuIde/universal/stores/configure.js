import { compose, createStore, applyMiddleware } from 'redux';
import { devTools } from 'redux-devtools';
import createLogger from '../redux/middlewares/logger';
import createClientApi from '../redux/middlewares/api';
import rootReducer from '../redux/reducers/combiner';
import config from '../config';

export default function configureStore (initialState) {
  let createMiddlewaredStore;
  const apiMiddleware = createClientApi();
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
  const __DEBUG__ = config.get('globals').__DEBUG__;
  if (__DEBUG__) {
    createMiddlewaredStore = compose(applyMiddleware(apiMiddleware, logger), devTools())(createStore);
  } else {
    createMiddlewaredStore = applyMiddleware(apiMiddleware)(createStore);
  }
  const store = createMiddlewaredStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../redux/reducers/combiner', () => {
      const nextRootReducer = require('../redux/reducers/combiner');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
