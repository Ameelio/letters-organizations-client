import { AppThunk } from '../helpers';
import { sampleOrgContacts } from '../../data/sampleOrgContacts';

const SET_ORG_CONTACTS = 'orgContacts/SET_ORG_CONTACTS';
const ADD_FILTER = 'orgContacts/ADD_FILTER';
const REMOVE_FILTER = 'orgContacts/REMOVE_FILTER';
const UPLOAD_CSV = 'orgContacts/UPLOAD_CSV';
const UPDATE_FILE_UPLOAD_STEP = 'orgContacts/UPDATE_FILE_UPLOAD_STEP';
const UPDATE_CSV_ROWS = 'orgContacts/UPDATE_CSV_ROWS';

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

type OrgContactsActionTypes =
  | SetOrgContactsAction
  | AddFilterAction
  | RemoveFilterAction
  | UploadCsvAction
  | UpdateUploadStepAction
  | UpdateCsvRowsAction;

export const setOrgContacts = (
  contacts: OrgContact[],
): OrgContactsActionTypes => {
  return {
    type: SET_ORG_CONTACTS,
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

const initialState: OrgContactsState = {
  contacts: [],
  selectedFilters: [],
  uploadedCsv: null,
  uploadStep: 0,
  uploadedCsvData: [[]],
  uploadedCsvHeader: [],
};

export function orgContactsReducer(
  state = initialState,
  action: OrgContactsActionTypes,
): OrgContactsState {
  switch (action.type) {
    case SET_ORG_CONTACTS:
      return { ...state, contacts: action.payload };
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
    default:
      return state;
  }
}

export const loadOrgContacts = (): AppThunk => async (dispatch) => {
  dispatch(setOrgContacts(sampleOrgContacts));
};
