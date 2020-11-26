import store from 'src';
import {
  setVolunteers,
  setSelectedVolunteer,
  deleteVolunteer,
} from 'src/redux/modules/volunteer';
import { genImageUri, getAuthJson } from 'src/utils/utils';
import { fetchAuthenticated } from './base';

interface RawVolunteer {
  id: number;
  user_id: number;
  name: string;
  image: string;
  role: string;
}

interface RawVolunteerResponse {
  current_page: number;
  data: RawVolunteer[];
}
export async function getVolunteers(): Promise<void> {
  const body = await fetchAuthenticated(
    `org/${store.getState().session.orgUser.org.id}/users?page=${
      store.getState().volunteers.page
    }`,
    {
      method: 'GET',
    },
  );
  if (body.status !== 'OK') {
    throw body;
  }
  const data = body.data as RawVolunteerResponse;
  const volunteers: Volunteer[] = data.data.map((volunteer) => ({
    id: volunteer.id,
    user_id: volunteer.user_id,
    name: volunteer.name,
    image: volunteer.image,
    role: volunteer.role,
    details: null,
  }));
  store.dispatch(setVolunteers(volunteers));
  store.dispatch(setSelectedVolunteer(volunteers[0]));
}

export async function fetchVolunteerDetails(
  volunteer: Volunteer,
): Promise<Volunteer> {
  const body = await fetchAuthenticated(`org/user/${volunteer.id}`, {
    method: 'GET',
  });

  if (body.status !== 'OK') {
    throw body;
  }

  const user_id = body.data.user.id;

  const contactsBody = await fetchAuthenticated(`contacts/${user_id}`, {
    method: 'GET',
  });

  if (contactsBody.status === 'ERROR') {
    throw contactsBody.message;
  }

  const { data } = contactsBody.data;
  const contactsData: VolunteerContact[] = data.map(
    (contact: RawVolunteerContact) =>
      ({
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
        org_id: contact.org_id,
        last_letter_sent: contact.last_letter_sent
          ? new Date(contact.last_letter_sent)
          : null,
      } as VolunteerContact),
  );

  const lettersBody = await fetchAuthenticated(`letters/${user_id}`, {
    method: 'GET',
  });

  if (lettersBody.status === 'ERROR') {
    throw lettersBody.message;
  }

  const lettersData: Letter[] = [];

  lettersBody.data.data.forEach((letter: RawLetter) => {
    if (
      !letter.lob_validation_error &&
      letter.lob_status &&
      !letter.newsletter_id
    ) {
      const letterData: Letter = {
        id: letter.id,
        created_at: new Date(letter.created_at),
        type: letter.type,
        content: letter.content,
        sent: letter.sent,
        lob_validation_error: letter.lob_validation_error,
        lob_status: letter.lob_status,
        last_lob_status_update: null,
        delivered: letter.delivered,
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

  const { first_name, last_name, email, city, state } = body.data.user;

  volunteer.details = {
    name: `${first_name} ${last_name}`,
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
  const response = await getAuthJson({
    method: 'POST',
    token: token,
    endpoint: 'org/user',
    body: JSON.stringify({
      org_id: org_id,
      user_email: email,
      role: 'member',
    }),
  });
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  const volunteerData: Volunteer = {
    id: body.data.org_user.id,
    user_id: body.data.org_user.user_id,
    name: `${body.data.user.first_name} ${body.data.user.last_name}`,
    image: body.data.user.profile_img_path,
    role: body.data.org_user.role,
    details: null,
  };

  return volunteerData;
}

export async function updateVolunteer(
  token: string,
  org_id: number,
  role: string,
  volunteer: Volunteer,
): Promise<Volunteer> {
  const response = await getAuthJson({
    method: 'PUT',
    token: token,
    endpoint: `org/user/${volunteer.id}`,
    body: JSON.stringify({
      org_id: org_id,
      user_id: volunteer.user_id,
      role: role,
    }),
  });
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
    details: null,
  };
  return volunteerData;
}

export async function removeVolunteer(
  token: string,
  volunteer: Volunteer,
): Promise<void> {
  const response = await getAuthJson({
    method: 'DELETE',
    token: token,
    endpoint: `org/user/${volunteer.id}`,
  });
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  store.dispatch(deleteVolunteer(volunteer));
}
