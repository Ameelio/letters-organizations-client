import url from 'url';
import { API_URL, initializeSession } from './base';

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

  await initializeSession(body);
}
