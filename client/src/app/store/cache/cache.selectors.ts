import { createSelector } from '@ngrx/store';
import { CachePrefixEnum } from './cache.interface';
import { Cache } from '@models/cache.model';

export interface AppState {
  cache: Cache
}

export const selectCache = (props: { prefix?: CachePrefixEnum, key?: string }) =>  createSelector(
  (state: AppState) => state,
  (state) => {
    if (!props.prefix) return state;
    if (!props.key) return state.cache[props.prefix];
    return state.cache[props.prefix][props.key];
  },
);