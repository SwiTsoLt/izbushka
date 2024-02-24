import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, map, of, zip } from 'rxjs';
import { User } from '@models/user.model';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '@UI/user-card/user-card.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { Store } from '@ngrx/store';
import { selectUser } from '@store/user/user.selectors';
import { UserRepository } from '@models/user.repository';
import { CacheRepository } from '@models/cache.repository';
import { Post } from '@models/post.model';
import { PostRepository } from '@models/post.repository';
import { PostsComponent } from '@UI/posts/posts.component';
import { MobileNavbarSpecialComponent } from '@MUI/mobile-navbar-special/mobile-navbar-special.component';

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
    MobileNavbarSpecialComponent,
    PostsComponent,
  ],
  providers: [UserRepository, CacheRepository, PostRepository],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  public user$: Observable<User> = this.store.select(selectUser as never);
  public posts$: Observable<Post[]> = of([]);
  public isMe$: Observable<boolean> = of(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly store: Store,
  ) { }

  ngOnInit(): void {
    this.listenQueryParamsAndInitUser();
    this.initPosts();
  }

  private listenQueryParamsAndInitUser(): void {
    this.route.paramMap.pipe(map((params) => params.get('id'))).subscribe(find_user_id => {
      this.user$.pipe(map((user) => user?._id)).subscribe(userId => {
        if (!find_user_id) return this.router.navigate(['/']);
        if (find_user_id === userId) {
          this.isMe$ = of(true)
          return this.initPosts();
        }
        this.user$ = this.userRepository.getUserById(find_user_id);
        return this.initPosts();
      })
    });
  }

  private initPosts(): void {
    this.user$.subscribe(user => {
      if (!user?.posts?.length) return;

      const postList$: Observable<Post>[] = [];
      user.posts.forEach((postId) => {
        postList$.push(this.postRepository.getPostById(postId));
      })

      this.posts$ = zip(postList$).pipe(
        map((posts: Post[]) => posts.filter((post: Post) => !!post))
      )
    })
  }
}
