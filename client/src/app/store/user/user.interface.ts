// Actions

import { User } from "../../model/user.model";

export enum UserActionsEnum {
    setUser = '[App Component] Set User'
}

// Reducers

export interface IInitialState {
    user: User | null
}