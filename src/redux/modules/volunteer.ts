import { AppThunk } from 'src/redux/helpers';
// import { sampleVolunteers } from 'src/data/sampleVolunteers';
import {
  fetchVolunteerDetails,
  fetchVolunteers,
} from '../../services/Api/volunteers';
// import {Simulate} from "react-dom/test-utils";

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
        // selected_volunteer: action.payload[0],
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
        dispatch(setSelectedVolunteer(action.payload[0]));
      }
    })
    .catch((error) => console.log(error));
};

export const selectVolunteer = (
  token: string,
  volunteer: Volunteer,
): AppThunk => async (dispatch) => {
  fetchVolunteerDetails(token, volunteer)
    .then((volunteer) => setSelectedVolunteer(volunteer))
    .catch((error) => console.log(error));
};
