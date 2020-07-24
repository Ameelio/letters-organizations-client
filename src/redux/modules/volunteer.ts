import { AppThunk } from 'src/redux/helpers';
import {
  fetchVolunteerDetails,
  fetchVolunteers,
} from '../../services/Api/volunteers';

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

export const setSelectedVolunteer = (
  volunteer: Volunteer,
): VolunteerActionTypes => {
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
      };
    case SELECT_VOLUNTEER:
      return {
        ...state,
        selected_volunteer: action.payload,
      };
    default:
      return state;
  }
}

export const loadVolunteers = (
  token: string,
  org_id: number,
): AppThunk => async (dispatch) => {
  fetchVolunteers(token, org_id)
    .then((volunteersData) => dispatch(setVolunteers(volunteersData)))
    .then((action) => {
      if (action.payload instanceof Array) {
        dispatch(selectVolunteer(token, action.payload[0]));
      }
    })
    .catch((error) => console.log(error));
};

export const selectVolunteer = (
  token: string,
  volunteer: Volunteer,
): AppThunk => async (dispatch) => {
  if (volunteer.details) {
    dispatch(setSelectedVolunteer(volunteer));
  } else {
    fetchVolunteerDetails(token, volunteer)
      .then((volunteer) => dispatch(setSelectedVolunteer(volunteer)))
      .catch((error) => console.log(error));
  }
};
