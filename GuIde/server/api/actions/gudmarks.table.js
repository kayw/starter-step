import log from '../../../universal/helpers/inspector';
export function insertGudmark(table, params, body) {
  return function *insertMark() {
    try {
      const result = yield r.table(table).insert(body);
      return result;
    } catch (e) {
      log(e.message);
    }
  };
}

export function getGudmarks(table) {
  return function *get() {
    try {
      const result = yield r.table(table).orderBy('_id');
      return { [table]: { gulinks: result } };
    } catch (e) {
      log(e.message);
    }
  };
}

export function delGudmark(table, body) {
  return function *del() {
    try {
      console.log(body);
      const result = yield r.table(table).get(body.id).delete();
      return result;
    } catch (e) {
      log(e.message);
    }
  }
}
