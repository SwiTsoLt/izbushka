import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { userNode, userReducer } from "./user.reducer";
import { isDevMode } from "@angular/core";
import { User } from "../../model/user.model";


export interface IState {
    [userNode]: User
}

export const reducers: ActionReducerMap<IState> = {
    [userNode]: userReducer
}

export const metaReducers: MetaReducer<IState>[] = !isDevMode() ? [] : []