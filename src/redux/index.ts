import { combineReducers } from 'redux';
import { userReducer } from './modules/user';
import { volunteersReducer } from './modules/volunteer';
import { newsletterReducer } from './modules/newsletter';
import { tagsReducer } from './modules/tag';
import { orgContactsReducer } from './modules/orgcontacts';
import { volunteerContactReducer } from './modules/volunteerContacts';

export const rootReducer = combineReducers({
  session: userReducer,
  volunteers: volunteersReducer,
  newsletters: newsletterReducer,
  tags: tagsReducer,
  orgContacts: orgContactsReducer,
  volunteerContacts: volunteerContactReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
