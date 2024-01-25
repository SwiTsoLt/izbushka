import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';
import { MyJwtService } from 'src/services/jwt/jwt.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, ErrorHandlerService, MyJwtService],
})
export class UserModule {}
