import koa from 'koa';
import assets from 'koa-static';
import renderRouter from './middleware/render-route';
import responseTime from './middleware/response-time';
import logger from './middleware/logger';
import api from './api/api-router';
import conf from '../universal/config';
import { argv } from 'yargs';
import rethink from 'rethinkdbdash';
import debug from 'debug';

global.r = rethink();

const globals = conf.get('globals');
globals.__DEBUG_NW__ = !!argv.nw;

const app = koa();
app.context.json = app.response.json = function (obj) {
  this.charset = this.charset || 'utf-8';
  this.set('Content-Type', 'application/json; charset=' + this.charset);
  this.body = JSON.stringify(obj);
};

app.use(responseTime);
app.use(logger);
app.use(assets(conf.get('project_root')));

app.use(api());
app.use(renderRouter());

app.listen(conf.get('server_port'));
debug('guide')('koa server started');
