import debug from '../../universal/helpers/inspector';
module.exports = function loggerMiddleware() {
  return function *loggerGen(next) {
    const start = new Date();

    yield next;

    const ms = new Date() - start;
    debug('%s %s - %sms', this.method, this.url, ms);
  };
};
