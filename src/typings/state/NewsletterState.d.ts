interface NewsletterState {
  newsletters: NewsletterLog[];
  newsletterName: string;
  uploadedFile: File | null;
  uploadStep: number;
  uploadSelectedTags: Tag[];
  selectedFilters: Tag[];
  error: ErrorResponse;
  loading: boolean;
}
