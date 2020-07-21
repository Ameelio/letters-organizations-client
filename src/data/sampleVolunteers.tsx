const dummy_contact: Contact = {
  first_name: 'Frankie',
  middle_name: '',
  last_name: 'Peters',
  inmate_number: '53213',
  facility_name: 'Cheshire CI',
  facility_address: '65 Edgewoo',
  facility_city: 'New Haven',
  facility_state: 'CT',
  facility_postal: '06511',
  profile_img_path:
    'https://media-exp1.licdn.com/dms/image/C4E03AQEvHsBEJbQ9dg/profile-displayphoto-shrink_400_400/0?e=1600300800&v=beta&t=Boq-ITjNDiXYumLUoZWkYepKIH9ILrUH2B8is2uszLs',
  dorm: null,
  unit: null,
  total_letters_sent: 5,
  last_letter_sent: new Date(),
  letter_streak: 1,
};

const dummy_letter: Letter = {
  id: 0,
  created_at: new Date(),
  type: 'letter',
  content:
    'Good to see that you’re well and healthy! We’ve all missed you so much and can...',
  sent: true,
  attached_img_src:
    'https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80',
  lob_validation_error: false,
  page_count: 1,
  tracking_events: [] as TrackingEvent[],
  user_name: 'Gabee',
  contact_name: 'Frankie',
};

const dummy_letter2: Letter = {
  id: 1,
  created_at: new Date(),
  type: 'letter',
  content:
    'Good to see that you’re well and healthy! We’ve all missed you so much and can...',
  sent: true,
  attached_img_src:
    'https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80',
  lob_validation_error: false,
  page_count: 1,
  tracking_events: [] as TrackingEvent[],
  user_name: 'Gabee',
  contact_name: 'Frankie',
};
const dummy_letters: Letter[] = [dummy_letter, dummy_letter2];
const dummy_contacts: Contact[] = [dummy_contact, dummy_contact];

export const dummy = {
  id: 0,
  name: 'Gabe Saruhashi',
  image:
    'https://media-exp1.licdn.com/dms/image/C5603AQHB6rggvacwQw/profile-displayphoto-shrink_400_400/0?e=1600300800&v=beta&t=g7sRc3Gnmv-DmALMLW2oPM0wddRNwYHtmX1W4JFZO34',
  email: 'gabe@ameelio.org',
  letters: dummy_letters,
  contacts: dummy_contacts,
  city: 'São Paulo',
  state: 'SP',
  total_letters_sent: 2,
  role: 'member',
};

const dummy2 = {
  id: 1,
  name: 'Sarah Yoon',
  image:
    'https://media-exp1.licdn.com/dms/image/C5603AQGMME21TIGkrQ/profile-displayphoto-shrink_400_400/0?e=1600300800&v=beta&t=XNtYv0Qy17ynPhOnUBnqk-8suzXg6dX7zE1m_MhBA3s',
  email: 'sarah@ameelio.org',
  letters: dummy_letters,
  contacts: dummy_contacts,
  city: 'New York',
  state: 'NYC',
  total_letters_sent: 2,
  role: 'member',
};

export const sampleVolunteers: Volunteer[] = [dummy, dummy2];
