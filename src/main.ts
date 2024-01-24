import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { ConfigService } from '@nestjs/config';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);
  app.enableCors();
  // app.use(csurf);
  await app.listen(configService.get('PORT') ?? config.get('PORT'));
}
bootstrap();
