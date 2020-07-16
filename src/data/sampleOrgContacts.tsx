import { sampleTags } from './sampleTags';

const d1: OrgContact = {
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
  tags: [sampleTags[1], sampleTags[2]],
};

const d2: OrgContact = {
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
  tags: [sampleTags[3], sampleTags[4]],
};

export const sampleOrgContacts: OrgContact[] = [d1, d2];
