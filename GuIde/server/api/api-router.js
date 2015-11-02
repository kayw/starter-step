import * as actions from './actions/index';
import cobody from 'co-body';
import debug from '../../universal/helpers/inspector';
/*
      yield r.dbCreate("guide").run();
      yield r.db("guide").tableCreate("gudmarks").run();
      yield r.db("quake").table("quakes")
      .indexCreate("geometry", {geo: true}).run();

*/
function findApiAction(url, method) {
  let action = false;
  let params = null;
  let apiActions = actions;
  let sliceIndex = 0;

  debug('api action url', url);
  const matcher = url.split('?')[0].split('/').slice(2);
  const apiMethod = method.toLowerCase() !== 'delete' ? method.toLowerCase() : 'del';
  matcher.push(apiMethod);
  debug('api action', matcher);
  for (const actionName of matcher) {
    if (apiActions[actionName]) {
      action = apiActions[actionName];
    }

    if (typeof action === 'function') {
      params = matcher.slice(++sliceIndex);
      break;
    }
    apiActions = action;
    ++sliceIndex;
  }
  return { action, params };
}

export default function useApi() {
  return function *runApi (next) {
    const { action, params } = findApiAction(this.request.url, this.method);
    try {
      if (action && typeof action === 'function') {
        const body = yield cobody(this);
        const result = yield action(params, body);
        this.json(result);
      } else {
        yield *next;
      }
    } catch (err) {
      this.body = err.message;
    }
  };
}

export function getApiResult(url, method, query) {
  return function *getApi () {
    const { action } = findApiAction(url, method);
    let result;
    try {
      if (action && typeof action === 'function') {
        result = yield action(query);
      }
      return result;
    } catch (err) {
      debug('get api result error', err);
      return null;
    }
  };
}
