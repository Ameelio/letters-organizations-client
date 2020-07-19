import { AppThunk } from 'src/redux/helpers';
import { sampleTags } from 'src/data/sampleTags';
import { addUploadTag } from './orgcontacts';

// Constants & Shapes
const SET_TAGS = 'tag/GET_TAGS';
const ADD_TAG = 'tag/ADD_TAG';

interface SetTagAction {
  type: typeof SET_TAGS;
  payload: Tag[];
}

interface AddTagAction {
  type: typeof ADD_TAG;
  payload: Tag;
}

type TagActionTypes = SetTagAction | AddTagAction;

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

// Reducer
const initialState: TagState = { tags: [] };

export function tagsReducer(
  state = initialState,
  action: TagActionTypes,
): TagState {
  switch (action.type) {
    case SET_TAGS:
      return { ...state, tags: action.payload };
    case ADD_TAG:
      return { ...state, tags: [...state.tags, action.payload] };
    default:
      return state;
  }
}

export const loadTags = (): AppThunk => async (dispatch) => {
  //TODO: adds API call
  dispatch(setTags(sampleTags));
};

export const createTag = (label: string): AppThunk => async (dispatch) => {
  //TODO: replace this line with API call
  const newTag: Tag = { label: label, numContacts: 0, id: Math.random() * 100 };
  dispatch(addTag(newTag));
  dispatch(addUploadTag(newTag));
};
