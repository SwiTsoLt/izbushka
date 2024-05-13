import { createReducer, on } from '@ngrx/store';
import * as infoActions from './info.actions';
import { Info } from '@models/info.model';

export const infoNode = 'info';

export const initialState: Info = {
  isReady: false,
  postsCount: 0,
};

export const infoReducer = createReducer(
  initialState,
  on(infoActions.getInfo, (state): Info => state),
  on(infoActions.getInfoSuccess, (state, { info }): Info => ({ ...state, ...info, isReady: true })),
  on(infoActions.getInfoError, (state): Info => ({ ...state, isReady: true })),
);
