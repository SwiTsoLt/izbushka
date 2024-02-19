import { createReducer, on } from '@ngrx/store';
import * as cacheActions from './cache.actions';
import { Cache } from '@models/cache.model';

export const cacheNode = 'cache';

export const initialState: Cache = {
  user: {},
  post: {},
};

export const cacheReducer = createReducer(
  initialState,
  on(cacheActions.setCacheKey, (state, { prefix, key, value }): Cache => {
    state[prefix][key] = value;
    return state;
  }),
  on(cacheActions.deleteCacheKey, (state, { prefix, key }): Cache => {
    delete state[prefix][key];
    return state;
  }),
  on(cacheActions.resetCachePrefix, (state, { prefix }): Cache => {
    delete state[prefix];
    return state;
  }),
  on(cacheActions.resetCacheAll, (): Cache => ({ user: {}, post: {} })),
);
