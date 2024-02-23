import { createReducer, on } from '@ngrx/store';
import * as userActions from './user.actions';
import { User } from '../../models/user.model';

export const userNode = 'user';

export const initialState: User = {
  _id: '',
  email: '',
  phone: '',
  first_name: '',
  last_name: '',
  roles: [],
  posts: [],
  favorites: [],
  avatar: '',
  rating: 0,
  location: {
    area: '',
    region: '',
  },
  registration_date: 0,
};

export const userReducer = createReducer(
  initialState,
  on(userActions.toggleFavoritePost, (state): User => state),
  on(userActions.toggleFavoritePostSuccess, (_state, { user }): User => user),
  on(userActions.toggleFavoritePostError, (state): User => state),
  on(userActions.getUserByAccessToken, (state): User => state),
  on(userActions.getUserByAccessTokenSuccess, (_state, { user }): User => user),
  on(userActions.getUserByAccessTokenError, (state): User => state),
  on(userActions.resetUser, (): User => initialState),
);
