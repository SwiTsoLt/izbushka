import { Injectable } from '@angular/core';
import { Observable, map, takeLast } from 'rxjs';
import { User } from '../models/user.model';
import { HttpService } from './http.service';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpService: HttpService) {}

  public getUserById(id: string): Observable<User | null> {
    return this.httpService.get<User>(`/api/user/${id}`).pipe(
      takeLast(1),
      map((response: HttpResponse<User | null>) => {
        return response.body;
      }),
    );
  }

  public getUserByJWT(): Observable<User | null> {
    return this.httpService.get<User>(`/api/user/jwt`).pipe(
      takeLast(1),
      map((response: HttpResponse<User | null>) => response.body),
    );
  }

  public updateUser(id: string, newUser: Record<string, unknown>) {
    return this.httpService.patch<User>(`/api/user/${id}`, newUser).pipe(
      takeLast(1),
      map((response: HttpResponse<User | null>) => {
        return response.body;
      })
    )
  }
}
