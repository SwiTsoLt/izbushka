import { createReducer, on } from '@ngrx/store';
import * as userActions from './location.actions';
import { ILocations } from './location.interface';

export const locationNode = 'location';

export const initialState: ILocations = {
  area: [],
  region: [],
};

export const locationReducer = createReducer(
  initialState,
  on(userActions.getAllLocations, (state): ILocations => state),
  on(
    userActions.getAllLocationsSuccess,
    (_state, { locations }): ILocations => locations,
  ),
  on(userActions.getAllLocationsError, (state): ILocations => state),
);
