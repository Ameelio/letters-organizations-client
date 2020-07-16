import { combineReducers } from 'redux';
import { userReducer } from './modules/user';
import { volunteersReducer } from './modules/volunteer';
import { newsletterReducer } from './modules/newsletter';

export const rootReducer = combineReducers({
  user: userReducer,
  volunteers: volunteersReducer,
  newsletters: newsletterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
