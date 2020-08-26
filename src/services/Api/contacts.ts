import url from 'url';
import { API_URL } from './base';
import { genImageUri } from 'src/utils/utils';

export async function fetchContacts(
  token: string,
  org_id: number,
): Promise<OrgContact[]> {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    url.resolve(API_URL, `contacts/org/${org_id}`),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  const contactsData: OrgContact[] = [];
  interface t {
    id: number;
    label: string;
    total_contacts: number;
  }
  interface c {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    inmate_number: string;
    facility_name: string;
    facility_address: string;
    facility_city: string;
    facility_state: string;
    facility_postal: string;
    profile_img_path: string;
    relationship: string;
    dorm: string | null;
    unit: string | null;
    total_letters_sent: number;
    last_letter_sent: string | null;
    org_id: number | null;
    tags: Array<t>;
  }
  body.data.data.forEach((contact: c) => {
    const contactData: OrgContact = {
      first_name: contact.first_name,
      middle_name: contact.middle_name,
      last_name: contact.last_name,
      inmate_number: contact.inmate_number,
      facility_name: contact.facility_name,
      facility_address: contact.facility_address,
      facility_city: contact.facility_city,
      facility_state: contact.facility_state,
      facility_postal: contact.facility_postal,
      profile_img_path: genImageUri(contact.profile_img_path),
      relationship: contact.relationship,
      dorm: contact.dorm,
      unit: contact.unit,
      total_letters_sent: contact.total_letters_sent,
      last_letter_sent: null,
      org_id: contact.org_id,
      tags: [],
    };
    if (contact.last_letter_sent) {
      contactData.last_letter_sent = new Date(contact.last_letter_sent);
    }
    contact.tags.forEach((tag: t) => {
      const tagData: Tag = {
        label: tag.label,
        id: tag.id,
        numContacts: tag.total_contacts,
      };
      contactData.tags.push(tagData);
    });
    contactsData.push(contactData);
  });
  return contactsData;
}

export async function createContacts(
  token: string,
  org_id: number,
  tag_ids: number[],
  contacts: Contact[],
): Promise<OrgContact[]> {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      org_id: org_id,
      tags: tag_ids,
      contacts: contacts,
    }),
  };
  const response = await fetch(
    url.resolve(API_URL, 'contacts/org'),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  const contactsData: OrgContact[] = [];
  interface t {
    id: number;
    label: string;
    total_contacts: number;
  }
  interface c {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    inmate_number: string;
    facility_name: string;
    facility_address: string;
    facility_city: string;
    facility_state: string;
    facility_postal: string;
    profile_img_path: string;
    relationship: string;
    dorm: string | null;
    unit: string | null;
    total_letters_sent: number;
    last_letter_sent: string | null;
    org_id: number | null;
    tags: Array<t>;
  }
  body.data.data.contacts.forEach((contact: c) => {
    const contactData: OrgContact = {
      first_name: contact.first_name,
      middle_name: contact.middle_name,
      last_name: contact.last_name,
      inmate_number: contact.inmate_number,
      facility_name: contact.facility_name,
      facility_address: contact.facility_address,
      facility_city: contact.facility_city,
      facility_state: contact.facility_state,
      facility_postal: contact.facility_postal,
      profile_img_path: genImageUri(contact.profile_img_path),
      relationship: contact.relationship,
      dorm: contact.dorm,
      unit: contact.unit,
      total_letters_sent: contact.total_letters_sent,
      last_letter_sent: null,
      org_id: contact.org_id,
      tags: [],
    };
    if (contact.last_letter_sent) {
      contactData.last_letter_sent = new Date(contact.last_letter_sent);
    }
    contact.tags.forEach((tag: t) => {
      const tagData: Tag = {
        label: tag.label,
        id: tag.id,
        numContacts: tag.total_contacts,
      };
      contactData.tags.push(tagData);
    });
    contactsData.push(contactData);
  });
  return contactsData;
}
