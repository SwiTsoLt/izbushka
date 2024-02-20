import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Observable } from 'rxjs';
import { CacheRepository } from './cache.repository';
import { UserService } from '@services/user.service';
import { initialState as initialUser } from '@store/user/user.reducer';

@Injectable()
export class UserRepository {
  constructor(
    private readonly cacheRepository: CacheRepository,
    private readonly userService: UserService,
  ) { }

  public getUserById(id: string): Observable<User | null> {
    return new Observable<User | null>((subscriber) => {
      this.cacheRepository.getUserById(id).subscribe((cacheUser: User | null) => {
        if (cacheUser?._id) return subscriber.next(cacheUser);
        
        this.userService.getUserById(id).subscribe((user: User | null) => {
          user && this.cacheRepository.setUser(user);
          subscriber.next(user);
        })
      });
    })
  }
}
