import { Injectable } from '@angular/core';
import { Post, PostSearchParams } from './post.model';
import { Observable } from 'rxjs';
import { CacheRepository } from './cache.repository';
import { PostService } from '@services/post.service';

@Injectable({
  providedIn: 'root',
})
export class PostRepository {
  constructor(
    private readonly cacheRepository: CacheRepository,
    private readonly postService: PostService,
  ) {}

  public getPage(searchParams?: PostSearchParams): Observable<Post[]> {
    return new Observable<Post[]>((subscriber) => {
      // this.cacheRepository
      //   .getPostsPage(+searchParams.page)
      //   .subscribe((cachePosts: Post[]) => {
      //     if (cachePosts.length) return subscriber.next(cachePosts);
      //     this.postService.getPage(searchParams).subscribe((posts) => {
      //       posts.forEach((post) => this.cacheRepository.setPost(post));
      //       return subscriber.next(posts);
      //     });
      //   });
      this.postService.getPage(searchParams).subscribe((posts) => {
        posts.forEach((post) => this.cacheRepository.setPost(post));
        return subscriber.next(posts);
      });
    });
  }

  public getPostById(id: string): Observable<Post> {
    return new Observable<Post>((subscriber) => {
      this.cacheRepository.getPostById(id).subscribe((cacheUser: Post) => {
        if (cacheUser) return subscriber.next(cacheUser);
        this.postService.getPostById(id).subscribe((post: Post) => {
          post && this.cacheRepository.setPost(post);
          return subscriber.next(post);
        });
      });
    });
  }
}
