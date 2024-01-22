import { createReducer, on } from "@ngrx/store";
import * as UserInterface from "./user.interface";
import * as userActions from "./user.actions"

export const userNode = "user"

export const initialState: UserInterface.IInitialState = {
    user: null
}

export const userReducer = createReducer(
    initialState,
    on(userActions.setUser, (state, { user }): UserInterface.IInitialState => ({ ...state, user })),
)