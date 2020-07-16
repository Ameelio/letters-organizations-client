import url from 'url';
import { API_URL } from './base';

export async function fetchVolunteers(token: string): Promise<void> {
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}
