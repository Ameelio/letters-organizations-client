import { ThunkAction } from 'redux-thunk';
import { RootState } from './index';
import { Action } from 'redux';

export function typedAction<T extends string>(type: T): { type: T };
export function typedAction<T extends string, P extends any>(
  type: T,
  payload: P,
): { type: T; payload: P };
export function typedAction(type: string, payload?: any) {
  return { type, payload };
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
