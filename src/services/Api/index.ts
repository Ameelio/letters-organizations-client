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
    firstName: body.data.first_name,
    lastName: body.data.last_name,
    email: body.data.email,
    phone: body.data.phone,
    address1: body.data.addr_line_1,
    address2: body.data.addr_line_2 || '',
    country: body.data.country,
    postal: body.data.postal,
    city: body.data.city,
    state: body.data.state,
    token: body.data.token,
  };
  return userData;
}
