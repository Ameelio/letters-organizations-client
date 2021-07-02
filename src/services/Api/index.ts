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

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}v1/login`,
    requestOptions,
  );
  const body = await response.json();
  if (body.status !== 200) throw body;

  await initializeSession(body);
}
