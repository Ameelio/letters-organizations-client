import url from 'url';
import { API_URL } from './base';
import { getAuthenticatedJson } from 'src/utils/utils';

export async function onLogin(email: string, password: string): Promise<User> {
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
  if (body.status === 'ERROR') {
    throw new Error('Invalid Credentials');
  }

  const userData: User = {
    id: body.data.id,
    token: body.data.token,
    org: null,
  };

  const orgResponse = await getAuthenticatedJson({
    method: 'GET',
    token: userData.token,
    endpoint: `user/${userData.id}/org`,
  });

  const orgBody = await orgResponse.json();
  if (orgBody.status === 'ERROR') {
    throw new Error(orgBody.message);
  }
  if (orgBody.data.role === 'member') {
    throw new Error(
      'Invalid access. Must be registered as an organization admin.',
    );
  }
  userData.org = {
    id: orgBody.data.org.id,
    name: orgBody.data.org.name,
    business_name: orgBody.data.org.business_name,
    ein: orgBody.data.org.ein,
    website: orgBody.data.org.website,
    address_line_1: orgBody.data.org.address_line_1,
    address_line_2: orgBody.data.org.address_line_2,
    city: orgBody.data.org.city,
    state: orgBody.data.org.state,
    postal: orgBody.data.org.postal,
    paid_balance: orgBody.data.org.paid_balance,
    color_first_page_price: orgBody.data.org.color_first_page_price,
    color_extra_page_price: orgBody.data.org.color_extra_page_price,
    bw_first_page_price: orgBody.data.org.bw_first_page_price,
    bw_extra_page_price: orgBody.data.org.bw_extra_page_price,
    share_link: orgBody.data.org.share_link,
  };

  return userData;
}
