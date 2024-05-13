import { createSelector } from '@ngrx/store';
import { Info } from '@models/info.model';

export interface AppState {
  info: Info
}

export const selectInfo = createSelector(
  (state: AppState) => state,
  (state) => state.info,
);

export const selectInfoReadyState = createSelector(
  (state: AppState) => state,
  (state) => state.info.isReady,
);

export const selectInfoPostsCount = createSelector(
  (state: AppState) => state,
  (state) => state.info.postsCount,
);