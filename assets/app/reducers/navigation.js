import {
  CHANGE_CONTENT_TYPE,
} from '../constants/actionTypes';

const initialState = {
  contentType: 'Home',
};

export default function navigation(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CONTENT_TYPE:
      return Object.assign({}, state, {
        contentType: action.contentType
      });
    default:
      return state;
  }
}
