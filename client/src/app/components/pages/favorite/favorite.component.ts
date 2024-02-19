import { Component, OnInit } from '@angular/core';
import { Post } from 'models/post.model';
import { PostRepository } from 'models/post.repository';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { PostsComponent } from '@UI/posts/posts.component';
import { Observable, map, of, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '@store/user/user.selectors';
import { User } from '@models/user.model';
import { CacheRepository } from '@models/cache.repository';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [
    NavbarComponent,
    MobileMenuComponent,
    MobileNavbarComponent,
    PostsComponent,
    MobileContextMenuComponent,
  ],
  providers: [{ provide: PostRepository }, { provide: CacheRepository }],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent implements OnInit {

  public user$: Observable<User> = this.store.select(selectUser as never);
  public posts$: Observable<Post[]> = of([]);

  constructor(
    private readonly postRepository: PostRepository,
    private readonly store: Store
  ) { }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user?.favorites?.length) {
        const postList$: Observable<Post | null>[] = [];
        user.favorites.forEach((postId) => {
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
