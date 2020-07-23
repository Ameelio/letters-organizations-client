type LetterType = 'postcard' | 'letter';

interface Letter {
  id: number;
  created_at: Date;
  type: LetterType;
  content: string;
  sent: boolean;
  // attached_img_src: string;
  lob_validation_error: boolean;
  page_count: number;
  // tracking_events: TrackingEvent[];
  user_name: string;
  contact_name: string;
}
