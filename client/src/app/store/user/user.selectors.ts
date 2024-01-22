import { createSelector } from "@ngrx/store";
import { User } from "../../model/user.model";

export interface AppState {
    user: User
}

export const selectUser = createSelector(
    (state: AppState) => state,
    state => state.user
)