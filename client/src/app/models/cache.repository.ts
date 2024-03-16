import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, map, zip } from "rxjs";
import { Post } from "./post.model";
import { deleteCacheKey, setCacheKey } from "@store/cache/cache.actions";
import { CachePrefixEnum } from "@store/cache/cache.interface";
import { selectCache } from "@store/cache/cache.selectors";
import { User } from "./user.model";
import { selectInfo } from "@store/info/info.selectors";
import { Info } from "./info.model";

@Injectable({
    providedIn: 'root',
  })
export class CacheRepository {
    private readonly PAGE_SIZE = 10;
    private readonly info$: Observable<Info> = this.store.select(selectInfo as never);

    constructor(
        private readonly store: Store,
    ) { }

    // Post

    public getPostsPage(page: number = 0): Observable<Post[]> {
        const cachePostsRecords$: Observable<Record<string, Post>> = this.store.select<Record<string, Post>>(selectCache({ prefix: CachePrefixEnum.post }) as never);
        const cachePostsArray$: Observable<Post[]> = cachePostsRecords$.pipe(map((cachePostsRecords: Record<string, Post>) => {
            const keys: string[] = Object.keys(cachePostsRecords);
            const result: Post[] = keys.reduce((acc: Post[], key: string) => [...acc, cachePostsRecords[key]], []);
            return result;
        }));
        const postsByPage$ = cachePostsArray$.pipe(
            map(posts =>
                posts.slice(
                    this.PAGE_SIZE * page,
                    this.PAGE_SIZE * page + this.PAGE_SIZE
                )
            )
        );
        return zip([
            postsByPage$,
            this.info$
        ]).pipe(
            map(([posts, info]) => {
                if (!info) return [];
                if (info.postsCount > posts.length && posts.length < 10) return [];
                return posts;
            })
        )
    }

    public getPostById(id: string): Observable<Post> {
        return this.store.select<Post>(selectCache({ prefix: CachePrefixEnum.post, key: id }) as never);
    }

    public setPost(post: Post): void {
        this.store.dispatch(setCacheKey({ prefix: CachePrefixEnum.post, key: post._id, value: post }))
    }

    public deletePostById(id: string): void {
        this.store.dispatch(deleteCacheKey({ prefix: CachePrefixEnum.post, key: id }))
    }

    // User

    public getUserById(id: string): Observable<User> {
        return this.store.select<User>(selectCache({ prefix: CachePrefixEnum.user, key: id }) as never);
    }

    public setUser(user: User) {
        this.store.dispatch(setCacheKey({ prefix: CachePrefixEnum.user, key: user._id, value: user }))
    }

    public deleteUserById(id: string) {
        this.store.dispatch(deleteCacheKey({ prefix: CachePrefixEnum.user, key: id }))
    }
}