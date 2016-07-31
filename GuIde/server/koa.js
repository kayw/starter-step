import koa from 'koa';
import assets from 'koa-static';
import renderRouter from './middleware/render-route';
import responseTime from './middleware/response-time';
import logger from './middleware/logger';
import api from './api/api-router';
import conf from '../universal/config';
import debug from '../universal/helpers/inspector';
import { ensureDB } from './util/db';
const rdbConf = conf.get('rethinkdb');

ensureDB(r, rdbConf.db, rdbConf.tables, () => {
  const app = koa();
  app.context.json = app.response.json = function json(obj) {
    this.charset = this.charset || 'utf-8';
    this.set('Content-Type', `application/json; charset=${this.charset}`);
    this.body = JSON.stringify(obj);
  };

  app.use(responseTime());
  app.use(logger());
  app.use(assets(conf.get('assets_path')));

  app.use(api());
  app.use(renderRouter());

  app.listen(process.env.PORT || conf.get('server_port'));
  debug('koa server started');
});
