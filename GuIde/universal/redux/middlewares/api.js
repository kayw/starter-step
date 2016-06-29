import superagent from 'superagent';
import debug from '../../helpers/inspector';

function apiPromiseRequest() {
  const requests = {};
  ['get', 'post', 'patch', 'del', 'put'].forEach((method) => {
    requests[method] = (endpoint, option) => {
      const furl = (endpoint.indexOf(__API_ROOT__) === -1) ? __API_ROOT__ + endpoint : endpoint;
      return new Promise((resolve, reject) => {
        const request = superagent[method](furl);
        if (option && option.params) {
          request.query(option.params);
        }
        if (option && option.data) {
          request.send(option.data);
        }
        request.end((err, resp) => {
          if (err) {
            debug('api request error', err.toString());
            return reject(err);
          }
          return resolve(resp.body);
        });
      });
    };
  });
  return requests;
}

export const CLIENT_API = Symbol('client');
export default function clientMiddleware() {
  const requests = apiPromiseRequest();
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    const caller = action[CLIENT_API];
    if (typeof caller === 'undefined') {
      return next(action);
    }

    // https://github.com/babel/babel-eslint/issues/249  rest spread espree eslint error
    const { endpoint, method, types, ...rest } = caller;

    if (typeof endpoint !== 'string') {
      throw new Error('Specify a string endpoint URL.');
    }
    if (!Array.isArray(types) || types.length !== 3) {
      throw new Error('Expected an array of three action types.');
    }
    if (!types.every(type => typeof type === 'string')) {
      throw new Error('Expected action types to be strings.');
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ ...rest, type: REQUEST });
    return requests[method](endpoint, { ...rest }).then(
      result => {
        next({ ...rest, result, type: SUCCESS });
        return result;
      }
    ).catch(error => {
      next({ ...rest, error, type: FAILURE });
      return error;
    });
  };
}
