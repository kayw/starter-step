import { CLIENT_API } from '../middlewares/api';

export function gudmarksReducer(state, action, types) {
  const [CREATION, CREATION_SUCCESS, CREATION_FAIL, SELECTION
  , DELETION, DELETION_SUCCESS, DELETION_FAIL] = types;
  switch (action.type) {
  case CREATION:
    return state;
  case CREATION_SUCCESS:
    let nextMarks = [...state.gulinks];
    nextMarks.push(action.data);
    return { ...state, gulinks: nextMarks};

  case SELECTION:
    return { ...state, selectedIndex: action.index };
  case DELETION_SUCCESS:
    nextMarks = [...state.gulinks];
    nextMarks.splice(action.data.index, 1);
    return { ...state, gulinks: nextMarks };
  case DELETION_FAIL:
  case DELETION:
  case CREATION_FAIL:
  default:
    return state;
  }
}

export function gudmarksCreate(types, gulink) {
  return {
    [CLIENT_API]: {
      types: types,
      endpoint: gulink.category,
      method: 'post',
      data: gulink[gulink.category]
    }
  };
}

export function gudmarksDelete(types, index, id, category) {
  return {
    [CLIENT_API]: {
      types: types,
      endpoint: category,
      method: 'del',
      data: { index, id }
    }
  };
}
