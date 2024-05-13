import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Observable, take } from 'rxjs';
import { CacheRepository } from './cache.repository';
import { UserService } from '@services/user.service';
import { Store } from '@ngrx/store';
import { selectUser } from '@store/user/user.selectors';
import { setUser } from '@store/user/user.actions';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  private user$: Observable<User> = this.store.select(selectUser as never);

  constructor(
    private readonly cacheRepository: CacheRepository,
    private readonly userService: UserService,
    private readonly store: Store,
  ) { }

  public getUserById(id: string): Observable<User> {
    return new Observable<User>((subscriber) => {
      this.cacheRepository.getUserById(id).subscribe((cacheUser: User) => {
        if (cacheUser?._id) return subscriber.next(cacheUser);

        this.userService.getUserById(id).subscribe((user: User) => {
          if (user?._id) {
            this.cacheRepository.setUser(user);
            subscriber.next(user);
          }
        })
      });
    })
  }

  public updateUserByJWT(data: Record<string, unknown>): Observable<User> {
    return new Observable<User>((subscriber) => {
      this.userService.updateUserByJWT(data).subscribe((user: User) => {
        if (user._id) {
          this.store.dispatch(setUser({ user }));
          this.cacheRepository.setUser(user);

          user.posts.forEach(post => {
            this.cacheRepository.deletePostById(post);
          });

          subscriber.next(user);
        }
      });
    })
  }

  public toggleFavoritePost(postId: string): Observable<User> {
    return new Observable<User>((subscriber) => {
      this.user$.pipe(take(1)).subscribe((user: User) => {
        if (user?._id) {
          let favorites = user.favorites;

          if (favorites.includes(postId)) {
            favorites = favorites.filter(favorite => favorite !== postId);
          } else {
            favorites = [...favorites, postId];
          }

          this.userService.updateUser(user._id, { favorites }).subscribe((newUser: User) => {
            if (newUser?._id) {
              subscriber.next(newUser);
              subscriber.complete();
            }
          })
        }
      })
    })
  }
}
