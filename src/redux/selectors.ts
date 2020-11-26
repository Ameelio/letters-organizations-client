import { RootState } from '.';

export function isAuthenticated(state: RootState) {
  return (
    state.session.user.token.length > 0 && state.session.authInfo.isLoggedIn
  );
}
