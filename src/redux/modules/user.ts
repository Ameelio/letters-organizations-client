export function typedAction<T extends string>(type: T): { type: T };

export function typedAction<T extends string, P extends any>(
  type: T,
  payload: P,
): { type: T; payload: P };
export function typedAction(type: string, payload?: any) {
  return { type, payload };
}
type UserState = {
  username: string | null;
};
const initialState: UserState = { username: null };
export const login = (username: string) => {
  return typedAction('user/LOGIN', username);
};
export const logout = () => {
  return typedAction('user/LOGOUT');
};
type UserAction = ReturnType<typeof login | typeof logout>;
export function userReducer(
  state = initialState,
  action: UserAction,
): UserState {
  switch (action.type) {
    case 'user/LOGIN':
      return { username: action.payload };
    case 'user/LOGOUT':
      return { username: null };
    default:
      return state;
  }
}
