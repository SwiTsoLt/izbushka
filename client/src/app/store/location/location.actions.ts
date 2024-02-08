import { createAction, props } from '@ngrx/store';
import { ILocations, LocationActionsEnum } from './location.interface';

export const getAllLocations = createAction(
  LocationActionsEnum.getAllLocations,
);
export const getAllLocationsSuccess = createAction(
  LocationActionsEnum.getAllLocationsSuccess,
  props<{ locations: ILocations }>(),
);
export const getAllLocationsError = createAction(
  LocationActionsEnum.getAllLocationsError,
);
