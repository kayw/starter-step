import { CLIENT_API } from '../middlewares/api';
const CREATION = 'gulink/CREATION';
const CREATION_SUCCESS = 'gulink/CREATION_SUCCESS';
const CREATION_FAIL = 'gulink/CREATION_FAIL';

const initialState = {
  techcuz: [{
    name: 'reactjs',
    link: 'reddit.com/r/reactjs',
    source: 'reddit'
  }]
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case CREATION:
    return state;
  case CREATION_SUCCESS:
    const nextTechcuz = [...state[action.data.category]];// Object.assign({}, state);
    nextTechcuz.push(action.data[action.data.category]);
    console.log('gudmarks reducer', state);
    return { ...state, techcuz: nextTechcuz };
  case CREATION_FAIL:
  default:
    return state;
  }
}

export function createLink(gulink) {
  return {
    [CLIENT_API]: {
      types: [CREATION, CREATION_SUCCESS, CREATION_FAIL],
      endpoint: 'gudmarks',
      method: 'post',
      data: gulink
    }
  };
}
