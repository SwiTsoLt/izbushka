import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { MyJwtService } from '../../services/jwt/jwt.service';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';

@Module({
  controllers: [GoogleController],
  providers: [GoogleService, MyJwtService, ErrorHandlerService],
})
export class GoogleModule {}
