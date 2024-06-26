import { Component, OnInit } from '@angular/core';
import { Post } from 'models/post.model';
import { PostRepository } from 'models/post.repository';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { PostsComponent } from '@UI/posts/posts.component';
import { Observable, map, of, zip } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserFavorites } from '@store/user/user.selectors';
import { CacheRepository } from '@models/cache.repository';
import { MobileNavbarSpecialComponent } from '@MUI/mobile-navbar-special/mobile-navbar-special.component';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [
    NavbarComponent,
    MobileMenuComponent,
    MobileNavbarSpecialComponent,
    PostsComponent,
    MobileContextMenuComponent,
  ],
  providers: [{ provide: PostRepository }, { provide: CacheRepository }],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent implements OnInit {

  public favorites$: Observable<string[]> = this.store.select(selectUserFavorites as never);
  public posts$: Observable<Post[]> = of([]);

  constructor(
    private readonly postRepository: PostRepository,
    private readonly store: Store
  ) { }

  ngOnInit(): void {
    this.favorites$.subscribe(favorites => {
      if (favorites?.length) {
        const postList$: Observable<Post>[] = [];
        favorites.forEach((postId) => {
          postList$.push(this.postRepository.getPostById(postId));
        })
        
        this.posts$ = zip(postList$).pipe(
          map((posts: Post[]) => posts.filter((post: Post | null) => !!post))
        )
      }
    })
  }
}
