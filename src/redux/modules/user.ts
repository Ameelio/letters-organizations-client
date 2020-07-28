// Constants & Shapes
const LOGIN = 'user/LOGIN';
const LOGOUT = 'user/LOGOUT';
const LOADING = 'user/LOADING';

interface LoginAction {
  type: typeof LOGIN;
  payload: User;
}

interface LogoutAction {
  type: typeof LOGOUT;
  payload: null;
}

interface LoadingAction {
  type: typeof LOADING;
  payload: null;
}

type UserActionTypes = LoginAction | LogoutAction | LoadingAction;

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

export const loadingUser = (): UserActionTypes => {
  return {
    type: LOADING,
    payload: null,
  };
};

// Reducer
const initialState: UserState = {
  authInfo: {
    isLoadingToken: false,
    isLoggedIn: false,
  },
  user: {
    id: -1,
    // firstName: '',
    // lastName: '',
    // email: '',
    // phone: '',
    // address1: '',
    // address2: '',
    // country: '',
    // postal: '',
    // city: '',
    // state: '',
    // imageUri: '',
    token: '',
    org: null,
  },
};

export function userReducer(
  state = initialState,
  action: UserActionTypes,
): UserState {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        authInfo: {
          isLoadingToken: true,
          isLoggedIn: false,
        },
      };
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
          id: -1,
          // firstName: '',
          // lastName: '',
          // email: '',
          // phone: '',
          // address1: '',
          // address2: '',
          // country: '',
          // postal: '',
          // city: '',
          // state: '',
          // imageUri: '',
          token: '',
          org: null,
        },
      };
    default:
      return state;
  }
}
