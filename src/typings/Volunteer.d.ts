interface Volunteer {
  id: number;
  user_id: number;
  name: string;
  role: string;
  image: string;
  details: VolunteerDetails | null;
}
