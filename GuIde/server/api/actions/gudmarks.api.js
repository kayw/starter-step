import ndebug from 'debug';
const debug = ndebug('guide');
export function create(params, body) {
  return function *updateMark() {
    try {
      const result = yield r.db('guide').table('gudmarks').update({
          'techcuz': r.row('techcuz').default([]).append(body)
        }).run();
      return result;
    } catch (e) {
      debug(e.message);
    }
  };
}
