import { combineReducers } from 'redux';
import { userReducer } from './modules/user';
import { volunteersReducer } from './modules/volunteer';
import { newsletterReducer } from './modules/newsletter';
import { tagsReducer } from './modules/tag';

export const rootReducer = combineReducers({
  user: userReducer,
  volunteers: volunteersReducer,
  newsletters: newsletterReducer,
  tags: tagsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
