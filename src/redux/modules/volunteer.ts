import { AppThunk } from 'src/redux/helpers';
import { fetchDrafts } from 'src/services/Api/contacts';
import { fetchVolunteerDetails } from '../../services/Api/volunteers';

// Action Constants & Shapes
const SET_VOLUNTEERS = 'volunteer/SET_VOLUNTEERS';
const SELECT_VOLUNTEER = 'volunteer/SET_VOLUNTEER';
const LOADING = 'volunteer/LOADING';
const LOADING_DETAILS = 'volunteer/LOADING_DETAILS';
const ERROR = 'volunteer/ERROR';
const SET_DRAFTS = 'volunteer/SET_DRAFTS';
const DELETE_VOLUNTEER = 'volunteer/DELETE_VOLUNTEER';

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
  payload: ErrorResponse;
}

interface SelectVolunteerAction {
  type: typeof SELECT_VOLUNTEER;
  payload: Volunteer;
}

interface LoadingDetailsAction {
  type: typeof LOADING_DETAILS;
  payload: null;
}

interface SetDraftsAction {
  type: typeof SET_DRAFTS;
  payload: LetterDraft[];
}

interface DeleteVolunteerAction {
  type: typeof DELETE_VOLUNTEER;
  payload: Volunteer;
}
export type VolunteerActionTypes =
  | SetVolunteersAction
  | SelectVolunteerAction
  | LoadingAction
  | LoadingDetailsAction
  | ErrorAction
  | SetDraftsAction
  | DeleteVolunteerAction;

// Action Creators
export const setVolunteers = (
  volunteers: Volunteer[],
): VolunteerActionTypes => {
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

export const handleError = (error: ErrorResponse): VolunteerActionTypes => {
  return {
    type: ERROR,
    payload: error,
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

const loadingDetails = (): VolunteerActionTypes => {
  return {
    type: LOADING_DETAILS,
    payload: null,
  };
};

const setDrafts = (drafts: LetterDraft[]): VolunteerActionTypes => {
  return {
    type: SET_DRAFTS,
    payload: drafts,
  };
};

export const deleteVolunteer = (volunteer: Volunteer): VolunteerActionTypes => {
  return {
    type: DELETE_VOLUNTEER,
    payload: volunteer,
  };
};

// Reducer
const initialState: VolunteerState = {
  all_volunteers: [],
  loading: false,
  error: {} as ErrorResponse,
  loading_details: false,
  selected_volunteer: {} as Volunteer,
  drafts: [] as LetterDraft[],
  page: 1,
};

export function volunteersReducer(
  state = initialState,
  action: VolunteerActionTypes,
): VolunteerState {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        error: {
          date: null,
          status: '',
          message: '',
          data: null,
        },
        loading: true,
      };
    case ERROR:
      return {
        ...state,
        loading: false,
        loading_details: false,
        error: action.payload,
      };
    case SET_VOLUNTEERS:
      return {
        ...state,
        all_volunteers: state.all_volunteers.concat(action.payload),
        page: state.page + 1,
        loading: false,
      };
    case LOADING_DETAILS:
      return {
        ...state,
        error: {
          date: null,
          status: '',
          message: '',
          data: null,
        },
        loading_details: true,
      };
    case SELECT_VOLUNTEER:
      return {
        ...state,
        loading: false,
        loading_details: false,
        selected_volunteer: action.payload,
      };
    case SET_DRAFTS:
      return {
        ...state,
        drafts: action.payload,
      };
    case DELETE_VOLUNTEER:
      return {
        ...state,
        all_volunteers: state.all_volunteers.filter(
          (volunteer) => volunteer.id !== action.payload.id,
        ),
      };
    default:
      return state;
  }
}

export const selectVolunteer = (
  token: string,
  volunteer: Volunteer,
): AppThunk => async (dispatch) => {
  if (volunteer.details) {
    dispatch(setSelectedVolunteer(volunteer));
  } else {
    dispatch(loadingDetails());
    fetchVolunteerDetails(volunteer)
      .then((volunteer) => dispatch(setSelectedVolunteer(volunteer)))
      .catch((error) => dispatch(handleError(error)));
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
  if (action.type === 'volunteer/SET_VOLUNTEERS') {
    const length = action.payload.length;
    dispatch(selectVolunteer(token, action.payload[length - 1]));
  }
};

export const loadLetterDrafts = (
  token: string,
  orgId: number,
): AppThunk => async (dispatch) => {
  fetchDrafts(token, orgId)
    .then((drafts: LetterDraft[]) => dispatch(setDrafts(drafts)))
    .catch((error) => dispatch(handleError(error)));
};
