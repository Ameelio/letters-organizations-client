import { combineReducers } from 'redux';
import { userReducer } from './modules/user';
import { volunteersReducer } from './modules/volunteer';
import { newsletterReducer } from './modules/newsletter';
import { tagsReducer } from './modules/tag';
import { orgContactsReducer } from './modules/orgcontacts';

const appReducer = combineReducers({
  user: userReducer,
  volunteers: volunteersReducer,
  newsletters: newsletterReducer,
  tags: tagsReducer,
  orgContacts: orgContactsReducer,
});
export type AppState = ReturnType<typeof appReducer> | undefined;

export const rootReducer = (state: AppState, action: any) => {
  if (action.type == 'user/LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
