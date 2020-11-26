import store from 'src';

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
  data: Record<string, object> | object;
}

export interface UserResponse {
  type: string;
  data: User;
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
  const response = await fetchTimeout(fetchUrl, requestOptions, timeout);
  const body = await response.json();
  return body;
}
