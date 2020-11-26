// Reducer state
interface AuthInfo {
  isLoggedIn: boolean;
}

export interface SessionState {
  authInfo: AuthInfo;
  user: User;
  orgUser: OrgUser;
}

// Constants & Shapes
const SET_SESSION = 'user/SET_SESSION';
const LOGOUT = 'user/LOGOUT';

interface SetSessionAction {
  type: typeof SET_SESSION;
  payload: SessionState;
}

interface LogoutAction {
  type: typeof LOGOUT;
  payload: null;
}

type UserActionTypes = SetSessionAction | LogoutAction;

// Action Creators
export const setSession = (session: SessionState): UserActionTypes => {
  return {
    type: SET_SESSION,
    payload: session,
  };
};

export const logout = (): UserActionTypes => {
  return {
    type: LOGOUT,
    payload: null,
  };
};

// Reducer
const fromStorage: string | null = sessionStorage.getItem('SessionState');
let storedSessionState: SessionState | null = null;
if (fromStorage) {
  storedSessionState = JSON.parse(fromStorage);
}

const zeroState: SessionState = {
  authInfo: {
    isLoggedIn: false,
  },
  user: {
    id: -1,
    firstName: '',
    lastName: '',
    email: '',
    addrLine1: '',
    addrLine2: '',
    postal: '',
    city: '',
    state: '',
    credit: 0,
    coins: 0,
    profileImgPath: '',
    country: '',
    token: '',
    remember: '',
  },
  orgUser: {} as OrgUser,
};

let initialState: SessionState = storedSessionState || zeroState;

export function userReducer(
  state = initialState,
  action: UserActionTypes,
): SessionState {
  switch (action.type) {
    case SET_SESSION:
      sessionStorage.setItem('SessionState', JSON.stringify(action.payload));
      return action.payload;
    case LOGOUT:
      sessionStorage.clear();
      return zeroState;
    default:
      return state;
  }
}
