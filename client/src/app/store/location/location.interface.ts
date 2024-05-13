import { LocationArea, LocationRegion } from '@models/location.model';

export interface ILocations {
  area: LocationArea[];
  region: LocationRegion[];
}

// Actions

export enum LocationActionsEnum {
  getAllLocations = '[App Component] [Location] Get All',
  getAllLocationsSuccess = '[App Component] [Location] Get All Success',
  getAllLocationsError = '[App Component] [Location] Get All Error',
}
