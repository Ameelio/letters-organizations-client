import { AppThunk } from 'src/redux/helpers';
import { sampleVolunteers } from 'src/data/sampleVolunteers';

// Action Constants & Shapes
const SET_VOLUNTEERS = 'volunteer/SET_VOLUNTEERS';
const SELECT_VOLUNTEER = 'volunteer/SET_VOLUNTEER';

interface SetVolunteerAction {
  type: typeof SET_VOLUNTEERS;
  payload: Volunteer[];
}

interface SelectVolunteerAction {
  type: typeof SELECT_VOLUNTEER;
  payload: Volunteer;
}

type VolunteerActionTypes = SetVolunteerAction | SelectVolunteerAction;

// Action Creators
const setVolunteers = (volunteers: Volunteer[]): VolunteerActionTypes => {
  return {
    type: SET_VOLUNTEERS,
    payload: volunteers,
  };
};

export const selectVolunteer = (volunteer: Volunteer): VolunteerActionTypes => {
  return {
    type: SELECT_VOLUNTEER,
    payload: volunteer,
  };
};

// Reducer
const initialState: VolunteerState = {
  all_volunteers: [],
  loading: false,
  selected_volunteer: {} as Volunteer,
};

export function volunteersReducer(
  state = initialState,
  action: VolunteerActionTypes,
): VolunteerState {
  switch (action.type) {
    case SET_VOLUNTEERS:
      return {
        ...state,
        all_volunteers: action.payload,
        selected_volunteer: action.payload[0],
      };
    case SELECT_VOLUNTEER:
      return { ...state, selected_volunteer: action.payload };
    default:
      return state;
  }
}

export const loadVolunteers = (): AppThunk => async (dispatch) => {
  dispatch(setVolunteers(sampleVolunteers));
};
