import { CLIENT_API } from '../middlewares/api';
const CREATION = 'gulink/CREATION';
const CREATION_SUCCESS = 'gulink/CREATION_SUCCESS';
const CREATION_FAIL = 'gulink/CREATION_FAIL';

const initialState = {
  techcuz: [{
    cate: 'reactjs',
    links: []
  }]
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case CREATION:
    return state;
  case CREATION_SUCCESS:
    const nextState = Object.assign({}, state);
    nextState.techcuz.push(action.data);
    return nextState;
  case CREATION_FAIL:
  default:
    return state;
  }
}

export function createLink(gulink) {
  return {
    [CLIENT_API]: {
      types: [CREATION, CREATION_SUCCESS, CREATION_FAIL],
      endpoint: 'gudmarks/create',
      method: 'post',
      data: gulink
    }
  };
}
