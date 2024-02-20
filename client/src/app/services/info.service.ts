import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, map, takeLast } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Info } from '@models/info.model';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private httpService: HttpService) { }

  public getInfo(): Observable<Info | null> {
    return this.httpService
      .get<Info | null>('/api/info')
      .pipe(
        takeLast(1),
        map((response: HttpResponse<Info | null>) => {
          if (!response.body) return null;
          return response.body;
        }),
      );
  }
}
