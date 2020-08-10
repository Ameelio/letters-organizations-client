import { AppThunk } from 'src/redux/helpers';
import {
  createNewsletter,
  fetchNewsletters,
} from '../../services/Api/newsletters';

const UPLOAD_FILE = 'newsletter/UPLOAD_FILE';
const REMOVE_FILE = 'newsletter/REMOVE_FILE';

const ADD_FILTER = 'newsletter/ADD_FILTER';
const REMOVE_FILTER = 'newsletter/REMOVE_FILTER';
const UPDATE_FILE_UPLOAD_STEP = 'newsletter/UPDATE_FILE_UPLOAD_STEP';
const SET_NEWSLETTERS = 'newsletter/SET_NEWSLETTERS';
const ADD_UPLOAD_TAG = 'newsletter/UPDATE_UPLOAD_TAGS';
const REMOVE_UPLOAD_TAG = 'newsletter/REMOVE_UPLOAD_TAG';
const ADD_NEWSLETTER = 'newsletter/ADD_NEWSLETTER';
const REMOVE_ALL_UPLOAD_TAG = 'newsletter/RESET_UPLOAD_TAG';
const ADD_ALL_UPLOAD_TAGS = 'newsletter/ADD_ALL_UPLOAD_TAGS';
const LOADING = 'newsletter/LOADING';
const ERROR = 'newsletter/ERROR';

interface LoadingAction {
  type: typeof LOADING;
  payload: null;
}

interface UploadFileAction {
  type: typeof UPLOAD_FILE;
  payload: File;
}

interface RemoveFileAction {
  type: typeof REMOVE_FILE;
}

interface UpdateUploadStepAction {
  type: typeof UPDATE_FILE_UPLOAD_STEP;
  payload: number;
}

interface AddUploadTagAction {
  type: typeof ADD_UPLOAD_TAG;
  payload: Tag;
}

interface RemoveUploadTagAction {
  type: typeof REMOVE_UPLOAD_TAG;
  payload: Tag;
}

interface SetNewslettersAction {
  type: typeof SET_NEWSLETTERS;
  payload: NewsletterLog[];
}

interface AddFilterAction {
  type: typeof ADD_FILTER;
  payload: Tag;
}

interface RemoveFilterAction {
  type: typeof REMOVE_FILTER;
  payload: Tag;
}

interface AddNewsletterAction {
  type: typeof ADD_NEWSLETTER;
  payload: NewsletterLog;
}

interface RemoveAllUploadTagsAction {
  type: typeof REMOVE_ALL_UPLOAD_TAG;
}

interface AddAllUploadTagsAction {
  type: typeof ADD_ALL_UPLOAD_TAGS;
  payload: Tag[];
}

interface ErrorAction {
  type: typeof ERROR;
  payload: ErrorResponse;
}

type NewsletterActionTypes =
  | AddFilterAction
  | RemoveFilterAction
  | UploadFileAction
  | UpdateUploadStepAction
  | AddUploadTagAction
  | RemoveUploadTagAction
  | RemoveAllUploadTagsAction
  | AddAllUploadTagsAction
  | SetNewslettersAction
  | AddNewsletterAction
  | RemoveFileAction
  | LoadingAction
  | ErrorAction;

// Action creators
export const addFilter = (tag: Tag): NewsletterActionTypes => {
  return {
    type: ADD_FILTER,
    payload: tag,
  };
};

export const removeFilter = (tag: Tag): NewsletterActionTypes => {
  return {
    type: REMOVE_FILTER,
    payload: tag,
  };
};

export const uploadFile = (file: File): NewsletterActionTypes => {
  return {
    type: UPLOAD_FILE,
    payload: file,
  };
};

export const removeFile = (): NewsletterActionTypes => {
  return {
    type: REMOVE_FILE,
  };
};

export const updateFileUploadStep = (step: number): NewsletterActionTypes => {
  return {
    type: UPDATE_FILE_UPLOAD_STEP,
    payload: step,
  };
};

export const addUploadTag = (tag: Tag): NewsletterActionTypes => {
  return {
    type: ADD_UPLOAD_TAG,
    payload: tag,
  };
};

export const removeUploadTag = (tag: Tag): NewsletterActionTypes => {
  return {
    type: REMOVE_UPLOAD_TAG,
    payload: tag,
  };
};

const addNewsletter = (newsletter: NewsletterLog): NewsletterActionTypes => {
  return {
    type: ADD_NEWSLETTER,
    payload: newsletter,
  };
};

export const removeAllUploadTags = (): NewsletterActionTypes => {
  return {
    type: REMOVE_ALL_UPLOAD_TAG,
  };
};

export const addAllUploadTags = (tags: Tag[]): NewsletterActionTypes => {
  return {
    type: ADD_ALL_UPLOAD_TAGS,
    payload: tags,
  };
};

const setNewsletters = (
  newsletters: NewsletterLog[],
): NewsletterActionTypes => {
  return { type: SET_NEWSLETTERS, payload: newsletters };
};

const handleError = (error: ErrorResponse): NewsletterActionTypes => {
  return {
    type: ERROR,
    payload: error,
  };
};

export const loading = (): NewsletterActionTypes => {
  return {
    type: LOADING,
    payload: null,
  };
};

// Reducer
const initialState: NewsletterState = {
  newsletters: [] as NewsletterLog[],
  uploadedFile: null,
  uploadStep: 0,
  uploadSelectedTags: [],
  selectedFilters: [],
  error: {} as ErrorResponse,
  loading: false,
};

export function newsletterReducer(
  state = initialState,
  action: NewsletterActionTypes,
): NewsletterState {
  switch (action.type) {
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
    case SET_NEWSLETTERS:
      return { ...state, newsletters: action.payload, loading: false };
    case UPLOAD_FILE:
      return {
        ...state,
        uploadedFile: action.payload,
        loading: false,
      };
    case REMOVE_FILE:
      return {
        ...state,
        uploadedFile: null,
        loading: false,
      };
    case UPDATE_FILE_UPLOAD_STEP:
      return {
        ...state,
        uploadStep: action.payload,
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
    case ADD_NEWSLETTER:
      return {
        ...state,
        newsletters: [...state.newsletters, action.payload],
        loading: false,
      };
    case REMOVE_ALL_UPLOAD_TAG:
      return {
        ...state,
        uploadSelectedTags: [],
        loading: false,
      };
    case ADD_ALL_UPLOAD_TAGS:
      return {
        ...state,
        uploadSelectedTags: action.payload,
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
    default:
      return state;
  }
}

export const sendNewsletter = (
  token: string,
  newsletter: DraftNewsletter,
  pageCount: number,
): AppThunk => async (dispatch) => {
  dispatch(loading());
  createNewsletter(token, newsletter, false, pageCount)
    .then((newsletter) => dispatch(addNewsletter(newsletter)))
    .catch((error) => handleError(error));
};

export const loadNewsletters = (token: string): AppThunk => async (
  dispatch,
) => {
  dispatch(loading());
  fetchNewsletters(token)
    .then((newsletters) => dispatch(setNewsletters(newsletters)))
    .catch((error) => handleError(error));
};
