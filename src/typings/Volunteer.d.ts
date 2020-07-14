interface Volunteer {
  id: number;
  name: string;
  email: string;
  image: string;
  letters: Letter[];
  contacts: Contacts[];
  city: string;
  state: string;
  total_letters_sent: number;
}
