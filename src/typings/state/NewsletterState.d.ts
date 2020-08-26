interface NewsletterState {
  newsletters: NewsletterLog[];
  newsletterName: string;
  uploadedFile: File | null;
  uploadStep: number;
  uploadSelectedTags: Tag[];
  uploadColor: boolean;
  uploadDoubleSided: boolean;
  selectedFilters: Tag[];
  error: ErrorResponse;
  loading: boolean;
}
