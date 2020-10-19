import { AppThunk } from 'src/redux/helpers';
import {
  fetchContacts,
  createContacts,
  deleteContacts,
  updateContacts,
  createDirectLetter,
} from 'src/services/Api/contacts';
import { track } from 'src/utils/segment';
import { loadTags } from './tag';

const SET_ORG_CONTACTS = 'orgContacts/SET_ORG_CONTACTS';
const ADD_FILTER = 'orgContacts/ADD_FILTER';
const REMOVE_FILTER = 'orgContacts/REMOVE_FILTER';
const UPLOAD_CSV = 'orgContacts/UPLOAD_CSV';
const REMOVE_CSV = 'orgContacts/REMOVE_CSV';
const UPDATE_FILE_UPLOAD_STEP = 'orgContacts/UPDATE_FILE_UPLOAD_STEP';
const UPDATE_CSV_ROWS = 'orgContacts/UPDATE_CSV_ROWS';
const ADD_UPLOAD_TAG = 'orgContacts/UPDATE_UPLOAD_TAGS';
const REMOVE_UPLOAD_TAG = 'orgContacts/REMOVE_UPLOAD_TAG';
const REMOVE_ALL_UPLOAD_TAG = 'orgContacts/RESET_UPLOAD_TAG';
const ADD_ORG_CONTACTS = 'orgContacts/ADD_ORG_CONTACTS';
const LOADING = 'orgContacts/LOADING';
const ERROR = 'orgContacts/ERROR';
const DELETE_CONTACTS = 'orgContacts/DELETE_CONTACTS';
const UPDATE_CONTACTS = 'orgContacts/UPDATE_CONTACTS';
const SEND_DIRECT_LETTER = 'orgContacts/SEND_DIRECT_LETTER';
const SENT_DIRECT_LETTER = 'orgContacts/SENT_DIRECT_LETTER';

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

interface RemoveAllUploadTagsAction {
  type: typeof REMOVE_ALL_UPLOAD_TAG;
}

interface RemoveCsvAction {
  type: typeof REMOVE_CSV;
}

interface AddOrgContactsAction {
  type: typeof ADD_ORG_CONTACTS;
  payload: OrgContact[];
}

interface LoadingAction {
  type: typeof LOADING;
  payload: null;
}

interface ErrorAction {
  type: typeof ERROR;
  payload: ErrorResponse;
}

interface DeleteContactsAction {
  type: typeof DELETE_CONTACTS;
  payload: OrgContact[];
}

interface UpdateContactsAction {
  type: typeof UPDATE_CONTACTS;
  payload: OrgContact[]; // First element is contacts, second is tags
}

interface SendDirectLetter {
  type: typeof SEND_DIRECT_LETTER;
}

interface SentDirectLetter {
  type: typeof SENT_DIRECT_LETTER;
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
  | RemoveUploadTagAction
  | RemoveAllUploadTagsAction
  | LoadingAction
  | ErrorAction
  | DeleteContactsAction
  | UpdateContactsAction
  | SendDirectLetter
  | SentDirectLetter;

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

export const removeAllUploadTags = (): OrgContactsActionTypes => {
  return {
    type: REMOVE_ALL_UPLOAD_TAG,
  };
};

export const loading = (): OrgContactsActionTypes => {
  return {
    type: LOADING,
    payload: null,
  };
};

export const handleError = (error: ErrorResponse): OrgContactsActionTypes => {
  return {
    type: ERROR,
    payload: error,
  };
};

export const removeOrgContacts = (
  contacts: OrgContact[],
): OrgContactsActionTypes => {
  return {
    type: DELETE_CONTACTS,
    payload: contacts,
  };
};

export const updateOrgContacts = (
  contacts: OrgContact[],
): OrgContactsActionTypes => {
  return {
    type: UPDATE_CONTACTS,
    payload: contacts,
  };
};

export const sendDirectLetter = (): OrgContactsActionTypes => {
  return {
    type: SEND_DIRECT_LETTER,
    payload: null,
  };
};

export const sentDirectLetter = (): OrgContactsActionTypes => {
  return {
    type: SENT_DIRECT_LETTER,
    payload: null,
  };
};

const initialState: OrgContactsState = {
  contacts: [],
  selectedFilters: [],
  uploadedCsv: { file: null, data: [[]], header: [] },
  uploadStep: 0,
  uploadSelectedTags: [],
  loading: false,
  error: {} as ErrorResponse,
  currPage: 1,
  sentDirectLetter: false,
};

export function orgContactsReducer(
  state = initialState,
  action: OrgContactsActionTypes,
): OrgContactsState {
  switch (action.type) {
    case SET_ORG_CONTACTS:
      return {
        ...state,
        contacts: state.contacts.concat(action.payload),
        loading: false,
        currPage: state.currPage + 1,
      };
    case ADD_ORG_CONTACTS:
      return {
        ...state,
        contacts: [...action.payload, ...state.contacts],
        loading: false,
      };
    case ADD_FILTER:
      return {
        ...state,
        selectedFilters: [...state.selectedFilters, action.payload],
        loading: false,
      };
    case REMOVE_FILTER:
      return {
        ...state,
        selectedFilters: state.selectedFilters.filter(
          (selectedFilter) => selectedFilter.id !== action.payload.id,
        ),
        loading: false,
      };
    case UPLOAD_CSV:
      return {
        ...state,
        uploadedCsv: { ...state.uploadedCsv, file: action.payload },
        loading: false,
      };
    case REMOVE_CSV:
      return {
        ...state,
        uploadedCsv: { file: null, data: [[]], header: [] },
        loading: false,
      };
    case UPDATE_FILE_UPLOAD_STEP:
      return {
        ...state,
        uploadStep: action.payload,
        loading: false,
      };
    case UPDATE_CSV_ROWS:
      const [header, ...data] = action.payload;
      return {
        ...state,
        uploadedCsv: { ...state.uploadedCsv, data: data, header: header },
        loading: false,
      };
    case ADD_UPLOAD_TAG:
      return {
        ...state,
        uploadSelectedTags: [...state.uploadSelectedTags, action.payload],
        loading: false,
      };
    case REMOVE_UPLOAD_TAG:
      return {
        ...state,
        uploadSelectedTags: state.uploadSelectedTags.filter(
          (selectedTag) => selectedTag.id !== action.payload.id,
        ),
        loading: false,
      };
    case REMOVE_ALL_UPLOAD_TAG:
      return {
        ...state,
        uploadSelectedTags: [],
        loading: false,
      };
    case LOADING:
      return {
        ...state,
        error: {
          date: null,
          status: '',
          message: '',
          data: null,
        },
        loading: true,
      };
    case ERROR:
      console.log('payload: ');
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_CONTACTS:
      return {
        ...state,
        currPage: 1,
        contacts: state.contacts.filter((c) => !action.payload.includes(c)),
      };
    case UPDATE_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
      };
    case SEND_DIRECT_LETTER:
      return {
        ...state,
        loading: false,
        sentDirectLetter: false,
      };
    case SENT_DIRECT_LETTER:
      return {
        ...state,
        sentDirectLetter: true,
      };
    default:
      return state;
  }
}

