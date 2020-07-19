interface OrgContactsState {
  contacts: OrgContact[];
  selectedFilters: Tag[];
  uploadedCsv: File | null;
  uploadStep: number;
  uploadedCsvHeader: string[];
  uploadedCsvData: string[][];
  uploadSelectedTags: Tag[];
}
