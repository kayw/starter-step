import { fromJS } from 'immutable';
import { gudmarksReducer, gudmarksCreate, gudmarksDelete } from './gudmarks-action';
const CREATION = 'techcuz/CREATION';
const CREATION_SUCCESS = 'techcuz/CREATION_SUCCESS';
const CREATION_FAIL = 'techcuz/CREATION_FAIL';
const SELECT_LINK = 'techcuz/SELECT_LINK';
const DELETION = 'techcuz/DELETION';
const DELETION_SUCCESS = 'techcuz/DELETION_SUCCESS';
const DELETION_FAIL = 'techcuz/DELETION_FAIL';

const initialState = fromJS({
  selectedIndex: -1,
  gulinks: []
});

export default function reducer(state = initialState, action = {}) {
  return gudmarksReducer(state, action, [CREATION, CREATION_SUCCESS, CREATION_FAIL, SELECT_LINK, DELETION, DELETION_SUCCESS, DELETION_FAIL]);
}

export function createLink(gulink) {
  return gudmarksCreate([CREATION, CREATION_SUCCESS, CREATION_FAIL], gulink);
}

export function selectLink(index) {
  return {
    type: SELECT_LINK,
    index
  };
}

export function deleteLink(selected, id, category) {
  return gudmarksDelete([DELETION, DELETION_SUCCESS, DELETION_FAIL], selected, id, category);
}
