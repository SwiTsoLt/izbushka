import { createAction } from '@ngrx/store';
import { StoreActionEnum } from './store.interface';

export const getOptions = createAction(StoreActionEnum.getOption);
