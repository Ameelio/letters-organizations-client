interface AuthInfo {
  isLoadingToken: boolean;
  isLoggedIn: boolean;
}

interface UserState {
  authInfo: AuthInfo;
  user: User;
}
