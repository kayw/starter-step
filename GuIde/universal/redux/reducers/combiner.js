import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import { techcuz, docsio, people } from './gudmarks';

export default combineReducers({
  router: routerStateReducer,
  techcuz,
  docsio,
  people
});
