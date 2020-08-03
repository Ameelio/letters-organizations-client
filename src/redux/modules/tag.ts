import { AppThunk } from 'src/redux/helpers';
import { sampleTags } from 'src/data/sampleTags';
import { fetchTags } from 'src/services/Api/tags';
import { addUploadTag } from './orgcontacts';

// Constants & Shapes
const SET_TAGS = 'tag/GET_TAGS';
const ADD_TAG = 'tag/ADD_TAG';
const LOADING = 'tag/LOADING';

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

type TagActionTypes = SetTagAction | AddTagAction | LoadingAction;

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

// Reducer
const initialState: TagState = { tags: [], loading: false };

export function tagsReducer(
  state = initialState,
  action: TagActionTypes,
): TagState {
  switch (action.type) {
    case SET_TAGS:
      return { tags: action.payload, loading: false };
    case ADD_TAG:
      return { tags: [...state.tags, action.payload], loading: false };
    case LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
}

export const loadTags = (token: string, org_id: number): AppThunk => async (
  dispatch,
) => {
  dispatch(loading());
  fetchTags(token, org_id)
    .then((tagData) => dispatch(setTags(tagData)))
    .catch((error) => console.log(error));
};

export const createTag = (label: string): AppThunk => async (dispatch) => {
  //TODO: replace this line with API call
  const newTag: Tag = { label: label, numContacts: 0, id: Math.random() * 100 };
  dispatch(addTag(newTag));
  dispatch(addUploadTag(newTag));
};
