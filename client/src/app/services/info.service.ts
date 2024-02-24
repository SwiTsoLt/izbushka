import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { Info } from '@models/info.model';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  constructor(private httpService: HttpService) { }

  public getInfo(): Observable<Info> {
    return this.httpService.get('/api/info')
  }
}
