import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import counter from './counter';
import { techcuz, docsio, people } from './gudmarks';

export default combineReducers({
  router: routerStateReducer,
  counter,
  techcuz,
  docsio,
  people
});
