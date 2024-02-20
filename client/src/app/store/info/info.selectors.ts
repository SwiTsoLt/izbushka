import { createSelector } from '@ngrx/store';
import { Info } from '@models/info.model';

export interface AppState {
  info: Info
}

export const selectInfo = createSelector(
  (state: AppState) => state,
  (state) => state.info,
);