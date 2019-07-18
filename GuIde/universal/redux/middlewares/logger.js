const pad = num => `${num}`.slice(-2);
// https://github.com/fcomb/redux-logger

// Use the new performance api to get better precision if available
const timer = typeof performance !== 'undefined' && typeof performance.now === 'function'
  ? performance : Date;

/**
 * Creates logger with followed options
 *
 * @namespace
 * @property {object} options - options for logger
 * @property {string} options.level - console[level]
 * @property {object} options.logger - implementation of the `console` API.
 * @property {boolean} options.collapsed - is group collapsed?
 * @property {boolean} options.predicate - condition which resolves logger behavior
 * @property {bool} options.duration - print duration of each action?
 * @property {bool} options.timestamp - print timestamp with each action?
 * @property {function} options.transformer - transform state before print
 * @property {function} options.actionTransformer - transform action before print
 */

function createLogger(options = {}) {
  return ({ getState }) => next => (action) => {
    const {
      level,
      logger,
      collapsed,
      predicate,
      duration = false,
      timestamp = true,
      transformer = state => state,
      actionTransformer = actn => actn,
    } = options;

    const logFn = logger || console;

    // exit if logFn undefined
    if (typeof logFn === 'undefined') {
      return next(action);
    }

    // exit early if predicate function returns false
    if (typeof predicate === 'function' && !predicate(getState, action)) {
      return next(action);
    }

    const started = timer.now();
    const prevState = transformer(getState());

    const returnValue = next(action);
    const took = timer.now() - started;

    const nextState = transformer(getState());

    // formatters
    const time = new Date();
    const isCollapsed = (typeof collapsed === 'function') ? collapsed(getState, action) : collapsed;

    const formattedTime = timestamp ?
      ` @ ${time.getHours()}:${pad(time.getMinutes())}:${pad(time.getSeconds())}` : '';
    const formattedDuration = duration ? ` in ${took.toFixed(2)} ms` : '';
    const formattedAction = actionTransformer(action);
    const message = `action ${formattedAction.type}${formattedTime}${formattedDuration}`;
    const startMessage = isCollapsed ? logFn.groupCollapsed : logFn.group;

    // render
    try {
      startMessage(message);
    } catch (e) {
      logFn.log(message);
    }

    if (level) {
      logFn[level]('%c prev state', 'color: #9E9E9E; font-weight: bold', prevState);
      logFn[level]('%c action', 'color: #03A9F4; font-weight: bold', formattedAction);
      logFn[level]('%c next state', 'color: #4CAF50; font-weight: bold', nextState);
    } else {
      logFn.log('%c prev state', 'color: #9E9E9E; font-weight: bold', prevState);
      logFn.log('%c action', 'color: #03A9F4; font-weight: bold', formattedAction);
      logFn.log('%c next state', 'color: #4CAF50; font-weight: bold', nextState);
    }

    try {
      logFn.groupEnd();
    } catch (e) {
      logFn.log('—— log end ——');
    }

    return returnValue;
  };
}

export default createLogger;
/* https://github.com/fcomb/redux-logger/blob/master/examples/basic/containers/root.jsx
const logger = createLogger({
  predicate: (getState, action) => action.type !== AUTH_REMOVE_TOKEN,
  // log all actions except AUTH_REMOVE_TOKEN
  level: `info`,
  duration: true,
  actionTransformer: (action) => {
    return {
      ...action,
      type: String(action.type),
    };
  }
});
*/
