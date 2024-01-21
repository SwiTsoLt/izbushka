import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

const rootPath = join(
  __dirname,
  '..',
  '..',
  'client',
  'dist',
  'client',
  'browser',
);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(
      new ConfigService().get<string>('database.mongoUri'),
    ),
    ServeStaticModule.forRoot({ rootPath }),
    JwtModule.register({
      global: true,
      secret: new ConfigService().get<string>('JWTSecret'),
      signOptions: { expiresIn: '60s' },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
