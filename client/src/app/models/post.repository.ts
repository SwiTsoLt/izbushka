import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { StaticDataSource } from './static.datasource';
import { Observable, map } from 'rxjs';
import { PostService } from '@services/post.service';

@Injectable()
export class PostRepository {
  constructor(
    private readonly dataSource: StaticDataSource,
    private readonly postService: PostService,
  ) {}

  public getPage(page: number): Observable<Post[]> {
    return this.postService.getPage(page);
  }

  public getPosts(categoryID = null): Observable<Post[]> {
    return this.dataSource
      .getPosts()
      .pipe(map((posts) => posts.filter(this.isPostValid)))
      .pipe(
        map((posts) =>
          posts.filter((p: Post) => !categoryID || categoryID === p.category),
        ),
      );
  }

  public getPost(id: string): Observable<Post | undefined> {
    return this.dataSource.getPost(id).pipe(
      map((post: Post | undefined) => {
        if (!post) return undefined;
        if (!this.isPostValid(post)) return undefined;
        return post;
      }),
    );
  }

  // Private

  private isPostValid(post: Post): boolean {
    if (!post) return false;
    return Object.keys(post).every((key) => !!post[key as keyof Post]);
  }
}
