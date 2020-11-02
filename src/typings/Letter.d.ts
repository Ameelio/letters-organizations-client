type LetterType = 'postcard' | 'letter';

interface Image {
  id: number;
  letter_id: number;
  img_src: string;
  created_at: string;
  updated_at: string;
}

interface Letter {
  id: number;
  created_at: Date;
  type: LetterType;
  content: string;
  sent: boolean;
  images: string[];
  lob_validation_error: boolean;
  last_lob_status_update: Date | null;
  delivered: boolean;
  page_count: number | null;
  // tracking_events: TrackingEvent[];
  lob_status: string | null;
  user_name: string;
  contact_name: string;
}

interface RawLetter {
  id: number;
  created_at: string;
  type: LetterType;
  content: string;
  sent: boolean;
  lob_validation_error: boolean;
  lob_status: string | null;
  last_lob_status_update: string | null;
  page_count: number | null;
  user_name: string;
  contact_name: string;
  images: Image[];
  delivered: boolean;
  newsletter_id: number;
}
