// Actions

import { Post } from "@models/post.model";
import { User } from "@models/user.model";

export enum CacheActionsEnum {
  setKey = '[App Component] [Cache] Set Key',
  deleteKey = '[App Component] [Cache] Delete Key',
  resetPrefix = '[App Component] [Cache] Reset Prefix',
  resetAll = '[App Component] [Cache] Reset All',
}

export enum CachePrefixEnum {
  user = 'user',
  post = 'post',
}

export type CacheValueType = User | Post
