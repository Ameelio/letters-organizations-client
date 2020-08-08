interface NewsletterState {
  newsletters: NewsletterLog[];
  uploadedFile: File | null;
  uploadStep: number;
  uploadSelectedTags: Tag[];
  selectedFilters: Tag[];
  error: ErrorResponse;
  loading: boolean;
}
