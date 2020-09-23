interface VolunteerState {
  all_volunteers: Volunteer[];
  selected_volunteer: Volunteer;
  loading: boolean;
  error: ErrorResponse;
  loading_details: boolean;
  drafts: LetterDrafts[];
}
