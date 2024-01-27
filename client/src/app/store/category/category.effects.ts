import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CategoryService } from "@services/category.service";
import { CategoryActionsEnum } from "./category.interface";
import { catchError, exhaustMap, map, of } from "rxjs";


@Injectable()
export class CategoryEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly categoryService: CategoryService
    ) {}

    public getAll$ = createEffect(() => { return this.actions$.pipe(
        ofType(CategoryActionsEnum.getAllCategories),
        exhaustMap(() => this.categoryService.getAll().pipe(
            map(categories => ({ type: CategoryActionsEnum.getAllCategoriesSuccess, categories })),
            catchError(() => of({ type: CategoryActionsEnum.getAllCategoriesError }))
        ))
    ) })
}