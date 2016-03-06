import { compose, createStore, applyMiddleware } from 'redux';
import createClientApi from './middlewares/api';
import rootReducer from './reducers/combiner';

// https://github.com/emmenko/redux-react-router-async-example/blob/master/lib/utils/configure-store.js
export default function configureStore(initialState) {
  const apiMiddleware = createClientApi();
  const storeEnhancers = [ applyMiddleware(apiMiddleware) ];
  if (__DEVTOOLS__) {
    const DevTools = require('../components/redux-dev-dock');
    storeEnhancers.push(DevTools.instrument());
  }
  const createMiddlewaredStore = compose(...storeEnhancers)(createStore);
  const store = createMiddlewaredStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('./reducers/combiner', () => {
      const nextRootReducer = require('./reducers/combiner');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
