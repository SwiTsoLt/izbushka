import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, map, of, take, zip } from 'rxjs';
import { User } from '@models/user.model';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '@UI/user-card/user-card.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { Store } from '@ngrx/store';
import { selectUser } from '@store/user/user.selectors';
import { UserRepository } from '@models/user.repository';
import { CacheRepository } from '@models/cache.repository';
import { Post } from '@models/post.model';
import { PostRepository } from '@models/post.repository';
import { PostsComponent } from '@UI/posts/posts.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    UserCardComponent,
    RouterModule,
    MobileContextMenuComponent,
    MobileMenuComponent,
    MobileNavbarComponent,
    PostsComponent,
  ],
  providers: [UserRepository, CacheRepository, PostRepository],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  public user$: Observable<User | null> = this.store.select(
    selectUser as never,
  );
  public posts$: Observable<Post[]> = of([]);
  public isMe$: Observable<boolean> = of(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    // User

    zip(
      this.route.paramMap.pipe(
        take(1),
        map((params) => {
          return params.get('id');
        }),
      ),
      this.user$.pipe(
        take(2),
        map((user) => user?._id),
      ),
    ).subscribe(([find_user_id, current_user_id]) => {
      if (!find_user_id) {
        this.router.navigate(['/']);
        return;
      }
      if (find_user_id === current_user_id) {
        this.isMe$ = of(true);
        return;
      }

      this.user$ = this.userRepository.getUserById(find_user_id);
    });

    // User Posts

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
