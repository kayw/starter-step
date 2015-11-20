import { DELETE } from '../../../universal/constants';
import log from '../../../universal/helpers/inspector';
import winston from 'winston';
winston.loggers.add('bookmarks', {
  file: {
    level: 'info',
    filename: './pm2/log/bookmarks.json',
    handleExceptions: true,
    json: true,
    colorize: false
  }
});

const logger = winston.loggers.get('bookmarks');

function post(table) {
  return function insertGudmark(params, body) {
    return function *insertMark() {
      try {
        logger.info(body);
        const result = yield r.table(table).insert(body);
        return result;
      } catch (e) {
        log('insert bookmarks', e.message);
      }
    };
  };
}

function get(table) {
  return function getGudmarks() {
    return function *get() {
      try {
        const result = yield r.table(table).orderBy('cursor');
        return { [table]: { gulinks: result } };
      } catch (e) {
        log(e.message);
      }
    };
  };
}

function put(table) {
  return function updateGudmark(params, body) {
    return function *update() {
      try {
        logger.info({ name: body.name, links: body.links });
        const result = yield r.table(table).get(body._id).update({ name: body.name,
                                                                 links: body.links, source: body.source });
        return result;
      } catch (e) {
        log(e.message);
      }
    };
  };
}
function del(table) {
  return function delGudmark(params, body) {
    return function *del() {
      try {
        const result = yield r.table(table).get(body.id).delete();
        return result;
      } catch (e) {
        log(e.message);
      }
    };
  };
}

const techcuz = {
  get: get('techcuz'),
  post: post('techcuz'),
  put: put('techcuz'),
  [DELETE]: del('techcuz')
};
const docsio = {
  get: get('docsio'),
  post: post('docsio'),
  put: put('docsio'),
  [DELETE]: del('docsio')
};
const people = {
  get: get('people'),
  post: post('people'),
  put: put('people'),
  [DELETE]: del('people')
};

export default {
  techcuz,
  docsio,
  people
}
