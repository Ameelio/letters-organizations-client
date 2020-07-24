type LetterType = 'postcard' | 'letter';

interface Letter {
  id: number;
  created_at: Date;
  type: LetterType;
  content: string;
  sent: boolean;
  images: string[];
  lob_validation_error: boolean;
  page_count: number | null;
  // tracking_events: TrackingEvent[];
  user_name: string;
  contact_name: string;
}
