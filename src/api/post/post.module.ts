import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../../schemas/post.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { MyJwtService } from '../../services/jwt/jwt.service';
import { GoogleDriveService } from '../../services/google-drive/google-drive.service';
import { GoogleService } from '../google/google.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    ErrorHandlerService,
    MyJwtService,
    GoogleDriveService,
    GoogleService,
  ],
})
export class PostModule {}
