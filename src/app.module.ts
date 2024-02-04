import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ErrorHandlerService } from './services/error-handler/error-handler.service';
import { MyJwtService } from './services/jwt/jwt.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiModule } from './api/api.module';

const rootPath = join(__dirname, '..', 'client', 'dist', 'client', 'browser');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['assets/.env', 'assets/.env.development'],
    }),
    MongooseModule.forRoot(new ConfigService().get<string>('MONGO_URI')),
    ServeStaticModule.forRoot({ rootPath }),
    JwtModule.register({
      global: true,
      secret: new ConfigService().get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
    MulterModule.register({
      storage: memoryStorage(),
    }),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService, ErrorHandlerService, MyJwtService],
})
export class AppModule {}
