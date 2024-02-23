import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Observable, take } from 'rxjs';
import { CacheRepository } from './cache.repository';
import { UserService } from '@services/user.service';
import { Store } from '@ngrx/store';
import { selectUser } from '@store/user/user.selectors';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  private user$: Observable<User | null> = this.store.select(selectUser as never);

  constructor(
    private readonly cacheRepository: CacheRepository,
    private readonly userService: UserService,
    private readonly store: Store,
  ) { }

  public getUserById(id: string): Observable<User | null> {
    return new Observable<User | null>((subscriber) => {
      this.cacheRepository.getUserById(id).subscribe((cacheUser: User | null) => {
        if (cacheUser?._id) return subscriber.next(cacheUser);

        this.userService.getUserById(id).subscribe((user: User | null) => {
          if (user?._id) {
            this.cacheRepository.setUser(user);
            subscriber.next(user);
          }
        })
      });
    })
  }

  public toggleFavoritePost(postId: string): Observable<User | null> {
    return new Observable<User | null>((subscriber) => {
      this.user$.pipe(take(1)).subscribe((user: User | null) => {
        if (user?._id) {
          let favorites = user.favorites;

          if (favorites.includes(postId)) {
            favorites = favorites.filter(favorite => favorite !== postId);
          } else {
            favorites = [...favorites, postId];
          }

          this.userService.updateUser(user._id, { favorites }).subscribe((newUser: User | null) => {
            if (newUser?._id) {
              subscriber.next(newUser);
              subscriber.complete();
            }
          })
        } else {
          subscriber.next(null);
        }
      })
    })
  }
}
