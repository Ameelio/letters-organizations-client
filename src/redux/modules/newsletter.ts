import { AppThunk } from '../helpers';

//TODO add contacts logic
const UPLOAD_FILE = 'newsletter/UPLOAD_FILE';
const UPDATE_FILE_UPLOAD_STEP = 'newsletter/UPDATE_FILE_UPLOAD_STEP';
const SET_NEWSLETTERS = 'newsletter/UPLOAD_FILE';
const ADD_UPLOAD_TAG = 'newsletter/UPDATE_UPLOAD_TAGS';
const REMOVE_UPLOAD_TAG = 'newsletter/REMOVE_UPLOAD_TAG';
const ADD_NEWSLETTER = 'newsletter/SEND_NEWSLETTER';

interface UploadFileAction {
  type: typeof UPLOAD_FILE;
  payload: File;
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
// interface SetNewslettersAction {
//     type: typeof SET_NEWSLETTERS;
//     payload: Newsletter[]
// }

interface AddNewsletterAction {
  type: typeof ADD_NEWSLETTER;
  payload: Newsletter;
}

type NewsletterActionTypes =
  | UploadFileAction
  | UpdateUploadStepAction
  | AddUploadTagAction
  | RemoveUploadTagAction
  | AddNewsletterAction;

// Action creators
export const uploadFile = (file: File): NewsletterActionTypes => {
  return {
    type: UPLOAD_FILE,
    payload: file,
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

const addNewsletter = (newsletter: Newsletter): NewsletterActionTypes => {
  return {
    type: ADD_NEWSLETTER,
    payload: newsletter,
  };
};

// export const setNewsletters = (newsletters: Newsletter[]) : NewsletterActionTypes => {
//     return{ type: SET_NEWSLETTERS, payload: newsletters };
// }

// Reducer
const initialState: NewsletterState = {
  newsletters: [] as Newsletter[],
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
    // case SET_NEWSLETTERS:
    //   return { ...state, newsletters: action.payload };
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
          (selectedTag) => selectedTag.id != action.payload.id,
        ),
      };
    case ADD_NEWSLETTER:
      return {
        ...state,
        newsletters: [...state.newsletters, action.payload],
      };
    default:
      return state;
  }
}

export const sendNewsletter = (newsletter: Newsletter): AppThunk => async (
  dispatch,
) => {
  dispatch(addNewsletter(newsletter));
};
