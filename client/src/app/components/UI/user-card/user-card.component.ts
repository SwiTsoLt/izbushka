import { Component, Input, OnInit } from '@angular/core';
import { User } from 'models/user.model';
import { RouterModule } from '@angular/router';
import { Location, LocationArea, LocationRegion } from '@models/location.model';
import { Store } from '@ngrx/store';
import { Observable, map, of, zip } from 'rxjs';
import { selectLocationArea, selectLocationRegion } from '@store/location/location.selectors';
import { CommonModule } from '@angular/common';
import { selectUser } from '@store/user/user.selectors';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent implements OnInit {

  @Input() user: User | null = null;

  public location$: Observable<Location | undefined> = of()
  public readonly current_user$: Observable<User> = this.store.select(selectUser as never);
  
  private readonly areaList$: Observable<LocationArea[]> = this.store.select(selectLocationArea as never);
  private readonly regionList$: Observable<LocationRegion[]> = this.store.select(selectLocationRegion as never);

  constructor(private readonly store: Store) { }

  ngOnInit(): void {
    zip([this.areaList$, this.regionList$])
      .pipe(
        map(([areaList, regionList]) => {
          const userArea = areaList.find(area => area._id === this.user?.location.area);
          const userRegion = regionList.find(region => region._id === this.user?.location.region);
          if (!userArea || !userRegion) return undefined;
          return { area: userArea, region: userRegion }
        })
      ).subscribe(location => {
        this.location$ = of(location)
      })
  }
}
