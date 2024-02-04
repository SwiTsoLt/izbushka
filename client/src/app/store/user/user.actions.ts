import { createAction, props } from '@ngrx/store';
import * as UserInterface from './user.interface';
import { User } from '../../models/user.model';

export const getUserByAccessToken = createAction(UserInterface.UserActionsEnum.getUserByAccessToken)
export const getUserByAccessTokenSuccess = createAction(UserInterface.UserActionsEnum.getUserByAccessTokenSuccess, props<{ user: User }>())
export const getUserByAccessTokenError = createAction(UserInterface.UserActionsEnum.getUserByAccessTokenError)

export const resetUser = createAction(UserInterface.UserActionsEnum.resetUser)