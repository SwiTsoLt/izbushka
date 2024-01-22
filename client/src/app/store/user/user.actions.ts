import { createAction, props } from '@ngrx/store';
import * as UserInterface from './user.interface';
import { User } from '../../model/user.model';

export const setUser = createAction(UserInterface.UserActionsEnum.setUser, props<{ user: User }>())
export const resetUser = createAction(UserInterface.UserActionsEnum.resetUser)