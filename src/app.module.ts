import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiModule } from './api/api.module';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisOptions } from './interfaces/redis.interface';
import { HttpCacheInterceptor } from './interceptors/http-cache/http-cache.interceptor';
import { GoogleService } from './api/google/google.service';
import { CacheService } from './services/cache/cache.service';

const rootPath = join(__dirname, '..', 'client', 'dist', 'client', 'browser');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['assets/.env.development', 'assets/.env', '.env'],
    }),
    new Promise((res, rej) => {
      try {
        const module = MongooseModule.forRoot(
          new ConfigService().get<string>('MONGO_URI'),
          {
            retryDelay: 1000,
          },
        );
        res(module);
      } catch (error) {
        rej(error);
      }
    }),
    ServeStaticModule.forRoot({ rootPath }),
    JwtModule.register({
      global: true,
      secret: new ConfigService().get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    CacheModule.registerAsync(RedisOptions),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GoogleService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    CacheService,
  ],
})
export class AppModule {
  constructor(private readonly googleService: GoogleService) {
    const delay = 1000 * 60 * 45;

    setInterval(updateToken, delay);
    updateToken.bind(this)();
  }
}

function updateToken() {
  console.log('update token');
  this.googleService.updateToken().then(console.log).catch(console.error);
}