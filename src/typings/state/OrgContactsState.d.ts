interface CSV {
  file: File | null;
  header: string[];
  data: string[][];
}

interface OrgContactsState {
  contacts: OrgContact[];
  selectedFilters: Tag[];
  uploadStep: number;
  uploadedCsv: CSV;
  uploadSelectedTags: Tag[];
  loading: boolean;
  error: ErrorResponse;
  currPage: number;
}
