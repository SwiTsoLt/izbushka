import { Category } from '@models/category.model';
import { createSelector } from '@ngrx/store';

export interface AppState {
  categories: Category[];
}

export const selectCategories = createSelector(
  (state: AppState) => state,
  (state) => state.categories,
);
