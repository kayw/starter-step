// https://github.com/gaearon/redux-thunk
export default function thunkMiddleware({ dispatch, getState }) {
  return next => action =>
  typeof action === 'function' ?
    action(dispatch, getState) :
    next(action);
}
