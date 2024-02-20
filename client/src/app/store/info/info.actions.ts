import { createAction, props } from '@ngrx/store';
import * as InfoInterface from './info.interface';
import { Info } from '@models/info.model';

export const getInfo = createAction(InfoInterface.InfoActionsEnum.getInfo);
export const getInfoSuccess = createAction(InfoInterface.InfoActionsEnum.getInfoSuccess, props<{ info: Info }>());
export const getInfoError = createAction(InfoInterface.InfoActionsEnum.getInfoError);