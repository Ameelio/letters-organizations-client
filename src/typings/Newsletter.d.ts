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

interface RawNewsletterLog {
  id: number;
  title: string;
  fileLink: string;
  totalLettersCount: number;
  delivered: number;
  inTransit: number;
  returned: number;
  creationDate: Date;
  estimatedArrival: Date | null;
  tags: RawTag[];
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
