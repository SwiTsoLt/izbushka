import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap } from "rxjs";
import { getUserByAccessToken } from "./user/user.actions";
import { getAllCategories } from "./category/category.actions";
import { getAllLocations } from "./location/location.actions";
import { StoreActionEnum } from "./store.interface";


@Injectable()
export class StoreEffects {
    constructor(
        private readonly actions$: Actions
    ) { }

    public getOptions$ = createEffect(() => { return this.actions$.pipe(
        ofType(StoreActionEnum.getOption),
        mergeMap(() => {
            const access_token = window.localStorage.getItem('access_token') ?? '';

            return [
                getUserByAccessToken({ access_token }),
                getAllCategories(),
                getAllLocations()
            ]
        })
    ) })
}