import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { PostService } from "@services/post.service";
import { Observable, map } from "rxjs";
import { Post } from "./post.model";
import { setCacheKey } from "@store/cache/cache.actions";
import { CachePrefixEnum } from "@store/cache/cache.interface";
import { selectCache } from "@store/cache/cache.selectors";
import { User } from "./user.model";
import { UserService } from "@services/user.service";


@Injectable()
export class CacheRepository {
    constructor(
        private readonly store: Store,
        private readonly postService: PostService,
        private readonly userService: UserService,
    ) { }

    public getPostsPage(page: number = 0): Observable<Post[]> {
        const cachePostsRecords$: Observable<Record<string, Post>> = this.store.select<Record<string, Post>>(selectCache({ prefix: CachePrefixEnum.post }) as never);
        const cachePostsArray$: Observable<Post[]> = cachePostsRecords$.pipe(map((cachePostsRecords: Record<string, Post>) => {
            const keys: string[] = Object.keys(cachePostsRecords);
            const result: Post[] = keys.reduce((acc: Post[], key: string) => [...acc, cachePostsRecords[key]], []);
            return result;
        }))

        return new Observable<Post[]>((subscriber) => {
            cachePostsArray$.subscribe(cachePostsArray => {
                if (cachePostsArray.length) {
                    return subscriber.next(cachePostsArray);
                }

                return this.postService.getPage(page).subscribe(posts => {
                    posts.forEach(post => {
                        this.store.dispatch(setCacheKey({ prefix: CachePrefixEnum.post, key: post._id, value: post }));
                    });
                    return subscriber.next(posts)
                })
            })
        })
    }

    public getUserById(id: string): Observable<User | null> {
        const cacheUser$ = this.store.select<User>(selectCache({ prefix: CachePrefixEnum.user, key: id }) as never);
        
        return new Observable<User | null>((subscriber) => {
            cacheUser$.subscribe((cacheUser: User) => {
                if (cacheUser) {
                    return subscriber.next(cacheUser);
                }
                
                this.userService.getUserById(id).subscribe(user => {
                    if (!user) {
                        return subscriber.next(null);
                    }
                    
                    this.store.dispatch(setCacheKey({ prefix: CachePrefixEnum.user, key: id, value: user }));
                    return subscriber.next(user);
                })
            })
        })
    }
}