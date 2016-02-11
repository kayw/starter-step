import { fromJS, Map as immutifyMap } from 'immutable';
import { CLIENT_API } from '../middlewares/api';

// https://github.com/rackt/redux/issues/822
const initialState = fromJS({
  loaded: false,
  gulinks: []
  /*
   * [{_id: , order: , links: [], source: ,name: }]
   */
});

function liftedReducer(actionTypes) {
  return function reducer(state = initialState, action = {}) {
    switch (action.type) {
      case actionTypes.LOAD_SUCCESS:
        return state.set('loaded', true).set(
          'gulinks', fromJS(action.result[action.category].gulinks));
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
      case actionTypes.MOVE:
        return state.update('gulinks', list => list.splice(action.data.originIndex, 1).splice(
          action.data.atIndex, 0, list.get(action.data.originIndex)));
      default:
        return state;
    }
  };
}

function formActionType(domain) {
  const atypes = [
    'MOVE',
    'LOAD', 'LOAD_SUCCESS', 'LOAD_FAIL',
    'CREATION', 'CREATION_SUCCESS', 'CREATION_FAIL',
    'MODIFICATION', 'MODIFICATION_SUCCESS', 'MODIFICATION_FAIL',
    'REORDER', 'REORDER_SUCCESS', 'REORDER_FAIL',
    'DELETION', 'DELETION_SUCCESS', 'DELETION_FAIL'
  ];
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
        types: [actionTypes.MODIFICATION, actionTypes.MODIFICATION_SUCCESS,
          actionTypes.MODIFICATION_FAIL],
        endpoint: gulink.category,
        method: 'put',
        index,
        data: gulink[gulink.category]
      }
    };
  };
}

function liftedReorderLink(actionTypes) {
  return function reoderLink(category, gulinks) {
    return {
      [CLIENT_API]: {
        types: [actionTypes.REORDER, actionTypes.REORDER_SUCCESS, actionTypes.REORDER_FAIL],
        endpoint: `${category}/order`,
        method: 'put',
        data: gulinks
      }
    };
  };
}

function liftedMoveLink(actionTypes) {
  return function moveLink(originIndex, atIndex) {
    return {
      type: actionTypes.MOVE,
      data: { originIndex, atIndex }
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

const techcuzReorderLink = liftedReorderLink(techcuzActionType);
const docsioReorderLink = liftedReorderLink(docsioActionType);
const peopleReorderLink = liftedReorderLink(peopleActionType);

const techcuzMoveLink = liftedMoveLink(techcuzActionType);
const docsioMoveLink = liftedMoveLink(docsioActionType);
const peopleMoveLink = liftedMoveLink(peopleActionType);

const techcuzLoadLink = liftedLoadLink('techcuz', techcuzActionType);
const docsioLoadLink = liftedLoadLink('docsio', docsioActionType);
const peopleLoadLink = liftedLoadLink('people', peopleActionType);

['RELOAD', 'RELOAD_SUCCESS', 'RELOAD_FAIL'].forEach(at => {
  docsioActionType[at] = `@@docsio/${at}`;
});
function docsioReload(category, docName) {
  return {
    [CLIENT_API]: {
      types: [docsioActionType.RELOAD, docsioActionType.RELOAD_SUCCESS,
        docsioActionType.RELOAD_FAIL],
      endpoint: category,
      method: 'post',
      data: docName
    }
  };
}

export {
  isLoaded, docsioReload,
  techcuz, techcuzCreateLink, techcuzDeleteLink, techcuzModifyLink, techcuzLoadLink,
  techcuzReorderLink, techcuzMoveLink,
  docsio, docsioCreateLink, docsioDeleteLink, docsioModifyLink, docsioLoadLink,
  docsioReorderLink, docsioMoveLink,
  people, peopleCreateLink, peopleDeleteLink, peopleModifyLink, peopleLoadLink,
  peopleReorderLink, peopleMoveLink
};
