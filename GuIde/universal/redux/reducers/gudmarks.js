import { fromJS, Map as immutifyMap } from 'immutable';
import { CLIENT_API } from '../middlewares/api';

const initialState = fromJS({
  selectedIndex: -1,
  gulinks: []
});

function liftedReducer(actionTypes) {
  return function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case actionTypes.CREATION:
      return state;
    case actionTypes.CREATION_SUCCESS:
      return state.update('gulinks', list => list.push(immutifyMap(action.data)));
    case actionTypes.SELECT_LINK:
      return state.set('selectedIndex', action.index);
    case actionTypes.DELETION_SUCCESS:
      return state.update('gulinks', list => list.delete(action.data.index));
    case actionTypes.DELETION_FAIL:
    case actionTypes.DELETION:
    case actionTypes.CREATION_FAIL:
    default:
      return state;
    }
  };
}

function formActionType(domain) {
  const atypes = [ 'CREATION', 'CREATION_SUCCESS', 'CREATION_FAIL', 'DELETION',
    'DELETION_SUCCESS', 'DELETION_FAIL', 'SELECT_LINK' ];
  const actionType = {};
  atypes.forEach((at) => {
    actionType[at] = `@@${domain}/${at}`;
  });
  return actionType;
}
const techcuzActionType = formActionType('techcuz');
const docsioActionType = formActionType('docsio');
const peopleActionType = formActionType('people');

const techcuz = liftedReducer(techcuzActionType);
const docsio = liftedReducer(docsioActionType);
const people = liftedReducer(peopleActionType);

/*
const techcuz = liftedReducer({
  CREATION: '@@techcuz/CREATION',
  CREATION_SUCCESS: '@@techcuz/CREATION_SUCCESS',
  CREATION_FAIL: '@@techcuz/CREATION_FAIL',
  DELETION: '@@techcuz/DELETION',
  DELETION_SUCCESS: '@@techcuz/DELETION_SUCCESS',
  DELETION_FAIL: '@@techcuz/DELETION_FAIL',
  SELECT_LINK: '@@techcuz/SELECT_LINK'
});
const docsio = liftedReducer({
  CREATION: '@@docsio/CREATION',
  CREATION_SUCCESS: '@@docsio/CREATION_SUCCESS',
  CREATION_FAIL: '@@docsio/CREATION_FAIL',
  DELETION: '@@docsio/DELETION',
  DELETION_SUCCESS: '@@docsio/DELETION_SUCCESS',
  DELETION_FAIL: '@@docsio/DELETION_FAIL',
  SELECT_LINK: '@@docsio/SELECT_LINK'
});
const people = liftedReducer({
  CREATION: '@@people/CREATION',
  CREATION_SUCCESS: '@@people/CREATION_SUCCESS',
  CREATION_FAIL: '@@people/CREATION_FAIL',
  DELETION: '@@people/DELETION',
  DELETION_SUCCESS: '@@people/DELETION_SUCCESS',
  DELETION_FAIL: '@@people/DELETION_FAIL',
  SELECT_LINK: '@@people/SELECT_LINK'
});
*/

function liftedCreateLink(actionTypes) {
  return function createLink(gulink) {
    return {
      [CLIENT_API]: {
        types: [actionTypes.CREATION, actionTypes.CREATION_SUCCESS, actionTypes.CREATION_FAIL],
        endpoint: gulink.category,
        method: 'post',
        data: gulink[gulink.category]
      }
    };
  };
}

function liftedDelLink(actionTypes) {
  return function deleteLink(selected, id, category) {
    return {
      [CLIENT_API]: {
        types: [actionTypes.DELETION, actionTypes.DELETION_SUCCESS, actionTypes.DELETION_FAIL],
        endpoint: category,
        method: 'del',
        data: { index: selected, id }
      }
    };
  };
}

function liftedSelectLink(actionTypes) {
  return function selectLink(index) {
    return {
      type: actionTypes.SELECT_LINK,
      index
    };
  };
}

const techcuzCreateLink = liftedCreateLink(techcuzActionType);
const docsioCreateLink = liftedCreateLink(docsioActionType);
const peopleCreateLink = liftedCreateLink(peopleActionType);

const techcuzDeleteLink = liftedDelLink(techcuzActionType);
const docsioDeleteLink = liftedDelLink(docsioActionType);
const peopleDeleteLink = liftedDelLink(peopleActionType);

const techcuzSelectLink = liftedSelectLink(techcuzActionType);
const docsioSelectLink = liftedSelectLink(docsioActionType);
const peopleSelectLink = liftedSelectLink(peopleActionType);

export {
  techcuz, techcuzCreateLink, techcuzDeleteLink, techcuzSelectLink,
  docsio, docsioCreateLink, docsioDeleteLink, docsioSelectLink,
  people, peopleCreateLink, peopleDeleteLink, peopleSelectLink
};
