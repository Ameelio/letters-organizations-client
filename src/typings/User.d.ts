interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  country: string;
  postal: string;
  city: string;
  state: string;
  imageUri?: string;
  token: string;
}
