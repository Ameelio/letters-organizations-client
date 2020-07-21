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
  const fetchOrgUsers = await fetch(
    url.resolve(API_URL, 'org/users'),
    requestOptions,
  );
  const orgUsers = await fetchOrgUsers.json();
  if (orgUsers.status === 'ERROR') {
    throw orgUsers['data'];
  }
}
