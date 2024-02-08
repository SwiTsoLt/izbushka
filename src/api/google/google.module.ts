import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { MyJwtService } from '../../services/jwt/jwt.service';

@Module({
  controllers: [GoogleController],
  providers: [GoogleService, MyJwtService],
})
export class GoogleModule {}
