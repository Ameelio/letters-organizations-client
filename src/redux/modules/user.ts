// Constants & Shapes
const LOGIN = 'user/LOGIN';
const LOGOUT = 'user/LOGOUT';

interface LoginAction {
  type: typeof LOGIN;
  payload: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

type UserActionTypes = LoginAction | LogoutAction;

// Action Creators
export const login = (username: string): UserActionTypes => {
  return {
    type: LOGIN,
    payload: username,
  };
};

export const logout = (): UserActionTypes => {
  return {
    type: LOGOUT,
  };
};

// Reducer
const initialState: UserState = { username: null };

export function userReducer(
  state = initialState,
  action: UserActionTypes,
): UserState {
  switch (action.type) {
    case LOGIN:
      return { username: action.payload };
    case LOGOUT:
      return { username: null };
    default:
      return state;
  }
}
