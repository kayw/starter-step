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

// https://github.com/neumino/rethinkdbdash-examples/blob/master/todo/app.js
function post(table) {
  return function insertGudmark(params, body) {
    return function *insertMark() {
      try {
        logger.info(body);
        const result = yield r.table(table).insert({
          _id: `${table}${body._id}`,
          order: body._id,
          name: body.name,
          links: body.links,
          source: body.source
        });
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
        const result = yield r.table(table).orderBy('order');
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
        const result = yield r.table(table).get(body._id).update({
          name: body.name,
          links: body.links,
          source: body.source
        });
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

function order(table) {
  return function reorder(params, body) {
    return function *reorder() {
      console.log(body, params);
      try {
        /*
         * TODO: add order field, transfer {_id:, order:} body
         * update order Maybe can cache previous order and only pass changed id orders
         *
        for (let i = 0; i < body.length; ++i) {
          yield r.table(table).nth(i).replace({
            _id: `${table}${i}`,
            name: body[i].name,
            links: body[i].links,
            source: body[i].source
          });
        }
       */
        yield r.table(table).delete();
        for (let i = 0; i < body.length; ++i) {
          yield r.table(table).insert({
            _id: `${table}${i}`,
            order: i,
            name: body[i].name,
            links: body[i].links,
            source: body[i].source
          });
        }
        return true;
      } catch (e) {
        log(e.message);
      }
    };
  };
}

const methodsAggreate = (table) => ({
  order: order(table),
  get: get(table),
  post: post(table),
  put: put(table),
  delete: del(table)
});
const techcuz = methodsAggreate('techcuz');
const docsio = methodsAggreate('docsio');
const people = methodsAggreate('people');

export default {
  techcuz,
  docsio,
  people
}
