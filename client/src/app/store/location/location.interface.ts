import { LocationArea, LocationRegion } from '@models/location.model';

export interface ILocations {
  area: LocationArea[];
  region: LocationRegion[];
}

// Actions

export enum LocationActionsEnum {
  getAllLocations = '[App Component] Get All Locations',
  getAllLocationsSuccess = '[App Component] Get All Locations Success',
  getAllLocationsError = '[App Component] Get All Locations Error',
}
