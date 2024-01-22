import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) { }

  getUserById(id: string): Observable<User | null> {
    return this.httpService.get<User>(`/api/user/${id}`);
  }

  getUserByJWT(access_token: string): Observable<User | null> {
    const options = {
      'headers': {
        'Authorization': 'Bearer ' + access_token
      }
    }
    return this.httpService.get<User>(`/api/user/jwt`, options);
  }
}
