import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { InfoActionsEnum } from './info.interface';
import { InfoService } from '@services/info.service';
import { Info } from '@models/info.model';

@Injectable()
export class InfoEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly infoService: InfoService,
  ) {}

  public getInfo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InfoActionsEnum.getInfo),
      exhaustMap(() =>
        this.infoService.getInfo().pipe(
          map((info: Info) => {
            if (!info) {
              return { type: InfoActionsEnum.getInfoError };
            }
            return { type: InfoActionsEnum.getInfoSuccess, info}
          }),
          catchError(() =>
            of({ type: InfoActionsEnum.getInfoError }),
          ),
        ),
      ),
    );
  });
}
