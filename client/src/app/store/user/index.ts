import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { userNode, userReducer } from "./user.reducer";
import { isDevMode } from "@angular/core";
import * as UserInterface from "./user.interface";


export interface IState {
    [userNode]: UserInterface.IInitialState
}

export const reducers: ActionReducerMap<IState> = {
    [userNode]: userReducer
}

export const metaReducers: MetaReducer<IState>[] = !isDevMode() ? [] : []