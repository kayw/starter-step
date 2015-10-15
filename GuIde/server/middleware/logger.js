import ndebug from 'debug';
const debug = ndebug('guide');
module.exports = function *loggerMiddleware (next) {
  const start = new Date();

  yield next;

  const ms = new Date() - start;
  debug('%s %s - %sms', this.method, this.url, ms);
};
