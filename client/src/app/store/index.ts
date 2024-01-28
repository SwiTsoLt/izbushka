import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { isDevMode } from "@angular/core";
import { User } from "@model/user.model";
import { categoriesNode, categoryReducer } from "./category/category.reducer";
import { userNode, userReducer } from "./user/user.reducer";
import { Category } from "@model/category.model";
import { UserEffects } from "./user/user.effects";
import { CategoryEffects } from "./category/category.effects";
import { locationNode, locationReducer } from "./location/location.reducer";
import { ILocations } from "./location/location.interface";
import { LocationEffects } from "./location/location.effects";
import { StoreEffects } from "./store.effects";


export interface IState {
    [userNode]: User,
    [categoriesNode]: Category[],
    [locationNode]: ILocations
}

export const reducers: ActionReducerMap<IState> = {
    [userNode]: userReducer,
    [categoriesNode]: categoryReducer,
    [locationNode]: locationReducer
}

export const metaReducers: MetaReducer<IState>[] = !isDevMode() ? [] : []

export const effects = [ StoreEffects, UserEffects, CategoryEffects, LocationEffects ]