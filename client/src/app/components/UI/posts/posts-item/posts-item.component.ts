import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserRepository } from '../../../../models/user.repository';
import { Post } from '../../../../models/post.model';
import { User } from '../../../../models/user.model';
import { Observable, filter, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { LocationArea, LocationRegion } from '@models/location.model';
import { selectLocationArea, selectLocationRegion } from '@store/location/location.selectors';

@Component({
  selector: 'app-posts-item',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: UserRepository },
  ],
  templateUrl: './posts-item.component.html',
  styleUrl: './posts-item.component.scss'
})
export class PostsItemComponent implements OnInit {
  @Input() post: Post | undefined;

  public user$: Observable<User | null> = of();
  public locationArea$: Observable<LocationArea[]> = this.store.select(selectLocationArea as never);
  public locationRegion$: Observable<LocationRegion[]> = this.store.select(selectLocationRegion as never);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly store: Store
  ) { }

  ngOnInit(): void {
    console.log(this.post);
    if (!this.post?.owner) return;
    this.user$ = this.getUserById(this.post.owner);
    this.user$.subscribe(console.log)
  }

  public getUserById(id: string): Observable<User | null> {
    return this.userRepository.getUser(id)
  }

  public getAreaById(id: string): Observable<LocationArea | undefined> {
    return new Observable((subscriber) => {
      this.locationArea$.subscribe((areaArr: LocationArea[]) => {
        subscriber.next(areaArr.find(a => a._id === id));
        subscriber.complete();  
      })
    })
  }

  public getRegionById(id: string): Observable<LocationRegion | undefined> {
    return new Observable((subscriber) => {
      this.locationRegion$.subscribe((regionArr: LocationRegion[]) => {
        subscriber.next(regionArr.find(r => r._id === id));
        subscriber.complete();  
      })
    })
  }
}
