import { createFeatureSelector, createSelector } from "@ngrx/store";
import { userNode } from "./user.reducer";
import { User } from "../../model/user.model";


export interface IFeatureState {
    user: User,
}

export const selectUserFeature = createFeatureSelector<IFeatureState>(userNode)

export const selectUser = createSelector(
    selectUserFeature,
    (state: IFeatureState): User => state.user
)