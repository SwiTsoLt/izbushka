import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    try {
      const request: Request = context.switchToHttp().getRequest();

      const isGetRequest = request.method === 'GET';
      const excludePaths = [
        'api/auth',
        '/api/user/jwt',
        '/api/google',
        '/api/google/callback',
      ];

      if (
        !isGetRequest ||
        (isGetRequest &&
          excludePaths.some((path) => request.path.includes(path)))
      ) {
        return undefined;
      }
      return request.url;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
