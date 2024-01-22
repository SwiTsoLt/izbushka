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
}
