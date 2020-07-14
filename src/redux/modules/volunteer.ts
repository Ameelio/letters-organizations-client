import { typedAction } from '../helpers';
import { Dispatch, AnyAction } from 'redux';
import { RootState } from '..';
import { sampleVolunteers, dummy } from '../../data/sampleVolunteers';

const initialState: VolunteerState = {
  all_volunteers: [],
  loading: false,
  selected_volunteer: dummy,
};

const SET_VOLUNTEERS = 'volunteer/SET_VOLUNTEERS';
const SELECT_VOLUNTEER = 'volunteer/SET_VOLUNTEER';

const setVolunteers = (volunteers: Volunteer[]) => {
  return typedAction(SET_VOLUNTEERS, volunteers);
};

export const selectVolunteer = (volunteer: Volunteer) => {
  return typedAction(SELECT_VOLUNTEER, volunteer);
};

export const loadVolunteers = () => {
  return (dispatch: Dispatch<AnyAction>, getState: () => RootState) => {
    setTimeout(() => {
      dispatch(
        setVolunteers([
          ...getState().volunteers.all_volunteers,
          ...sampleVolunteers,
        ]),
      );
    }, 500);
  };
};

type VolunteerAction = ReturnType<
  typeof setVolunteers | typeof selectVolunteer
>;

export function volunteersReducer(
  state = initialState,
  action: VolunteerAction,
): VolunteerState {
  switch (action.type) {
    case SET_VOLUNTEERS:
      return { ...state, all_volunteers: action.payload };
    case SELECT_VOLUNTEER:
      return { ...state, selected_volunteer: action.payload };
    default:
      return state;
  }
}
