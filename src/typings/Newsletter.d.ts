interface DraftNewsletter {
  title: string;
  file: File;
  tags: Tags[];
  color: boolean;
  double_sided: boolean;
  standardMail: boolean;
}

interface DraftDirectLetter {
  file: File | null;
  contact_id: number | null;
}

interface NewsletterLog {
  id: number;
  title: string;
  fileLink: string;
  totalLettersCount: number;
  nullCount: number;
  processingCount: number;
  inTransit: number;
  delivered: number;
  returned: number;
  creationDate: Date;
  estimatedArrival: Date | null;
  tags: Tags[];
  status: string | null;
}
