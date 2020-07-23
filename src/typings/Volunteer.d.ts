interface Volunteer {
  id: number;
  user_id: number;
  name: string;
  role: string;
  image: string;
  total_letters_sent: number;
  last_letter_sent: ?string;
}
