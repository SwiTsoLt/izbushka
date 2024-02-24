import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { MyJwtService } from '../../services/jwt/jwt.service';
import { VerifyOwnerService } from '../../services/verify-owner/verify-owner.service';
import { Post, PostSchema } from '../../schemas/post.schema';
import { CacheService } from '../../services/cache/cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ErrorHandlerService,
    MyJwtService,
    VerifyOwnerService,
    CacheService,
  ],
})
export class UserModule {}
