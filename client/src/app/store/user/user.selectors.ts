import { createSelector } from '@ngrx/store';
import { User } from '../../models/user.model';

export interface AppState {
  user: User;
}

export const selectUser = createSelector(
  (state: AppState) => state,
  (state): User => state.user,
);

export const selectUserFavorites = createSelector(
  (state: AppState) => state,
  (state) => state.user.favorites,
);
