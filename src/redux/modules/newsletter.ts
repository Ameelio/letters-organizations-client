const UPLOAD_FILE = 'newsletter/UPLOAD_FILE';
const UPDATE_FILE_UPLOAD_STEP = 'newsletter/UPDATE_FILE_UPLOAD_STEP';
const SET_NEWSLETTERS = 'newsletter/UPLOAD_FILE';

interface UploadFileAction {
  type: typeof UPLOAD_FILE;
  payload: File;
}

interface UpdateFileUploadStep {
  type: typeof UPDATE_FILE_UPLOAD_STEP;
  payload: UploadStep;
}

// interface SetNewslettersAction {
//     type: typeof SET_NEWSLETTERS;
//     payload: Newsletter[]
// }

type NewsletterActionTypes = UploadFileAction | UpdateFileUploadStep;
// type NewsletterActionTypes = UploadFileAction | SetNewslettersAction ;

// Action creators
export const uploadFile = (file: File): NewsletterActionTypes => {
  return {
    type: UPLOAD_FILE,
    payload: file,
  };
};

export const updateFileUploadStep = (
  step: UploadStep,
): NewsletterActionTypes => {
  console.log(step);
  return {
    type: UPDATE_FILE_UPLOAD_STEP,
    payload: step,
  };
};
// export const setNewsletters = (newsletters: Newsletter[]) : NewsletterActionTypes => {
//     return{ type: SET_NEWSLETTERS, payload: newsletters };
// }

// Reducer
const initialState: NewsletterState = {
  newsletters: [] as Newsletter[],
  uploadedFile: null,
  uploadStep: 1,
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
    default:
      return state;
  }
}
