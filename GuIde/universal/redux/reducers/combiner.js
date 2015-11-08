import { combineReducers } from 'redux';
import counter from './counter';
import { techcuz, docsio, people } from './gudmarks';

export default combineReducers({
  counter,
  techcuz,
  docsio,
  people
});
