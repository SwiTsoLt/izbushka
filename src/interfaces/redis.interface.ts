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
    const store = await redisStore({
      url: configService.get<string>('REDIS_URL'),
      // socket: {
      //   host: configService.get<string>('REDIS_HOST'),
      //   port: parseInt(configService.get<string>('REDIS_PORT')),
      //   tls: true,
      // },
      // username: configService.get<string>('REDIS_USER'),
    });
    return {
      store: () => store as unknown as CacheStore,
    };
  },
  inject: [ConfigService],
}