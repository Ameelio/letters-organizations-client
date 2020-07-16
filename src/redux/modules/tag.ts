import { AppThunk } from '../helpers';
import { sampleTags } from '../../data/sampleTags';

// Constants & Shapes
const SET_TAGS = 'tag/GET_TAGS';

interface SetTagAction {
  type: typeof SET_TAGS;
  payload: Tag[];
}

type TagActionTypes = SetTagAction;

// Action Creators

const setTags = (tags: Tag[]): TagActionTypes => {
  return {
    type: SET_TAGS,
    payload: tags,
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
    default:
      return state;
  }
}

export const loadTags = (): AppThunk => async (dispatch) => {
  console.log('here');
  dispatch(setTags(sampleTags));
};
