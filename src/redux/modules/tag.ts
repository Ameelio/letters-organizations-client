import { AppThunk } from 'src/redux/helpers';
import { sampleTags } from 'src/data/sampleTags';
import { fetchTags, createTag } from 'src/services/Api/tags';
import { addUploadTag } from './orgcontacts';

// Constants & Shapes
const SET_TAGS = 'tag/GET_TAGS';
const ADD_TAG = 'tag/ADD_TAG';
const LOADING = 'tag/LOADING';
const ERROR = 'tag/ERROR';

interface SetTagAction {
  type: typeof SET_TAGS;
  payload: Tag[];
}

interface AddTagAction {
  type: typeof ADD_TAG;
  payload: Tag;
}

interface LoadingAction {
  type: typeof LOADING;
  payload: null;
}

interface ErrorAction {
  type: typeof ERROR;
  payload: ErrorResponse;
}

type TagActionTypes = SetTagAction | AddTagAction | LoadingAction | ErrorAction;

// Action Creators

const setTags = (tags: Tag[]): TagActionTypes => {
  return {
    type: SET_TAGS,
    payload: tags,
  };
};

const addTag = (tag: Tag): TagActionTypes => {
  return {
    type: ADD_TAG,
    payload: tag,
  };
};

export const loading = (): TagActionTypes => {
  return {
    type: LOADING,
    payload: null,
  };
};

export const handleError = (error: ErrorResponse): TagActionTypes => {
  return {
    type: ERROR,
    payload: error,
  };
};

// Reducer
const initialState: TagState = {
  tags: [],
  loading: false,
  error: {} as ErrorResponse,
};

export function tagsReducer(
  state = initialState,
  action: TagActionTypes,
): TagState {
  switch (action.type) {
    case SET_TAGS:
      return { ...state, tags: action.payload, loading: false };
    case ADD_TAG:
      return {
        ...state,
        tags: [...state.tags, action.payload],
        loading: false,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
        error: {
          date: null,
          status: '',
          message: '',
          data: null,
        },
      };
    case ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

export const loadTags = (token: string, org_id: number): AppThunk => async (
  dispatch,
) => {
  dispatch(loading());
  fetchTags(token, org_id)
    .then((tagsData) => dispatch(setTags(tagsData)))
    .catch((error) => dispatch(handleError(error)));
};

export const onCreate = (tag: Tag): AppThunk => async (dispatch) => {
  dispatch(addTag(tag));
  dispatch(addUploadTag(tag));
};

export const addNewTag = (
  token: string,
  org_id: number,
  label: string,
): AppThunk => async (dispatch) => {
  createTag(token, org_id, label)
    .then((tagData) => dispatch(onCreate(tagData)))
    .catch((error) => dispatch(handleError(error)));
};
