import url from 'url';
import { API_URL, BASE_URL } from './base';
import { genImageUri } from 'src/utils/utils';

export async function fetchContacts(
  token: string,
  org_id: number,
  page: number,
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
    url.resolve(API_URL, `contacts/org/${org_id}?page=${page}`),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  const contactsData: OrgContact[] = [];
  body.data.data.forEach((contact: RawOrgContact) => {
    const contactData: OrgContact = {
      id: contact.id,
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
      selected: false,
    };
    if (contact.last_letter_sent) {
      contactData.last_letter_sent = new Date(contact.last_letter_sent);
    }
    contact.tags.forEach((tag: RawTag) => {
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
  body.data.data.contacts.forEach((contact: RawOrgContact) => {
    const contactData: OrgContact = {
      id: 0,
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
      selected: false,
    };
    if (contact.last_letter_sent) {
      contactData.last_letter_sent = new Date(contact.last_letter_sent);
    }
    contact.tags.forEach((tag: RawTag) => {
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

export async function createVolunteerContact(
  token: string,
  org_id: number,
  user_id: number,
  contact: VolunteerContact,
): Promise<VolunteerContact> {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      first_name: contact.first_name,
      middle_name: contact.middle_name,
      last_name: contact.last_name,
      inmate_number: contact.inmate_number,
      facility_name: contact.facility_name,
      facility_address: contact.facility_address,
      facility_city: contact.facility_city,
      facility_state: contact.facility_state,
      facility_postal: contact.facility_postal,
      relationship: contact.relationship,
      org_id: org_id,
      s3_image_url: contact.profile_img_path,
    }),
  };
  const response = await fetch(
    url.resolve(API_URL, 'contact/' + user_id),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  const contactResp: RawVolunteerContact = body.data;
  const contactData: VolunteerContact = {
    first_name: contactResp.first_name,
    middle_name: contactResp.middle_name,
    last_name: contactResp.last_name,
    inmate_number: contactResp.inmate_number,
    facility_name: contactResp.facility_name,
    facility_address: contactResp.facility_address,
    facility_city: contactResp.facility_city,
    facility_state: contactResp.facility_state,
    facility_postal: contactResp.facility_postal,
    profile_img_path: genImageUri(contactResp.profile_img_path),
    relationship: contactResp.relationship,
    dorm: contactResp.dorm,
    unit: contactResp.unit,
    total_letters_sent: 0,
    last_letter_sent: null,
    org_id: contactResp.org_id,
  };
  return contactData;
}

// TODO: implement bulk delete endpoint to prevent overload of requests
export async function deleteContacts(
  token: string,
  contacts: OrgContact[],
): Promise<void> {
  contacts.forEach(async (contact) => {
    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(
      url.resolve(API_URL, `contact/${contact.id}`),
      requestOptions,
    );
    const body = await response.json();
    if (body.status === 'ERROR') {
      throw body;
    }
  });
}

export async function updateContacts(
  token: string,
  contacts: OrgContact[],
  tags: Tag[],
  orgId: number,
): Promise<void> {
  const requestOptions: RequestInit = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contact_ids: contacts.map((contact) => contact.id),
      tags: tags.map((tag) => tag.id),
    }),
  };
  const response = await fetch(
    url.resolve(API_URL, `contacts/org/${orgId}`),
    requestOptions,
  );
  const body = await response.json();

  if (body.status === 'ERROR') {
    throw body;
  }
}

export async function fetchDrafts(
  token: string,
  orgId: number,
): Promise<LetterDraft[]> {
  console.log('made req');
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    url.resolve(API_URL, 'org/' + orgId + '/drafts'),
    requestOptions,
  );
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  var draftsData: LetterDraft[] = [];
  console.log(body.data);
  body.data.forEach(
    (user: { user: RawDraftSender; drafts: RawLetterDraft[] }) => {
      user.drafts.forEach((draft: RawLetterDraft) => {
        console.log(draft);
        const letterDraft: LetterDraft = {
          user_id: user.user.id,
          contact_id: draft.contact_id,
          first_name: user.user.first_name,
          last_name: user.user.last_name,
          contact_name: draft.contact_name,
          updated_at: draft.updated_at,
          content: draft.content,
        };
        console.log(letterDraft);
        draftsData = [...draftsData, letterDraft];
      });
    },
  );
  console.log(draftsData);
  return draftsData;
}

export async function createDirectLetter(
  token: string,
  newsletter: DraftDirectLetter,
): Promise<boolean> {
  let formData = new FormData();
  formData.append('type', 'pdf');
  if (newsletter?.file) {
    formData.append('file', newsletter.file);
  }

  const s3requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  };
  const s3response = await fetch(
    url.resolve(BASE_URL, 'file/upload'),
    s3requestOptions,
  );
  const s3body = await s3response.json();
  if (s3body.status === 'ERROR') {
    throw s3body;
  }
  const s3_url = s3body.data;

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contact_id: newsletter.contact_id,
      pdf_path: s3_url,
      content: 'legal_mail',
      type: 'letter',
    }),
  };
  const response = await fetch(url.resolve(API_URL, 'letter'), requestOptions);
  const body = await response.json();
  if (body.status === 'ERROR') {
    throw body;
  }
  return true;
}
