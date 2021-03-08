import { camelizeKeys } from 'humps';
import store from 'src';
import { logout, setSession, SessionState } from 'src/redux/modules/user';
import { identify } from 'src/utils/segment';
import { getAuthJson } from 'src/utils/utils';
import url from 'url';

export const API_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_URL_STAGING || ''
    : process.env.REACT_APP_API_URL || '';

export const BASE_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_BASE_URL_STAGING || ''
    : process.env.REACT_APP_BASE_URL || '';

export interface ApiResponse {
  date: number;
  status?: 'OK' | 'ERROR' | 'succeeded' | 200;
  message?: string;
  data: any;
}

export interface UserResponse {
  type: string;
  data: User;
}

export async function initializeSession(body: any) {
  const user = (camelizeKeys(body.data) as unknown) as User;

  const responseOrg = await getAuthJson({
    method: 'GET',
    token: user.token,
    endpoint: `user/${user.id}/org`,
  });

  const bodyOrg = await responseOrg.json();
  if (bodyOrg.status !== 'OK') throw bodyOrg;

  const orgUser = (camelizeKeys(bodyOrg.data) as unknown) as OrgUser;

  console.log(orgUser);
  if (orgUser.role === 'member') {
    throw new Error(
      'Invalid access. Must be registered as an organization admin.',
    );
  }

  identify(user.email, { org: orgUser.org.name });

  store.dispatch(
    setSession({
      orgUser,
      user,
      authInfo: { isLoadingToken: false, isLoggedIn: true },
    } as SessionState),
  );
}

export function fetchTimeout(
  fetchUrl: string,
  options: Record<string, unknown>,
  timeout = 15000,
): Promise<Response> {
  return Promise.race([
    fetch(fetchUrl, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout),
    ),
  ]);
}

export async function fetchAuthenticated(
  fetchUrl: string,
  options: Record<string, unknown> = {},
  timeout = 15000,
): Promise<ApiResponse> {
  const requestOptions = {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${store.getState().session.user.token}`,
    },
  };
  const response = await fetchTimeout(
    url.resolve(API_URL, fetchUrl),
    requestOptions,
    timeout,
  );
  const body = await response.json();
  let { remember } = store.getState().session.user;
  // if (remember === '' || !remember) {
  //   remember = (await getItemAsync(Storage.RememberToken)) || '';
  // }
  if (
    body.message &&
    body.message === 'Unauthenticated.' &&
    remember &&
    remember !== ''
  ) {
    // attempt to refresh the api token using the remember token
    const tokenResponse = await fetchTimeout(
      url.resolve(API_URL, 'login/token'),
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: remember,
        }),
      },
    );
    const tokenBody = await tokenResponse.json();
    if (tokenBody.status !== 'OK') {
      store.dispatch(logout());
      throw Error('Invalid token');
    }
    await initializeSession(tokenBody);
    fetchAuthenticated(fetchUrl, options, timeout);
  }
  return body;
}
