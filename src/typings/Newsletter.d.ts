interface DraftNewsletter {
  title: string;
  file: File;
  // numContacts: number;
  tags: Tags[];
}

interface NewsletterLog {
  id: number;
  title: string;
  fileLink: string;
  delivered: number;
  inTransit: number;
  returned: number;
  creationDate: Date;
  estimatedArrival: Date | null;
  tags: Tags[];
}
