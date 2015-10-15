import { combineReducers } from 'redux';
import counter from './counter';
import gudmarks from './gudmarks';

export default combineReducers({
  counter,
  gudmarks
});
