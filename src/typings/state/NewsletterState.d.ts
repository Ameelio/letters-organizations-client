interface NewsletterState {
  newsletters: Newsletter[];
  uploadedFile: File | null;
  uploadStep: number;
  uploadSelectedTags: Tag[];
}
