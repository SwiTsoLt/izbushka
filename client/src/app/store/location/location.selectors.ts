import { createSelector } from '@ngrx/store';
import { ILocations } from './location.interface';

export interface AppState {
  location: ILocations;
}

export const selectLocation = createSelector(
  (state: AppState) => state,
  (state) => state.location,
);

export const selectLocationArea = createSelector(
  (state: AppState) => state,
  (state) => state.location.area,
);

export const selectLocationRegion = createSelector(
  (state: AppState) => state,
  (state) => state.location.region,
);
