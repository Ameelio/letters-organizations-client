import url from 'url';
import { API_URL } from './base';
import { getAuthJson } from 'src/utils/utils';
import { camelizeKeys } from 'humps';
import store from 'src';
import { setSession, SessionState } from 'src/redux/modules/user';
import { identify } from 'src/utils/segment';

export async function login(email: string, password: string): Promise<void> {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  };

  const response = await fetch(url.resolve(API_URL, 'login'), requestOptions);
  const body = await response.json();
  if (body.status !== 'OK') throw body;

  const user = (camelizeKeys(body.data) as unknown) as User;

  const { id, token } = user;

  const responseOrg = await getAuthJson({
    method: 'GET',
    token: token,
    endpoint: `user/${id}/org`,
  });

  const bodyOrg = await responseOrg.json();
  if (bodyOrg.status !== 'OK') throw bodyOrg;

  const orgUser = (camelizeKeys(bodyOrg.data) as unknown) as OrgUser;

  if (orgUser.role === 'member') {
    throw new Error(
      'Invalid access. Must be registered as an organization admin.',
    );
  }

  identify(email, { org: orgUser.org.name });

  store.dispatch(
    setSession({
      orgUser,
      user,
      authInfo: { isLoadingToken: false, isLoggedIn: true },
    } as SessionState),
  );
}
