interface RawLetterDraft {
  contact_id: number;
  contact_name: string;
  updated_at: Date;
  content: string;
}

interface RawDraftSender {
  id: number;
  first_name: string;
  last_name: string;
}

interface LetterDraft {
  user_id: number;
  contact_id: number;
  first_name: string;
  last_name: string;
  contact_name: string;
  updated_at: Date;
  content: string;
}
