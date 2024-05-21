import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from '../../schemas/user.schema';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) protected readonly cacheManager: Cache) {}

  public getAll(): Promise<string[]> {
    return this.cacheManager.store.keys();
  }

  // User

  public async getUserById(id: string): Promise<User | undefined> {
    const candidate: User[] = await this.getByPattern<User>(`/api/user/${id}`);
    if (!candidate.length) return undefined;
    return candidate[0];
  }

  public deleteUsers(): Promise<void> {
    return this.deleteByPattern(/^(\/api\/user)/);
  }

  public deleteUserById(id: Types.ObjectId): Promise<void> {
    return this.deleteByPattern(`/api/user/${id}`);
  }

  // Post

  public deletePosts(): Promise<void> {
    return this.deleteByPattern(/^(\/api\/post)/);
  }

  public deletePostById(id: Types.ObjectId): Promise<void> {
    return this.deleteByPattern(`/api/post/${id}`);
  }

  // Location

  public deleteLocations(): Promise<void> {
    return this.deleteByPattern('/api/location');
  }

  public deleteLocationAreas(): Promise<void> {
    return this.deleteByPattern(/^(\/api\/location\/area)/);
  }

  public deleteLocationRegions(): Promise<void> {
    return this.deleteByPattern(/^(\/api\/location\/region)/);
  }

  public deleteLocationAreaById(id: Types.ObjectId): Promise<void> {
    return this.deleteByPattern(`/api/location/area/${id}`);
  }

  public deleteLocationRegionById(id: Types.ObjectId): Promise<void> {
    return this.deleteByPattern(`/api/location/region/${id}`);
  }

  // Category

  public deleteCategories(): Promise<void> {
    return this.deleteByPattern(/^(\/api\/category)/);
  }

  public deleteCategoryById(id: Types.ObjectId): Promise<void> {
    return this.deleteByPattern(`/api/category/${id}`);
  }

  // Info

  public deleteInfo(): Promise<void> {
    return this.deleteByPattern('/api/info');
  }

  // Other

  public async deleteByPattern(pattern: RegExp | string): Promise<void> {
    const keys = await this.getAll();
    const filteredKeys = keys.filter((key) => new RegExp(pattern).test(key));
    filteredKeys.forEach((key: string) => this.cacheManager.del(key));
  }

  public async getByPattern<T>(pattern: RegExp | string): Promise<T[]> {
    const keys = await this.getAll();
    const filteredKeys = keys.filter((key) => new RegExp(pattern).test(key));
    const results: T[] = [];
    filteredKeys.forEach(async (key: string) => {
      const value: T = await this.cacheManager.get<T>(key);
      results.push(value);
    });
    return results;
  }
}
