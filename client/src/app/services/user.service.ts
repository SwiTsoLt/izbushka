import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.model';
import { HttpService } from './http.service';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) { }

  public getUserById(id: string): Observable<User | null> {
    return this.httpService.get<User>(`/api/user/${id}`).pipe(
      map((response: HttpResponse<User | null>) => response.body)
    );
  }

  public getUserByJWT(): Observable<User | null> {
    return this.httpService.get<User>(`/api/user/jwt`).pipe(
      map((response: HttpResponse<User | null>) => response.body)
    )
  }
}
