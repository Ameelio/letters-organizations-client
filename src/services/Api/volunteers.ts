import url from 'url';
import { API_URL } from './base';

// TODO: Handle pagination!!! (unclear what this should look like on the frontend)

export async function fetchVolunteers(
  token: string,
  org_id: number,
): Promise<Volunteer[]> {
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    url.resolve(API_URL, `org/${org_id}/users`),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body['data'];
  }
  const volunteersData: Volunteer[] = [];
  interface v {
    id: number;
    user_id: number;
    name: string;
    image: string;
    role: string;
    total_letters_sent: number;
    last_letter_sent: string | null;
  }
  body.data.data.forEach((volunteer: v) => {
    const volunteerData: Volunteer = {
      id: volunteer.id,
      user_id: volunteer.user_id,
      name: volunteer.name,
      image: volunteer.image,
      role: volunteer.role,
      total_letters_sent: volunteer.total_letters_sent,
      last_letter_sent: volunteer.last_letter_sent,
    };
    volunteersData.push(volunteerData);
  });
  return volunteersData;
}

export async function fetchVolunteerDetails(
  token: string,
  org_user_id: number,
): Promise<void> {
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    url.resolve(API_URL, `org/user/${org_user_id}`),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body['data'];
  }

  const email = body.data.user.email;
  const city = body.data.user.city;
  const state = body.data.user.state;
  const user_id = body.data.user.id;

  const contactsResponse = await fetch(
    url.resolve(API_URL, `contacts/${user_id}`),
  );
  const contactsBody = await contactsResponse.json();
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
    dorm: string | null;
    unit: string | null;
    total_letters_sent: number;
    last_letter_sent: string;
  }
  const contactsData = [];
  contactsBody.data.data.forEach((contact: c) => {
    const contactData: Contact = {
      first_name: contact.first_name,
      middle_name: contact.middle_name,
      last_name: contact.last_name,
      inmate_number: contact.inmate_number,
      facility_name: contact.facility_name,
      facility_address: contact.facility_address,
      facility_city: contact.facility_city,
      facility_state: contact.facility_state,
      facility_postal: contact.facility_postal,
      profile_img_path: contact.profile_img_path,
      dorm: contact.dorm,
      unit: contact.unit,
      total_letters_sent: contact.total_letters_sent,
      last_letter_sent: contact.last_letter_sent,
    };
    contactsData.push(contactData);
  });

  const lettersResponse = await fetch(
    url.resolve(API_URL, `letters/${user_id}`),
  );
  const lettersBody = await lettersResponse.json();
  interface l {
    id: number;
    created_at: string;
    type: string;
    content: string;
    sent: boolean;
    attached_img_src: string;
    lob_validation_error: boolean;
    page_count: number | null;
    user_id: number;
    contact_id: number;
    user_name: string;
    contact_name: string;
    images: Array;
  }
  const lettersData = [];
  lettersBody.data.data.forEach((letter: l) => {});
}
