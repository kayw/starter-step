import { combineReducers } from 'redux';
import counter from './counter';
import techcuz from './techcuz';

export default combineReducers({
  counter,
  techcuz
});
