import { AppThunk } from '../helpers';
import { sampleOrgContacts } from '../../data/sampleOrgContacts';

const SET_ORG_CONTACTS = 'orgcontacts/SET_ORG_CONTACTS';
const ADD_FILTER = 'orgcontacts/ADD_FILTER';
const REMOVE_FILTER = 'orgcontacts/REMOVE_FILTER';

interface SetOrgContactsAction {
  type: typeof SET_ORG_CONTACTS;
  payload: OrgContact[];
}

interface AddFilterAction {
  type: typeof ADD_FILTER;
  payload: Tag;
}

interface RemoveFilterAction {
  type: typeof REMOVE_FILTER;
  payload: Tag;
}

type OrgContactsActionTypes =
  | SetOrgContactsAction
  | AddFilterAction
  | RemoveFilterAction;

export const setOrgContacts = (
  contacts: OrgContact[],
): OrgContactsActionTypes => {
  return {
    type: SET_ORG_CONTACTS,
    payload: contacts,
  };
};

export const addFilter = (tag: Tag): OrgContactsActionTypes => {
  return {
    type: ADD_FILTER,
    payload: tag,
  };
};

export const removeFilter = (tag: Tag): OrgContactsActionTypes => {
  return {
    type: REMOVE_FILTER,
    payload: tag,
  };
};

const initialState: OrgContactsState = {
  contacts: [],
  selectedFilters: [],
};

export function orgContactsReducer(
  state = initialState,
  action: OrgContactsActionTypes,
): OrgContactsState {
  switch (action.type) {
    case SET_ORG_CONTACTS:
      return { ...state, contacts: action.payload };
    case ADD_FILTER:
      return {
        ...state,
        selectedFilters: [...state.selectedFilters, action.payload],
      };
    case REMOVE_FILTER:
      return {
        ...state,
        selectedFilters: state.selectedFilters.filter(
          (selectedFilter) => selectedFilter.id !== action.payload.id,
        ),
      };
    default:
      return state;
  }
}

export const loadOrgContacts = (): AppThunk => async (dispatch) => {
  dispatch(setOrgContacts(sampleOrgContacts));
};
