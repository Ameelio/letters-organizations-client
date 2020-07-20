import { AppThunk } from 'src/redux/helpers';
import { sampleNewsletters } from 'src/data/sampleNewsletters';

//TODO add contacts logic
const UPLOAD_FILE = 'newsletter/UPLOAD_FILE';
const REMOVE_FILE = 'newsletter/REMOVE_FILE';

const UPDATE_FILE_UPLOAD_STEP = 'newsletter/UPDATE_FILE_UPLOAD_STEP';
const SET_NEWSLETTERS = 'newsletter/SET_NEWSLETTERS';
const ADD_UPLOAD_TAG = 'newsletter/UPDATE_UPLOAD_TAGS';
const REMOVE_UPLOAD_TAG = 'newsletter/REMOVE_UPLOAD_TAG';
const ADD_NEWSLETTER = 'newsletter/ADD_NEWSLETTER';
const REMOVE_ALL_UPLOAD_TAG = 'newsletter/RESET_UPLOAD_TAG';
const ADD_ALL_UPLOAD_TAGS = 'newsletter/ADD_ALL_UPLOAD_TAGS';

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

type NewsletterActionTypes =
  | UploadFileAction
  | UpdateUploadStepAction
  | AddUploadTagAction
  | RemoveUploadTagAction
  | RemoveAllUploadTagsAction
  | AddAllUploadTagsAction
  | SetNewslettersAction
  | AddNewsletterAction
  | RemoveFileAction;

// Action creators
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

// Reducer
const initialState: NewsletterState = {
  newsletters: [] as NewsletterLog[],
  uploadedFile: null,
  uploadStep: 0,
  uploadSelectedTags: [],
};

export function newsletterReducer(
  state = initialState,
  action: NewsletterActionTypes,
): NewsletterState {
  switch (action.type) {
    case UPLOAD_FILE:
      return {
        ...state,
        uploadedFile: action.payload,
      };
    case REMOVE_FILE:
      return {
        ...state,
        uploadedFile: null,
      };
    case UPDATE_FILE_UPLOAD_STEP:
      return {
        ...state,
        uploadStep: action.payload,
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
    case SET_NEWSLETTERS:
      return { ...state, newsletters: action.payload };
    case ADD_NEWSLETTER:
      console.log(action.payload);
      return {
        ...state,
        newsletters: [...state.newsletters, action.payload],
      };
    case REMOVE_ALL_UPLOAD_TAG:
      return {
        ...state,
        uploadSelectedTags: [],
      };
    case ADD_ALL_UPLOAD_TAGS:
      return {
        ...state,
        uploadSelectedTags: action.payload,
      };
    default:
      return state;
  }
}

// TODO replace with API calls
export const sendNewsletter = (newsletter: DraftNewsletter): AppThunk => async (
  dispatch,
) => {
  const fakeNewsletterLog: NewsletterLog = {
    id: Math.random() * 100,
    title: newsletter.title,
    fileLink: '',
    delivered: 0,
    inTransit: newsletter.numContacts,
    returned: 0,
    creationDate: new Date(),
    estimatedArrival: new Date(),
    tags: newsletter.tags,
  };
  console.log('here');
  dispatch(addNewsletter(fakeNewsletterLog));
};

export const loadNewsletters = (): AppThunk => async (dispatch) => [
  dispatch(setNewsletters(sampleNewsletters)),
];
