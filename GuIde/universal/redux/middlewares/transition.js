import { ROUTER_DID_CHANGE } from 'redux-router/lib/constants';

const locationsAreEqual = (locA, locB) => (locA.pathname === locB.pathname)
  && (locA.search === locB.search);

const getDataDependency = (component = {}, methodName) => component.WrappedComponent ?
    getDataDependency(component.WrappedComponent, methodName) :
    component[methodName];

const getDataDependencies = (components, getState, dispatch, location, params, deferred) => {
  const methodName = deferred ? 'fetchDataDeferred' : 'fetchData';

  return components
    .filter((component) => getDataDependency(component, methodName))
    // only look at ones with a static fetchData()
    .map((component) => getDataDependency(component, methodName))
    // pull out fetch data methods
    .map(fetchData =>
      fetchData(getState, dispatch, location, params));
      // call fetch data methods and save promises
};

// https://github.com/este/este/blob/master/src/server/frontend/render.js
function fetchComponentData(components, locals) {
  const promises = (Array.isArray(components) ? components : [components])
  .filter(component => component) // filter undefined because of redux-router addition
  .reduce((fetchers, component) => fetchers.concat(component.fetchers || []), [])
  .map(fetcher => fetcher(locals));

  return Promise.all(promises);
}

export default ({ getState, dispatch }) => next => action => {
  if (action.type === ROUTER_DID_CHANGE) {
    if (getState().router && locationsAreEqual(action.payload.location,
                                               getState().router.location)) {
      return next(action);
    }

    const { components, location, params } = action.payload;
    const promise = new Promise((resolve) => {
      const doTransition = () => {
        next(action);
        Promise.all(getDataDependencies(components, getState, dispatch, location, params, true))
          .then(resolve, resolve);
      };

      fetchComponentData(components, { state: getState(), dispatch, location, params }).then(
        doTransition, doTransition);
    });

    if (!__CLIENT__) {
      // router state is null until ReduxRouter is created so we can use this to store
      // our promise to let the server know when it can render
      getState().router = promise;
    }

    return promise;
  }

  return next(action);
};
