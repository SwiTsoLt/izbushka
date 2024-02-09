import { CacheModuleAsyncOptions } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export enum RedisKeys {
  category = 'CATEGORY',
}

export const RedisOptions: CacheModuleAsyncOptions = {
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
      store: () => store,
    };
  },
  inject: [ConfigService],
}