import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "@services/user.service";
import { UserActionsEnum } from "./user.interface";
import { catchError, exhaustMap, map, of } from "rxjs";

@Injectable()
export class UserEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly userService: UserService
    ) { }

    getUserByAccessToken$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActionsEnum.getUserByAccessToken),
            exhaustMap((action: { access_token: string }) => this.userService.getUserByJWT(action.access_token).pipe(
                map((user) => ({ type: UserActionsEnum.getUserByAccessTokenSuccess, user }),
                    catchError(() => of({ type: UserActionsEnum.getUserByAccessTokenError }))
                ))
            ))
    })
}