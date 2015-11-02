import debug from '../../../universal/helpers/inspector';
export function post(params, body) {
  return function *updateMark() {
    try {
      const result = yield r.db('guide').table('gudmarks').insert(Object.assign({}, body.category, body[body.category])).run();
      return result;
    } catch (e) {
      debug(e.message);
    }
  };
}
