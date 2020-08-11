import url from 'url';
import { API_URL } from './base';

export async function fetchVolunteers(
  token: string,
  org_id: number,
): Promise<Volunteer[]> {
  const requestOptions: RequestInit = {
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
    throw body;
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
      last_letter_sent: null,
      details: null,
    };
    if (volunteer.last_letter_sent) {
      volunteerData.last_letter_sent = new Date(volunteer.last_letter_sent);
    }
    volunteersData.push(volunteerData);
  });
  return volunteersData;
}

export async function fetchVolunteerDetails(
  token: string,
  volunteer: Volunteer,
): Promise<Volunteer> {
  const requestOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    url.resolve(API_URL, `org/user/${volunteer.id}`),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }

  const email = body.data.user.email;
  const city = body.data.user.city;
  const state = body.data.user.state;
  const user_id = body.data.user.id;

  const contactsResponse = await fetch(
    url.resolve(API_URL, `contacts/${user_id}`),
    requestOptions,
  );
  const contactsBody = await contactsResponse.json();
  if (contactsBody.status === 'ERROR') {
    throw contactsBody.message;
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
    color: boolean;
    double_sided: boolean;
  }
  const contactsData: Contact[] = [];
  contactsBody.data.data.forEach((contact: c) => {
    if (contact.org_id === null) {
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
        relationship: contact.relationship,
        dorm: contact.dorm,
        unit: contact.unit,
        total_letters_sent: contact.total_letters_sent,
        last_letter_sent: null,
        org_id: contact.org_id,
        color: contact.color,
        double_sided: contact.double_sided,
      };
      if (contact.last_letter_sent) {
        contactData.last_letter_sent = new Date(contact.last_letter_sent);
      }
      contactsData.push(contactData);
    }
  });

  const lettersResponse = await fetch(
    url.resolve(API_URL, `letters/${user_id}`),
    requestOptions,
  );
  const lettersBody = await lettersResponse.json();
  if (lettersBody.status === 'ERROR') {
    throw lettersBody.message;
  }
  interface image {
    id: number;
    letter_id: number;
    img_src: string;
    created_at: string;
    updated_at: string;
  }
  interface l {
    id: number;
    created_at: string;
    type: LetterType;
    content: string;
    sent: boolean;
    lob_validation_error: boolean;
    lob_status: string | null;
    last_lob_status_update: string | null;
    page_count: number | null;
    user_name: string;
    contact_name: string;
    images: image[];
  }
  const lettersData: Letter[] = [];
  lettersBody.data.data.forEach((letter: l) => {
    if (!letter.lob_validation_error && letter.lob_status) {
      const letterData: Letter = {
        id: letter.id,
        created_at: new Date(letter.created_at),
        type: letter.type,
        content: letter.content,
        sent: letter.sent,
        lob_validation_error: letter.lob_validation_error,
        lob_status: letter.lob_status,
        last_lob_status_update: null,
        page_count: letter.page_count,
        user_name: letter.user_name,
        contact_name: letter.contact_name,
        images: [],
      };
      if (letter.last_lob_status_update) {
        letterData.last_lob_status_update = new Date(
          letter.last_lob_status_update,
        );
      }
      letter.images.forEach((image) => letterData.images.push(image.img_src));
      lettersData.push(letterData);
    }
  });

  volunteer.details = {
    email: email,
    city: city,
    state: state,
    letters: lettersData,
    contacts: contactsData,
  };

  return volunteer;
}

export async function addVolunteer(
  token: string,
  org_id: number,
  email: string,
): Promise<Volunteer> {
  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      org_id: org_id,
      user_email: email,
      role: 'member',
    }),
  };
  const response = await fetch(
    url.resolve(API_URL, 'org/user'),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  const volunteerData: Volunteer = {
    id: body.data.org_user.id,
    user_id: body.data.org_user.user_id,
    name: body.data.org_user.name,
    image: body.data.org_user.image,
    role: body.data.org_user.role,
    total_letters_sent: body.data.org_user.total_letters_sent,
    last_letter_sent: null,
    details: null,
  };
  if (body.data.org_user.last_letter_sent) {
    volunteerData.last_letter_sent = new Date(
      body.data.org_user.last_letter_sent,
    );
  }
  return volunteerData;
}

export async function updateVolunteer(
  token: string,
  org_id: number,
  role: string,
  volunteer: Volunteer,
): Promise<Volunteer> {
  const requestOptions = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      org_id: org_id,
      user_id: volunteer.user_id,
      role: role,
    }),
  };
  const response = await fetch(
    url.resolve(API_URL, `org/user/${volunteer.id}`),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  const volunteerData: Volunteer = {
    id: volunteer.id,
    user_id: volunteer.user_id,
    name: volunteer.name,
    image: volunteer.image,
    role: body.data.role,
    total_letters_sent: volunteer.total_letters_sent,
    last_letter_sent: volunteer.last_letter_sent,
    details: null,
  };
  return volunteerData;
}

export async function removeVolunteer(
  token: string,
  volunteer: Volunteer,
): Promise<void> {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    url.resolve(API_URL, `org/user/${volunteer.id}`),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
}
