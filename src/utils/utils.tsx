import url from 'url';

export const API_URL =
  process.env && process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : '';

export const BASE_URL =
  process.env && process.env.REACT_APP_BASE_URL
    ? process.env.REACT_APP_BASE_URL
    : '';

export const formatDate = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

function hashCode(str: string): number {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 6) - hash);
  }
  return hash;
}

const unauthenticatedMessages: string[] = [
  'Expired Token',
  'Unauthorized',
  'Unauthenticated',
];

export function unauthenticated(errorMessages: string[]): boolean {
  return errorMessages.some((errorMessage) =>
    unauthenticatedMessages.includes(errorMessage),
  );
}

export function generateTagColor(colors: TagColor[], label: string): string {
  return colors[Math.abs(hashCode(label) % colors.length)];
}

export function genImageUri(img: string) {
  return img === 'avatar.svg' ? `${process.env.PUBLIC_URL}/avatar.svg` : img;
}

export const STATES = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'VI',
  'WA',
  'WV',
  'WI',
  'WY',
];

export function isBottom(el: HTMLElement) {
  return el.scrollHeight - el.scrollTop === el.clientHeight;
}

export async function getAuthJson({
  method,
  token,
  endpoint,
  body = null,
  baseUrl = API_URL,
}: {
  method: string;
  token: string;
  endpoint: string;
  body?: BodyInit | null;
  baseUrl?: string;
}): Promise<Response> {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body,
  };

  return await fetch(url.resolve(baseUrl, endpoint), requestOptions);
}
