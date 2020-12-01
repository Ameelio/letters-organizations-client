interface Contact {
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
  last_letter_sent: Date | null;
  org_id: number | null;
}

interface InvalidContact {
  contact: OrgContact;
  errors: string[];
}
