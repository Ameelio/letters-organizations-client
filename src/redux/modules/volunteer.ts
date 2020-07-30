import { AppThunk } from 'src/redux/helpers';
import {
  fetchVolunteerDetails,
  fetchVolunteers,
  addVolunteer,
} from '../../services/Api/volunteers';

// Action Constants & Shapes
const SET_VOLUNTEERS = 'volunteer/SET_VOLUNTEERS';
const SELECT_VOLUNTEER = 'volunteer/SET_VOLUNTEER';
const LOADING = 'volunteer/LOADING';
const LOADING_DETAILS = 'volunteer/LOADING_DETAILS';
const ERROR = 'volunteer/ERROR';

interface SetVolunteersAction {
  type: typeof SET_VOLUNTEERS;
  payload: Volunteer[];
}

interface LoadingAction {
  type: typeof LOADING;
  payload: null;
}

interface ErrorAction {
  type: typeof ERROR;
  payload: string;
}

interface SelectVolunteerAction {
  type: typeof SELECT_VOLUNTEER;
  payload: Volunteer;
}

interface LoadingDetailsAction {
  type: typeof LOADING_DETAILS;
  payload: null;
}

type VolunteerActionTypes =
  | SetVolunteersAction
  | SelectVolunteerAction
  | LoadingAction
  | LoadingDetailsAction
  | ErrorAction;

// Action Creators
const setVolunteers = (volunteers: Volunteer[]): VolunteerActionTypes => {
  return {
    type: SET_VOLUNTEERS,
    payload: volunteers,
  };
};

export const loading = (): VolunteerActionTypes => {
  return {
    type: LOADING,
    payload: null,
  };
};

const showError = (message: string): VolunteerActionTypes => {
  return {
    type: ERROR,
    payload: message,
  };
};

const setSelectedVolunteer = (volunteer: Volunteer): VolunteerActionTypes => {
  return {
    type: SELECT_VOLUNTEER,
    payload: volunteer,
  };
};

const loadingDetails = (): VolunteerActionTypes => {
  return {
    type: LOADING_DETAILS,
    payload: null,
  };
};

// Reducer
const initialState: VolunteerState = {
  all_volunteers: [],
  loading: false,
  error_message: '',
  loading_details: false,
  selected_volunteer: {} as Volunteer,
};

export function volunteersReducer(
  state = initialState,
  action: VolunteerActionTypes,
): VolunteerState {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        error_message: '',
        loading: true,
      };
    case ERROR:
      return {
        ...state,
        loading: false,
        error_message: action.payload,
      };
    case SET_VOLUNTEERS:
      return {
        ...state,
        all_volunteers: action.payload,
      };
    case LOADING_DETAILS:
      return {
        ...state,
        loading_details: true,
      };
    case SELECT_VOLUNTEER:
      return {
        ...state,
        loading: false,
        loading_details: false,
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
  dispatch(loading());
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
    dispatch(loadingDetails());
    fetchVolunteerDetails(token, volunteer)
      .then((volunteer) => dispatch(setSelectedVolunteer(volunteer)))
      .catch((error) => console.log(error));
  }
};

export const inviteVolunteer = (
  token: string,
  volunteer: Volunteer,
  state: VolunteerState,
): AppThunk => async (dispatch) => {
  const action = await dispatch(
    setVolunteers([...state.all_volunteers, volunteer]),
  );
  if (action.payload instanceof Array) {
    const length = action.payload.length;
    dispatch(selectVolunteer(token, action.payload[length - 1]));
  }
};
