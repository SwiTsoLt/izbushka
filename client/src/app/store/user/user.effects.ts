import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '@services/user.service';
import { UserActionsEnum } from './user.interface';
import { catchError, of, switchMap } from 'rxjs';
import { User } from '@models/user.model';
import { CacheRepository } from '@models/cache.repository';

@Injectable()
export class UserEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService,
    private readonly cacheRepository: CacheRepository,
  ) { }

  getUserByAccessToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActionsEnum.getUserByAccessToken),
      switchMap(() => {
        if (!window.localStorage.getItem('access_token'))
          return of({ type: UserActionsEnum.getUserByAccessTokenError });

        return this.userService.getUserByJWT().pipe(
          switchMap((user: User | null) => {
            if (!user) return of ({ type: UserActionsEnum.getUserByAccessTokenError })
            this.cacheRepository.setUser(user);
            return of({ type: UserActionsEnum.getUserByAccessTokenSuccess, user })
          }))
      }),
      catchError(() => of({ type: UserActionsEnum.getUserByAccessTokenError })),
    );
  });
}
