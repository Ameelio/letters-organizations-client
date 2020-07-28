import url from 'url';
import { API_URL } from './base';

export async function onLogin(email: string, password: string): Promise<User> {
  const requestOptions = {
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
    throw body['data'];
  }
  const userData: User = {
    id: body.data.id,
    // firstName: body.data.first_name,
    // lastName: body.data.last_name,
    // email: body.data.email,
    // phone: body.data.phone,
    // address1: body.data.addr_line_1,
    // address2: body.data.addr_line_2 || '',
    // country: body.data.country,
    // postal: body.data.postal,
    // city: body.data.city,
    // state: body.data.state,
    // imageUri: body.data.imageUri,
    token: body.data.token,
    org: null,
  };

  const orgRequestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userData.token}`,
    },
  };

  const orgResponse = await fetch(
    url.resolve(API_URL, `user/${userData.id}/org`),
    orgRequestOptions,
  );
  const orgBody = await orgResponse.json();
  if (orgBody.status === 'ERROR') {
    throw orgBody.message;
  }
  if (orgBody.data.role === 'member') {
    throw 'Must be registered as an organization admin.';
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
