import { createAction, props } from '@ngrx/store';
import * as CategoryInterface from './category.interface';
import { Category } from '@models/category.model';

export const getAllCategories = createAction(
  CategoryInterface.CategoryActionsEnum.getAllCategories,
);
export const getAllCategoriesSuccess = createAction(
  CategoryInterface.CategoryActionsEnum.getAllCategoriesSuccess,
  props<{ categories: Category[] }>(),
);
export const getAllCategoriesError = createAction(
  CategoryInterface.CategoryActionsEnum.getAllCategoriesError,
);
