import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { ConfigService } from '@nestjs/config';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  // app.use(csurf);
  await app.listen(configService.get('PORT') ?? config.get('PORT'), '0.0.0.0');
}
bootstrap();
