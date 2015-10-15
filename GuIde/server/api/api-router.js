import * as actions from './actions/index';
import cobody from 'co-body';
import ndebug from 'debug';
const debug = ndebug('guide');
/*
      yield r.dbCreate("guide").run();
      yield r.db("guide").tableCreate("gudmarks").run();
      yield r.db("quake").table("quakes")
      .indexCreate("geometry", {geo: true}).run();

*/
export default function useApi() {
  return function *runApi (next) {
    let action = false;
    let params = null;
    let apiActions = actions;
    let sliceIndex = 0;

    debug('api actions ', actions);
    debug('api action url %s', this.request.url);
    const matcher = this.request.url.split('?')[0].split('/').slice(2);
    debug('api action %s', matcher);
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
    try {
      if (action && typeof action === 'function') {
        const body = yield cobody(this);
        const result = yield action(params, body);
        this.json(result);
      } else {
        yield *next;
        // this.status(404).end('NOT FOUND');
      }
    } catch (err) {
      this.body = err.message;
    }
  };
}
