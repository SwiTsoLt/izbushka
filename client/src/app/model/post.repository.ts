import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { StaticDataSource } from "./static.datasource";
import { Observable, map } from "rxjs";

@Injectable()
export class PostRepository {

    constructor(public dataSource: StaticDataSource) {}

    public getPosts(categoryID = -1): Observable<Post[]> {
        return this.dataSource.getPosts()
            .pipe(map(posts => posts.filter(this.isPostValid)))
            .pipe(map(posts => posts.filter((p: Post) => categoryID === -1 || categoryID === p.category)))
    }

    public getPost(id: string): Observable<Post | undefined> {
        return this.dataSource.getPost(id)
            .pipe(map((post: Post | undefined) => {
                if (!post) return undefined;
                if (!this.isPostValid(post)) return undefined;
                return post;
            }))
    }

    // Private

    private isPostValid(post: Post): boolean {
        if (!post) return false;
        return Object.keys(post).every(key => !!post[key as keyof Post])
    }
}