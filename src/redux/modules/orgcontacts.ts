import { AppThunk } from 'src/redux/helpers';
import { sampleOrgContacts } from 'src/data/sampleOrgContacts';

const SET_ORG_CONTACTS = 'orgContacts/SET_ORG_CONTACTS';
const ADD_FILTER = 'orgContacts/ADD_FILTER';
const REMOVE_FILTER = 'orgContacts/REMOVE_FILTER';
const UPLOAD_CSV = 'orgContacts/UPLOAD_CSV';
const REMOVE_CSV = 'orgContacts/REMOVE_CSV';
const UPDATE_FILE_UPLOAD_STEP = 'orgContacts/UPDATE_FILE_UPLOAD_STEP';
const UPDATE_CSV_ROWS = 'orgContacts/UPDATE_CSV_ROWS';
const ADD_UPLOAD_TAG = 'orgContacts/UPDATE_UPLOAD_TAGS';
const REMOVE_UPLOAD_TAG = 'orgContacts/REMOVE_UPLOAD_TAG';
const ADD_ORG_CONTACTS = 'orgContacts/ADD_ORG_CONTACTS';

interface SetOrgContactsAction {
  type: typeof SET_ORG_CONTACTS;
  payload: OrgContact[];
}

interface AddFilterAction {
  type: typeof ADD_FILTER;
  payload: Tag;
}

interface RemoveFilterAction {
  type: typeof REMOVE_FILTER;
  payload: Tag;
}

interface UploadCsvAction {
  type: typeof UPLOAD_CSV;
  payload: File;
}

interface UpdateUploadStepAction {
  type: typeof UPDATE_FILE_UPLOAD_STEP;
  payload: number;
}

interface UpdateCsvRowsAction {
  type: typeof UPDATE_CSV_ROWS;
  payload: string[][];
}

interface AddUploadTagAction {
  type: typeof ADD_UPLOAD_TAG;
  payload: Tag;
}

interface RemoveUploadTagAction {
  type: typeof REMOVE_UPLOAD_TAG;
  payload: Tag;
}

interface RemoveCsvAction {
  type: typeof REMOVE_CSV;
}

interface AddOrgContactsAction {
  type: typeof ADD_ORG_CONTACTS;
  payload: OrgContact[];
}

type OrgContactsActionTypes =
  | SetOrgContactsAction
  | AddOrgContactsAction
  | AddFilterAction
  | RemoveFilterAction
  | UploadCsvAction
  | RemoveCsvAction
  | UpdateUploadStepAction
  | UpdateCsvRowsAction
  | AddUploadTagAction
  | RemoveUploadTagAction;

export const setOrgContacts = (
  contacts: OrgContact[],
): OrgContactsActionTypes => {
  return {
    type: SET_ORG_CONTACTS,
    payload: contacts,
  };
};

export const addOrgContacts = (
  contacts: OrgContact[],
): OrgContactsActionTypes => {
  return {
    type: ADD_ORG_CONTACTS,
    payload: contacts,
  };
};

export const addFilter = (tag: Tag): OrgContactsActionTypes => {
  return {
    type: ADD_FILTER,
    payload: tag,
  };
};

export const removeFilter = (tag: Tag): OrgContactsActionTypes => {
  return {
    type: REMOVE_FILTER,
    payload: tag,
  };
};

export const uploadCsv = (file: File): OrgContactsActionTypes => {
  return {
    type: UPLOAD_CSV,
    payload: file,
  };
};

export const removeCsv = (): OrgContactsActionTypes => {
  return {
    type: REMOVE_CSV,
  };
};

export const updateCsvUploadStep = (step: number): OrgContactsActionTypes => {
  return {
    type: UPDATE_FILE_UPLOAD_STEP,
    payload: step,
  };
};

export const updateCsvRows = (rows: string[][]): OrgContactsActionTypes => {
  return {
    type: UPDATE_CSV_ROWS,
    payload: rows,
  };
};

export const addUploadTag = (tag: Tag): OrgContactsActionTypes => {
  return {
    type: ADD_UPLOAD_TAG,
    payload: tag,
  };
};

export const removeUploadTag = (tag: Tag): OrgContactsActionTypes => {
  return {
    type: REMOVE_UPLOAD_TAG,
    payload: tag,
  };
};

const initialState: OrgContactsState = {
  contacts: [],
  selectedFilters: [],
  uploadedCsv: null,
  uploadStep: 0,
  uploadedCsvData: [[]],
  uploadedCsvHeader: [],
  uploadSelectedTags: [],
};

export function orgContactsReducer(
  state = initialState,
  action: OrgContactsActionTypes,
): OrgContactsState {
  switch (action.type) {
    case SET_ORG_CONTACTS:
      return { ...state, contacts: action.payload };
    case ADD_ORG_CONTACTS:
      return { ...state, contacts: [...state.contacts, ...action.payload] };
    case ADD_FILTER:
      return {
        ...state,
        selectedFilters: [...state.selectedFilters, action.payload],
      };
    case REMOVE_FILTER:
      return {
        ...state,
        selectedFilters: state.selectedFilters.filter(
          (selectedFilter) => selectedFilter.id !== action.payload.id,
        ),
      };
    case UPLOAD_CSV:
      return {
        ...state,
        uploadedCsv: action.payload,
      };
    case REMOVE_CSV:
      return {
        ...state,
        uploadedCsv: null,
      };
    case UPDATE_FILE_UPLOAD_STEP:
      return {
        ...state,
        uploadStep: action.payload,
      };
    case UPDATE_CSV_ROWS:
      const [header, ...data] = action.payload;
      return {
        ...state,
        uploadedCsvData: data,
        uploadedCsvHeader: header,
      };
    case ADD_UPLOAD_TAG:
      return {
        ...state,
        uploadSelectedTags: [...state.uploadSelectedTags, action.payload],
      };
    case REMOVE_UPLOAD_TAG:
      return {
        ...state,
        uploadSelectedTags: state.uploadSelectedTags.filter(
          (selectedTag) => selectedTag.id !== action.payload.id,
        ),
      };
    default:
      return state;
  }
}

export const loadOrgContacts = (): AppThunk => async (dispatch) => {
  dispatch(setOrgContacts(sampleOrgContacts));
};

// export const addOrgContacts = (): AppThunk => async (dispatch) => {
//   dispatch(addOrgContacts())
// }
