// Constants & Shapes
const LOGIN = 'user/LOGIN';
const LOGOUT = 'user/LOGOUT';

interface LoginAction {
  type: typeof LOGIN;
  payload: User;
}

interface LogoutAction {
  type: typeof LOGOUT;
  payload: null;
}

type UserActionTypes = LoginAction | LogoutAction;

// Action Creators
export const login = (user: User): UserActionTypes => {
  return {
    type: LOGIN,
    payload: user,
  };
};

export const logout = (): UserActionTypes => {
  return {
    type: LOGOUT,
    payload: null,
  };
};

// Reducer
const initialState: UserState = {
  authInfo: {
    isLoadingToken: true,
    isLoggedIn: false,
  },
  user: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    country: '',
    postal: '',
    city: '',
    state: '',
    token: '',
    imageUri: '',
  },
};

export function userReducer(
  state = initialState,
  action: UserActionTypes,
): UserState {
  switch (action.type) {
    case LOGIN:
      return {
        authInfo: {
          isLoadingToken: false,
          isLoggedIn: true,
        },
        user: action.payload,
      };
    case LOGOUT:
      return {
        authInfo: {
          isLoadingToken: false,
          isLoggedIn: false,
        },
        user: {
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address1: '',
          address2: '',
          country: '',
          postal: '',
          city: '',
          state: '',
          token: '',
          imageUri: '',
        },
      };
    default:
      return state;
  }
}
