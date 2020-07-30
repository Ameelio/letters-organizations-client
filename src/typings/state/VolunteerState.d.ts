interface VolunteerState {
  all_volunteers: Volunteer[];
  selected_volunteer: Volunteer;
  loading: boolean;
  error_message: string;
  loading_details: boolean;
}
