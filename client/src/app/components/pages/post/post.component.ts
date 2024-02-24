import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarSpecialComponent } from '@MUI/mobile-navbar-special/mobile-navbar-special.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { UserCardComponent } from '@UI/user-card/user-card.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CacheRepository } from '@models/cache.repository';
import { Category } from '@models/category.model';
import { LocationArea, LocationRegion } from '@models/location.model';
import { Post } from '@models/post.model';
import { PostRepository } from '@models/post.repository';
import { User } from '@models/user.model';
import { UserRepository } from '@models/user.repository';
import { Store } from '@ngrx/store';
import { selectCategories } from '@store/category/category.selectors';
import { selectLocationArea, selectLocationRegion } from '@store/location/location.selectors';
import { toggleFavoritePost } from '@store/user/user.actions';
import { selectUser } from '@store/user/user.selectors';
import { Observable, map, of, take } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    MobileNavbarSpecialComponent,
    MobileMenuComponent,
    MobileContextMenuComponent,
    RouterModule,
    UserCardComponent,
  ],
  providers: [PostRepository, UserRepository, CacheRepository],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {

  public me$: Observable<User> = this.store.select(selectUser as never);
  public isPostFavorite$: Observable<boolean> = of(false);

  public post: Post | null = null;
  public user: User | null = null;
  public area: LocationArea | null = null;
  public region: LocationRegion | null = null;
  public categoryRoot: Category | null = null;
  public categoryChild: Category | null = null;

  private areaList$: Observable<LocationArea[]> = this.store.select(selectLocationArea as never)
  private regionList$: Observable<LocationRegion[]> = this.store.select(selectLocationRegion as never);
  private categoryList$: Observable<Category[]> = this.store.select(selectCategories as never);

  public currentImageIndex: number = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly store: Store,
  ) { }

  ngOnInit(): void {
    this.listenRouteParams();
    this.listenQueryParams();
  }

  public toggleFavoritePost(): void {
    this.me$.pipe(take(1)).subscribe((me: User) => {
      if (!me?._id) return (this.isPostFavorite$ = of(false));
      if (!this.post?._id) return;
      return this.store.dispatch(toggleFavoritePost({ postId: this.post._id }))
    })
  }

  private listenRouteParams(): void {
    this.route.params.subscribe(params => {
      const postId = params['id']
      this.initPost(postId);
    })
  }

  private initPost(postId: string): void {
    this.postRepository.getPostById(postId).subscribe(post => {
      this.post = post;

      this.me$.subscribe((me: User) => {
        if (!me?._id) return;
        if (!this.post?._id) return;
        this.isPostFavorite$ = of(me.favorites.includes(this.post._id));
      })

      this.initPostLocationArea();
      this.initPostLocationRegion();

      this.initPostCategoryRoot();
      this.initPostCategoryChild();

      this.initUser();
    })
  }

  private initUser(): void {
    if (!this.post?._id) return;

    this.userRepository.getUserById(this.post?.owner).subscribe((user: User) => {
      if (!user?._id) return;
      if (!this.post?._id) return;
      this.user = user;
    })
  }

  private listenQueryParams(): void {
    this.route.queryParams.subscribe(query => {
      this.currentImageIndex = parseInt(query['image'] ?? 0)
    })
  }

  private initPostLocationArea(): void {
    this.areaList$.pipe<LocationArea>(
      map<LocationArea[], LocationArea>((areaList: LocationArea[]): LocationArea =>
        areaList?.filter((area: LocationArea) => area._id === this.post?.location.area)[0]
      )
    ).subscribe((area: LocationArea) => {
      this.area = area;
    })
  }

  private initPostLocationRegion(): void {
    this.regionList$.pipe<LocationRegion>(
      map<LocationRegion[], LocationRegion>((regionList: LocationRegion[]): LocationRegion =>
        regionList?.filter((region: LocationRegion) => region._id === this.post?.location.region)[0]
      )
    ).subscribe((region: LocationRegion) => {
      this.region = region;
    })
  }

  private initPostCategoryRoot(): void {
    this.categoryList$.pipe<Category>(
      map<Category[], Category>((categoryList: Category[]): Category =>
        categoryList?.filter((category: Category) => category.children.includes(this.post?.category ?? ''))[0]
      )
    ).subscribe((category: Category) => {
      this.categoryRoot = category;
    })
  }

  private initPostCategoryChild(): void {
    this.categoryList$.pipe<Category>(
      map<Category[], Category>((categoryList: Category[]): Category =>
        categoryList?.filter((category: Category) => category._id === this.post?.category)[0]
      )
    ).subscribe((category: Category) => {
      this.categoryChild = category;
    })
  }
}
