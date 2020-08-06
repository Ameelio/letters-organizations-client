type LetterType = 'postcard' | 'letter';

interface Letter {
  id: number;
  created_at: Date;
  type: LetterType;
  content: string;
  sent: boolean;
  images: string[];
  lob_validation_error: boolean;
  last_lob_status_update: Date | null;
  page_count: number | null;
  // tracking_events: TrackingEvent[];
  lob_status: string | null;
  user_name: string;
  contact_name: string;
}
