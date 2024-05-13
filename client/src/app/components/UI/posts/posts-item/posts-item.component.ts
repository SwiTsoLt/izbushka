import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserRepository } from '../../../../models/user.repository';
import { Post } from '../../../../models/post.model';
import { User } from '../../../../models/user.model';
import { Observable, ObservableInput, map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { LocationArea, LocationRegion } from '@models/location.model';
import {
  selectLocationArea,
  selectLocationRegion,
} from '@store/location/location.selectors';
import { CacheRepository } from '@models/cache.repository';
import { RouterModule } from '@angular/router';
import { toggleFavoritePost } from '@store/user/user.actions';
import { selectUser } from '@store/user/user.selectors';

@Component({
  selector: 'app-posts-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [UserRepository, CacheRepository],
  templateUrl: './posts-item.component.html',
  styleUrl: './posts-item.component.scss',
})
export class PostsItemComponent implements OnInit {
  @Input() post!: Post;

  public me$: Observable<User> = this.store.select(selectUser as never);
  public user$!: Observable<User>;
  public region$!: Observable<LocationRegion | undefined>;
  public area$!: Observable<LocationArea | undefined>;
  public isPostFavorite$: Observable<boolean> = of(false);

  private readonly locationArea$: Observable<LocationArea[]> =
    this.store.select(selectLocationArea as never);
  private readonly locationRegion$: Observable<LocationRegion[]> =
    this.store.select(selectLocationRegion as never);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.initPostIsFavorite();
    this.initUser();
    this.initLocation();
  }

  public toggleFavoritePost(): void {
    this.me$.pipe(take(1)).subscribe((me: User) => {
      if (!me || !this.post) return;
      this.store.dispatch(toggleFavoritePost({ postId: this.post._id }))
    })
  }

  private initUser(): void {
    this.user$ = this.userRepository.getUserById(this.post?.owner).pipe(take(1));
  }

  private initLocation(): void {
    this.area$ = this.locationArea$.pipe(
      switchMap((areaList: LocationArea[]): ObservableInput<LocationArea | undefined> => this.user$.pipe(
        map((user: User): LocationArea | undefined => areaList.find((area) => area._id === user.location.area))
      ))
    )

    this.region$ = this.locationRegion$.pipe(
      switchMap((areaList: LocationRegion[]): ObservableInput<LocationRegion | undefined> => this.user$.pipe(
        map((user: User): LocationRegion | undefined => areaList.find((area) => area._id === user.location.region))
      ))
    )
  }

  private initPostIsFavorite(): void {
    this.me$.subscribe((me: User) => {
      if (!me || !this.post) return;
      this.isPostFavorite$ = of(me.favorites.includes(this.post._id));
    })
  }
}
