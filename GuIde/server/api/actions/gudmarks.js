import Redis from 'ioredis';
import winston from 'winston';
import { workerQueueKey } from '../../../universal/constants';
import log from '../../../universal/helpers/inspector';

const client = new Redis(); // 127.0.0.1:6379
winston.loggers.add('bookmarks', {
  file: {
    level: 'info',
    filename: './pm2/log/bookmarks.json',
    handleExceptions: true,
    json: true,
    colorize: false,
  },
});

const logger = winston.loggers.get('bookmarks');

// https://github.com/neumino/rethinkdbdash-examples/blob/master/todo/app.js
function post(table) {
  return function insertGudmark(params, body) {
    return function* insertMark() {
      try {
        logger.info(body);
        const result = yield r.table(table).insert({
          _id: `${table}${body._id}`,
          order: body._id,
          name: body.name,
          links: body.links,
          source: body.source,
        });
        return result;
      } catch (e) {
        log('insert bookmarks', e.message);
        return e;
      }
    };
  };
}

function get(table) {
  return function getGudmarks() {
    return function* getGen() {
      try {
        const result = yield r.table(table).orderBy('order');
        return { [table]: { gulinks: result } };
      } catch (e) {
        return log(e.message);
      }
    };
  };
}

function put(table) {
  return function updateGudmark(params, body) {
    return function* update() {
      try {
        logger.info({ name: body.name, links: body.links });
        const result = yield r.table(table).get(body._id).update({
          name: body.name,
          links: body.links,
          source: body.source,
        });
        return result;
      } catch (e) {
        return log(e.message);
      }
    };
  };
}
function del(table) {
  return function delGudmark(params, body) {
    return function* delGen() {
      try {
        const result = yield r.table(table).get(body.id).delete();
        return result;
      } catch (e) {
        return log(e.message);
      }
    };
  };
}

function order(table) {
  return function reorder(params, body) {
    return function* reorderGen() {
      // console.log(body, params);
      try {
        /*
         * [{_id:, order: }, ]
         *
         */
        for (let i = 0; i < body.length; ++i) {
          yield r.table(table).get(body[i]._id).update({
            order: body[i].order,
          });
        }
        return true;
      } catch (e) {
        return log(e.message);
      }
    };
  };
}

function reload(table) {
  return function reloadFn(params, body) {
    return function* reloadGen() {
      const { id, from, name } = body;
      yield r.table(table).get(body.id).update({ building: true });
      yield client.lpush(workerQueueKey, JSON.stringify({
        id, name, from,
        type: 'docsio',
      }));
      return true;
    };
  };
}

const methodsAggreate = table => ({
  reload: reload(table),
  order: order(table),
  get: get(table),
  post: post(table),
  put: put(table),
  delete: del(table),
});

export const techcuz = methodsAggreate('techcuz');
export const docsio = methodsAggreate('docsio');
export const people = methodsAggreate('people');
