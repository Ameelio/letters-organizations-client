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

interface DirectMailLog {
  id: number;
  fileLink: string;
  totalLettersCount: number;
  delivered: number;
  inTransit: number;
  returned: number;
  creationDate: Date;
  estimatedArrival: Date | null;
  contact_id: number | null;
  status: string | null;
}

interface NewsletterLog {
  id: number;
  title: string;
  fileLink: string;
  totalLettersCount: number;
  delivered: number;
  inTransit: number;
  returned: number;
  creationDate: Date;
  estimatedArrival: Date | null;
  tags: Tags[];
  status: string | null;
}
