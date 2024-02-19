import { Injectable } from '@angular/core';
import { User } from './user.model';
import { StaticDataSource } from './static.datasource';
import { Observable } from 'rxjs';
import { CacheRepository } from './cache.repository';

@Injectable()
export class UserRepository {
  constructor(
    private readonly dataSource: StaticDataSource,
    private readonly cacheRepository: CacheRepository,
  ) {}

  public getUsers(): Observable<User[]> {
    return this.dataSource.getUsers();
  }

  public getUserById(id: string): Observable<User | null> {
    return this.cacheRepository.getUserById(id);
  }
}
