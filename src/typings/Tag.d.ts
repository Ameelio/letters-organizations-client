type TagColor = string;

interface RawTag {
  label: string;
  id: number;
  total_contacts: number;
}

interface Tag {
  label: string;
  numContacts: number;
  id: number;
}
