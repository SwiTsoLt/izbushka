import { Component, OnInit } from '@angular/core';
import { CacheRepository } from '@models/cache.repository';
import { Post } from '@models/post.model';
import { PostRepository } from '@models/post.repository';
import { User } from '@models/user.model';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { Store } from '@ngrx/store';
import { selectUser } from '@store/user/user.selectors';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { PostsComponent } from '@UI/posts/posts.component';
import { map, Observable, of, zip } from 'rxjs';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [
    NavbarComponent,
    MobileNavbarComponent,
    MobileMenuComponent,
    MobileContextMenuComponent,
    PostsComponent
  ],
  providers: [PostRepository, CacheRepository],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss',
})
export class MyPostsComponent implements OnInit {

  public user$: Observable<User> = this.store.select(selectUser as never);
  public posts$: Observable<Post[]> = of([]);
  
  constructor(
    private readonly postRepository: PostRepository,
    private readonly store: Store
    ) {}

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user?.posts?.length) {
        const postList$: Observable<Post | null>[] = [];
        user.posts.forEach((postId) => {
          postList$.push(this.postRepository.getPostById(postId));
        })
        this.posts$ = zip(postList$).pipe(
          map((posts: (Post | null)[]) => {
            const filteredPosts: Post[] = posts.filter((post: Post | null) => !!post) as unknown as Post[];
            return filteredPosts;
          })
        )
      }
    })
  }
}
