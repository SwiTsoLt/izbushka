import { createAction, props } from '@ngrx/store';
import * as UserInterface from './user.interface';
import { User } from '../../model/user.model';

export const getUserByAccessToken = createAction(UserInterface.UserActionsEnum.getUserByAccessToken, props<{ access_token: string }>())
export const getUserByAccessTokenSuccess = createAction(UserInterface.UserActionsEnum.getUserByAccessTokenSuccess, props<{ user: User }>())
export const getUserByAccessTokenError = createAction(UserInterface.UserActionsEnum.getUserByAccessTokenError)

export const resetUser = createAction(UserInterface.UserActionsEnum.resetUser)