import { API_URL } from 'src/services/Api/base';
import url from 'url';

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
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body,
  };

  return await fetch(url.resolve(baseUrl, endpoint), requestOptions);
}

export function validateContactUpload(
  contacts: OrgContact[],
): [OrgContact[], InvalidContact[]] {
  let invalidContacts: InvalidContact[] = [];
  let validContacts: OrgContact[] = [];
  for (const contact of contacts) {
    let errors = [];

    const firstLine = `${contact.first_name} ${contact.last_name}, ${contact.inmate_number}`;
    if (contact.inmate_number && contact.inmate_number.length === 0) {
      errors.push('Inmate ID is missing');
    }
    if (contact.first_name && contact.first_name.length === 0) {
      errors.push('First name is missing');
    }
    if (contact.last_name && contact.last_name.length === 0) {
      errors.push('Last name is missing');
    }
    if (contact.facility_city && contact.facility_city.length === 0) {
      errors.push('Facility city is missing');
    }
    if (contact.facility_address && contact.facility_address.length === 0) {
      errors.push('Facility address is missing');
    }
    if (contact.facility_postal && contact.facility_postal.length === 0) {
      errors.push('Facility postal is missing');
    }
    if (contact.facility_name && contact.facility_name.length === 0) {
      errors.push('Facility name is missing');
    }

    if (firstLine.length > 40) {
      errors.push('Name is too long. Please abbreviate.');
    }
    if (contact.facility_state && contact.facility_state.length !== 2) {
      errors.push('Must use 2 letter state short-name code');
    }
    if (contact.facility_name && contact.facility_name.length > 40) {
      errors.push(
        'Please abbreviate the facility name. Must be under 40 characters',
      );
    }
    if (contact.facility_address && contact.facility_address.length >= 64) {
      errors.push('Facility address is too long. Must be under 64 characters');
    }
    if (!/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(contact.facility_postal)) {
      errors.push(
        'Must follow the ZIP format of 12345 or ZIP+4 format of 12345-1234',
      );
    }

    if (errors.length > 0) {
      invalidContacts.push({ contact, errors });
    } else {
      validContacts.push(contact);
    }
  }
  return [validContacts, invalidContacts];
}

export function rowHasInfo(row: string[]): boolean {
  return row.some((item) => item && item.length > 0);
}

export const EXTRA_POSTAGE = 2.36;
export const ADDT_PAGE_COLOR = 0.21;
export const ADDT_PAGE_BW = 0.11;

export const FIRST_CLASS_COLOR = 0.8;
export const FIRST_CLASS_BW = 0.76;
export const STANDARD_COLOR = 0.59;
export const STANDARD_BW = 0.55;

const getFirstPageCost = (isStandard: boolean, isColor: boolean): number => {
  if (isStandard) {
    return isColor ? STANDARD_COLOR : STANDARD_BW;
  } else {
    return isColor ? FIRST_CLASS_COLOR : FIRST_CLASS_BW;
  }
};

const getExtraPostageFee = (numSheets: number): number => {
  return numSheets > 6 ? EXTRA_POSTAGE : 0;
};

const getAddtlPageCost = (isColor: boolean): number => {
  return isColor ? ADDT_PAGE_COLOR : ADDT_PAGE_BW;
};

export function calculateNewsletterCost(
  isStandard: boolean,
  isColor: boolean,
  numPages: number,
  numSheets: number,
) {
  console.log(getFirstPageCost(isStandard, isColor));
  console.log(getAddtlPageCost(isColor) * (numPages - 1));
  return Number(
    (
      getFirstPageCost(isStandard, isColor) +
      getAddtlPageCost(isColor) * (numPages - 1) +
      getExtraPostageFee(numSheets)
    ).toFixed(2),
  );
}
