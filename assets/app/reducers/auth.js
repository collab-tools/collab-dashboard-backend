import {
  AUTHENTICATE_USER,
  UNAUTHENTICATE_USER
} from '../constants/actionTypes';

const initialState = {
  username: null,
  isAdmin: null,
  token: null,
  jwtToken: null,
}

export default function login(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATE_USER: {
      let loginToken = action.loginToken;
      console.log("AUTHENTICATE_USER is called");
      console.log(loginToken);
      let jwtToken = 'JWT ' + loginToken.token;

      return {...state,
        username: loginToken.username,
        isAdmin: loginToken.isAdmin,
        token: loginToken.token,
        jwtToken: jwtToken,
      }
    }
    case UNAUTHENTICATE_USER: {
      console.log("UNAUTHENTICATE_USER is called");
      return initialState;
    }
    default:
      return state;
  }
}
