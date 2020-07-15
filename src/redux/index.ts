import { combineReducers } from 'redux';
import { userReducer } from './modules/user';
import { volunteersReducer } from './modules/volunteer';

export const rootReducer = combineReducers({
  user: userReducer,
  volunteers: volunteersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
