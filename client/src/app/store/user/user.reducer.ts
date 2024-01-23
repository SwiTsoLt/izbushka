import { createReducer, on } from "@ngrx/store";
import * as userActions from "./user.actions"
import { User } from "../../model/user.model";

export const userNode = "user"

export const initialState: User = {
    _id: '',
    email: '',
    phone: '',
    first_name: '',
    last_name: '',
    roles: [],
    posts: [],
    avatar: '',
    rating: 0,
    location: {
        areaID: '',
        regionID: '',
    },
    registration_date: 0
};

export const userReducer = createReducer(
    initialState,
    on(userActions.setUser, (state, { user }): User => ({ ...state, ...user })),
    on(userActions.resetUser, (): User => initialState),
)