import { createAction, props } from '@ngrx/store';
import * as CacheInterface from './cache.interface';

export const setCacheKey = createAction(CacheInterface.CacheActionsEnum.setKey, props<{ prefix: CacheInterface.CachePrefixEnum, key: string, value: CacheInterface.CacheValueType }>());
export const deleteCacheKey = createAction(CacheInterface.CacheActionsEnum.deleteKey, props<{ prefix: CacheInterface.CachePrefixEnum, key: string }>());
export const resetCachePrefix = createAction(CacheInterface.CacheActionsEnum.resetPrefix, props<{ prefix: CacheInterface.CachePrefixEnum }>());
export const resetCacheAll = createAction(CacheInterface.CacheActionsEnum.resetAll);
