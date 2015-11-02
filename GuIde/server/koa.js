import koa from 'koa';
import assets from 'koa-static';
import renderRouter from './middleware/render-route';
import responseTime from './middleware/response-time';
import logger from './middleware/logger';
import api, { getApiResult } from './api/api-router';
import conf from '../universal/config';
import rethink from 'rethinkdbdash';
import debug from '../universal/helpers/inspector';

global.r = rethink(conf.get('rethinkdb'));

const app = koa();
app.context.json = app.response.json = function json(obj) {
  this.charset = this.charset || 'utf-8';
  this.set('Content-Type', 'application/json; charset=' + this.charset);
  this.body = JSON.stringify(obj);
};

app.use(responseTime);
app.use(logger);
app.use(assets(conf.get('project_root')));

app.use(api());
app.use(renderRouter(getApiResult));

app.listen(process.env.PORT || conf.get('server_port'));
debug('koa server started');
