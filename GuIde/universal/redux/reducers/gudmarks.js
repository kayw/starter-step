import { fromJS, Map as immutifyMap } from 'immutable';
import { CLIENT_API } from '../middlewares/api';

// https://github.com/rackt/redux/issues/822
const initialState = fromJS({
  loaded: false,
  gulinks: []
});

function liftedReducer(actionTypes) {
  return function reducer(state = initialState, action = {}) {
    switch (action.type) {
    case actionTypes.LOAD_SUCCESS:
      return state.set('loaded', true).set('gulinks', fromJS(action.result[action.category].gulinks));
    case actionTypes.CREATION:
      return state;
    case actionTypes.CREATION_SUCCESS:
      return state.update('gulinks', list => list.push(immutifyMap(action.data)));
    case actionTypes.MODIFICATION_SUCCESS:
      return state.update('gulinks', list => {
        const gulink = action.data;
        return list.update(action.index, old =>
          old.set('name', gulink.name).set('source', gulink.source)
          .set('links', fromJS(gulink.links)));
      });
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
  const atypes = ['LOAD', 'LOAD_SUCCESS', 'LOAD_FAIL',
    'CREATION', 'CREATION_SUCCESS', 'CREATION_FAIL',
    'MODIFICATION', 'MODIFICATION_SUCCESS', 'MODIFICATION_FAIL',
    'DELETION', 'DELETION_SUCCESS', 'DELETION_FAIL' ];
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

function liftedLoadLink(category, actionTypes) {
  return function loadLink() {
    return {
      [CLIENT_API]: {
        types: [actionTypes.LOAD, actionTypes.LOAD_SUCCESS, actionTypes.LOAD_FAIL],
        endpoint: category,
        method: 'get',
        category
      }
    };
  };
}
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

function liftedModifyLink(actionTypes) {
  return function modifyLink(index, gulink) {
    return {
      [CLIENT_API]: {
        types: [actionTypes.MODIFICATION, actionTypes.MODIFICATION_SUCCESS, actionTypes.MODIFICATION_FAIL],
        endpoint: gulink.category,
        method: 'put',
        index,
        data: gulink[gulink.category]
      }
    };
  };
}

function isLoaded(state, category) {
  return state[category] && state[category].get('loaded');
}

const techcuzCreateLink = liftedCreateLink(techcuzActionType);
const docsioCreateLink = liftedCreateLink(docsioActionType);
const peopleCreateLink = liftedCreateLink(peopleActionType);

const techcuzDeleteLink = liftedDelLink(techcuzActionType);
const docsioDeleteLink = liftedDelLink(docsioActionType);
const peopleDeleteLink = liftedDelLink(peopleActionType);

const techcuzModifyLink = liftedModifyLink(techcuzActionType);
const docsioModifyLink = liftedModifyLink(docsioActionType);
const peopleModifyLink = liftedModifyLink(peopleActionType);

const techcuzLoadLink = liftedLoadLink('techcuz', techcuzActionType);
const docsioLoadLink = liftedLoadLink('docsio', docsioActionType);
const peopleLoadLink = liftedLoadLink('people', peopleActionType);

['RELOAD', 'RELOAD_SUCCESS', 'RELOAD_FAIL'].forEach((at) => {
  docsioActionType[at] = `@@docsio/${at}`;
});
function docsioReload(category, docName) {
  return {
    [CLIENT_API]: {
      types: [docsioActionType.RELOAD, docsioActionType.RELOAD_SUCCESS, docsioActionType.RELOAD_FAIL],
      endpoint: category,
      method: 'post',
      data: docName
    }
  };
}

export {
  isLoaded, docsioReload,
  techcuz, techcuzCreateLink, techcuzDeleteLink, techcuzModifyLink, techcuzLoadLink,
  docsio, docsioCreateLink, docsioDeleteLink, docsioModifyLink, docsioLoadLink,
  people, peopleCreateLink, peopleDeleteLink, peopleModifyLink, peopleLoadLink
};
