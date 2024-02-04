import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "@services/user.service";
import { UserActionsEnum } from "./user.interface";
import { catchError, exhaustMap, map, of } from "rxjs";
import { User } from "@models/user.model";

@Injectable()
export class UserEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly userService: UserService
    ) { }

    getUserByAccessToken$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActionsEnum.getUserByAccessToken),
            exhaustMap(() => {
                if (!window.localStorage.getItem('access_token'))
                    return of({ type: UserActionsEnum.getUserByAccessTokenError });

                return this.userService.getUserByJWT().pipe(
                    map<User | null, { type: string, user: User | null }>((user: User | null) =>
                        ({ type: UserActionsEnum.getUserByAccessTokenSuccess, user })
                    ))
            }),
            catchError(() => of({ type: UserActionsEnum.getUserByAccessTokenError }))
        )
    })
}