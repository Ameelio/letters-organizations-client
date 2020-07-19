interface CSV {
  file: File | null;
  header: string[];
  data: string[][];
}

interface OrgContactsState {
  contacts: OrgContact[];
  selectedFilters: Tag[];
  // uploadedCsv: File | null;
  uploadStep: number;
  // uploadedCsvHeader: string[];
  // uploadedCsvData: string[][];
  uploadedCsv: CSV;
  uploadSelectedTags: Tag[];
}
