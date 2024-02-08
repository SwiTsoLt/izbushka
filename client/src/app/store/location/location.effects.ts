import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LocationActionsEnum } from './location.interface';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { LocationService } from '@services/location.service';

@Injectable()
export class LocationEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly locationService: LocationService,
  ) {}

  public getAll$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LocationActionsEnum.getAllLocations),
      exhaustMap(() =>
        this.locationService.getAll().pipe(
          map((locations) => ({
            type: LocationActionsEnum.getAllLocationsSuccess,
            locations,
          })),
          catchError(() =>
            of({ type: LocationActionsEnum.getAllLocationsError }),
          ),
        ),
      ),
    );
  });
}
