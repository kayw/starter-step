export default function logger(...fnargs) {
  let logFn = console;
  logFn = logFn.log.bind(logFn);
  const args = [...fnargs];
  if (typeof window === 'object') {
    args.forEach((arg, i) => {
      if (typeof arg === 'object') {
        args[i] = JSON.stringify(arg, null, 4);
      }
    });
  } else {
    const inspect = require('util').inspect;
    args.forEach((arg, i) => {
      if (typeof arg === 'object') {
        args[i] = inspect(arg, { showHidden: false, depth: null });
      }
    });
  }
  logFn.apply(this, args);
}
