import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserRepository } from '../../../../models/user.repository';
import { Post } from '../../../../models/post.model';
import { User } from '../../../../models/user.model';
import { Observable, of, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { LocationArea, LocationRegion } from '@models/location.model';
import {
  selectLocationArea,
  selectLocationRegion,
} from '@store/location/location.selectors';
import { CacheRepository } from '@models/cache.repository';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-posts-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [UserRepository, CacheRepository],
  templateUrl: './posts-item.component.html',
  styleUrl: './posts-item.component.scss',
})
export class PostsItemComponent implements OnInit {
  @Input() post: Post | undefined;

  public user$: Observable<User | null> = of(null);
  public area$: Observable<LocationArea | null> = of(null);

  private readonly locationArea$: Observable<LocationArea[]> =
    this.store.select(selectLocationArea as never);
  private readonly locationRegion$: Observable<LocationRegion[]> =
    this.store.select(selectLocationRegion as never);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.initUser();
    this.initUserArea();
  }

  private initUser(): void {
    if (!this.post?.owner) return;
    this.user$ = this.userRepository.getUserById(this.post.owner).pipe(take(1))
  }

  private initUserArea(): void {
    this.user$.pipe(take(1)).subscribe((user: User | null) => {
      if (!user) return;
      this.locationArea$.subscribe((areaArr: LocationArea[]) => {
        const area = areaArr.find((area) => area._id === user.location.area) ?? null;
        this.area$ = of(area);
      });
    });
  }

  public get region$(): Observable<LocationRegion | null> {
    return new Observable((subscriber) => {
      this.user$.subscribe((user: User | null) => {
        this.locationRegion$.subscribe((regionArr: LocationRegion[]) => {
          subscriber.next(
            regionArr.find((r) => r._id === user?.location.region) ?? null,
          );
        });
      });
    });
  }
}
