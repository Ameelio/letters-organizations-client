interface Contact {
  first_name: string;
  middle_name: string;
  last_name: string;
  inmate_number: string;
  facility_name: string;
  facility_address: string;
  facility_city: string;
  facility_state: string;
  facility_postal: string;
  profile_img_path: string;
  dorm: ?string;
  unit: ?string;
  total_letters_sent: number;
  last_letter_sent: Date;
  letter_streak: number;
}
