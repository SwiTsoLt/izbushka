import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, forkJoin, map, of, take } from 'rxjs';
import { User } from '@models/user.model';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '@UI/user-card/user-card.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { Store } from '@ngrx/store';
import { selectUser } from '@store/user/user.selectors';
import { CacheRepository } from '@models/cache.repository';

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
  ],
  providers: [{ provide: CacheRepository }],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  public user$: Observable<User | null> = this.store.select(
    selectUser as never,
  );
  public isMe$: Observable<boolean> = of(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cacheRepository: CacheRepository,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    forkJoin(
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

      this.user$ = this.cacheRepository.getUserById(find_user_id);
    });
  }
}
