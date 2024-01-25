import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { LocationModule } from './location/location.module';
import { CategoryModule } from './category/category.module';
import { ErrorHandlerService } from './services/error-handler/error-handler.service';
import { MyJwtService } from './services/jwt/jwt.service';

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
      envFilePath: ['assets/.env', 'assets/.env.development'],
    }),
    MongooseModule.forRoot(new ConfigService().get<string>('MONGO_URI')),
    ServeStaticModule.forRoot({ rootPath }),
    JwtModule.register({
      global: true,
      secret: new ConfigService().get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    UserModule,
    PostModule,
    LocationModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, ErrorHandlerService, MyJwtService],
})
export class AppModule {}
