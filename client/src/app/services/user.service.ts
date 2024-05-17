import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService) {}

  public getUserById(id: string): Observable<User> {
    return this.httpService.get(`/api/user/${id}`);
  }

  public getUserByJWT(): Observable<User> {
    return this.httpService.get(`/api/user/jwt`);
  }

  public updateUserById(id: string, newUser: FormData): Observable<User> {
    return this.httpService.patch(`/api/user/${id}`, newUser, {
      reportProgress: true,
    });
  }

  public updateUserByJWT(newUser: FormData): Observable<User> {
    return this.httpService.patch('/api/user/jwt', newUser, {
      reportProgress: true,
    });
  }
}
