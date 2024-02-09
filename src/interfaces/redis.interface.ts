import { CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export enum RedisKeys {
  category = 'CATEGORY',
}

export const RedisOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const env = process.env.NODE_ENV;

    let redisStoreOptions: unknown = {
      url: configService.get<string>('REDIS_URL'),
    };

    if (env === 'development') {
      redisStoreOptions = {
        socket: {
          host: configService.get<string>('REDIS_HOST'),
          port: parseInt(configService.get<string>('REDIS_PORT')),
        },
      };
    }

    const store = await redisStore(redisStoreOptions);
    return {
      store: () => store as unknown as CacheStore,
    };
  },
  inject: [ConfigService],
};
