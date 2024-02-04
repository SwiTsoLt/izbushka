import { createReducer, on } from "@ngrx/store";
import * as userActions from "./category.actions"
import { Category } from "@models/category.model";

export const categoriesNode = "categories";

export const initialState: Category[] = []

export const categoryReducer = createReducer(
    initialState,
    on(userActions.getAllCategories, (state): Category[] => state),
    on(userActions.getAllCategoriesSuccess, (_state, { categories }): Category[] => categories),
    on(userActions.getAllCategoriesError, (state): Category[] => state),
)