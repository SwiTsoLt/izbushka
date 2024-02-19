import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Observable } from 'rxjs';
import { CacheRepository } from './cache.repository';
import { PostService } from '@services/post.service';

@Injectable()
export class PostRepository {
  constructor(
    private readonly cacheRepository: CacheRepository,
    private readonly postService: PostService,
  ) {}

  public getPage(page: number): Observable<Post[]> {
    return new Observable<Post[]>((subscriber) => {
      this.cacheRepository.getPostsPage(page).subscribe((cachePosts: Post[]) => {
        if (cachePosts.length) return subscriber.next(cachePosts);
        this.postService.getPage(page).subscribe(posts => {
          posts.forEach(post => this.cacheRepository.setPost(post));
          return subscriber.next(posts)
      })
      });
    })
  }

  public getPostById(id: string): Observable<Post | null> {
    return new Observable<Post | null>((subscriber) => {
      this.cacheRepository.getPostById(id).subscribe((cacheUser: Post | null) => {
        if (cacheUser) return subscriber.next(cacheUser);
        this.postService.getPostById(id).subscribe((post: Post | null) => {
          post && this.cacheRepository.setPost(post);
          return subscriber.next(post);
        })
      })
    })
  }
}
