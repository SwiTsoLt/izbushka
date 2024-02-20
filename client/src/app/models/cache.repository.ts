import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, map, zip } from "rxjs";
import { Post } from "./post.model";
import { setCacheKey } from "@store/cache/cache.actions";
import { CachePrefixEnum } from "@store/cache/cache.interface";
import { selectCache } from "@store/cache/cache.selectors";
import { User } from "./user.model";
import { selectInfo } from "@store/info/info.selectors";
import { Info } from "./info.model";

@Injectable()
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

    public getPostById(id: string): Observable<Post | null> {
        return this.store.select<Post | null>(selectCache({ prefix: CachePrefixEnum.post, key: id }) as never);
    }

    public setPost(post: Post) {
        this.store.dispatch(setCacheKey({ prefix: CachePrefixEnum.post, key: post._id, value: post }))
    }

    // User

    public getUserById(id: string): Observable<User | null> {
        return this.store.select<User | null>(selectCache({ prefix: CachePrefixEnum.user, key: id }) as never);
    }

    public setUser(user: User) {
        this.store.dispatch(setCacheKey({ prefix: CachePrefixEnum.user, key: user._id, value: user }))
    }
}