export const editContactTags = (
  token: string,
  contacts: OrgContact[],
  tags: Tag[],
  orgId: number,
): AppThunk => async (dispatch) => {
  try {
    await updateContacts(token, contacts, tags, orgId);
    const updatedContacts = contacts.map((contact) => ({
      ...contact,
      tags: tags,
    }));
    dispatch(updateOrgContacts(updatedContacts));
  } catch (e) {
    dispatch(handleError(e));
  }
};

export const deleteOrgContacts = (
  token: string,
  contacts: OrgContact[],
): AppThunk => async (dispatch) => {
  deleteContacts(token, contacts)
    .then(() => dispatch(removeOrgContacts(contacts)))
    .catch((error) => dispatch(handleError(error)));
};

export const loadOrgContacts = (
  token: string,
  org_id: number,
  page: number,
): AppThunk => async (dispatch) => {
  dispatch(loading());
  fetchContacts(token, org_id, page)
    .then((contactsData) => dispatch(setOrgContacts(contactsData)))
    .catch((error) => dispatch(handleError(error)));
};

export const createOrgContacts = (
  token: string,
  org_id: number,
  mapping: ContactFieldMap,
  uploadedCsv: CSV,
  tags: Tag[],
): AppThunk => async (dispatch) => {
  const contacts: OrgContact[] = uploadedCsv.data.map((row) => {
    return {
      first_name: row[mapping.firstName.index],
      last_name: row[mapping.lastName.index],
      inmate_number: row[mapping.inmateNumber.index],
      facility_name: row[mapping.facilityName.index],
      facility_state: row[mapping.facilityState.index],
      facility_city: row[mapping.facilityCity.index],
      facility_address: row[mapping.facilityAddress.index],
      facility_postal: row[mapping.facilityPostal.index],
      unit: row[mapping.unit.index],
      dorm: row[mapping.dorm.index],
      relationship: 'Org Contact',
      selected: false,
    } as OrgContact;
  });
  const tag_ids: number[] = tags.map((tag) => {
    return tag.id;
  });
  dispatch(loading());
  createContacts(token, org_id, tag_ids, contacts)
    .then((contactsData) => dispatch(addOrgContacts(contactsData)))
    .then(() => {
      track('Contacts - Upload Contacts Success');
      tags.forEach((tag) => dispatch(removeFilter(tag)));
    })
    .then(() => dispatch(loadTags(token, org_id)))
    .catch((error) => dispatch(handleError(error)));
};

export const sendDirectMessage = (
  token: string,
  letter: DraftDirectLetter,
): AppThunk => async (dispatch) => {
  dispatch(loading());
  createDirectLetter(token, letter)
    .then(() => dispatch(sendDirectLetter()))
    .then((success) => {
      if (success) {
        track('Contacts - Send Letter Success');
        dispatch(sentDirectLetter());
      }
    })
    .catch((error) => {
      dispatch(handleError(error));
    });
};
