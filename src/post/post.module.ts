import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../schemas/post.schema';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';
import { MyJwtService } from '../services/jwt/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService, ErrorHandlerService, MyJwtService],
})
export class PostModule {}
