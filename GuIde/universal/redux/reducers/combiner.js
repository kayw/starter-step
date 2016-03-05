import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import { techcuz, docsio, people } from './gudmarks';

module.exports = combineReducers({
  router: routerStateReducer,
  techcuz,
  docsio,
  people
});
