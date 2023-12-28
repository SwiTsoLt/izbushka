import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { StaticDataSource } from "./static.datasource";

@Injectable()
export class PostRepository {
    private posts: Post[] = []

    constructor(dataSource: StaticDataSource) {
        dataSource.getPosts().subscribe(data => {
            this.posts = data
        })
    }

    public getPosts(categoryID = -1): Post[] {
        return this.posts
            .filter(p => categoryID === -1 || categoryID === p.categoryID)
    }

    public getPost(id: string): Post | undefined {
        return this.posts.find(p => p.id === id)
    }
}