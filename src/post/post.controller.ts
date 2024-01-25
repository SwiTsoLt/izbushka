import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as MyPost } from '../schemas/post.schema';
import { Types } from 'mongoose';
import { CreatePostDTO, UpdatePostDTO } from '../dtos/post.dto';

@Controller('/api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Get

  @Get()
  public async getAll(): Promise<MyPost[]> {
    return this.postService.getAll();
  }

  @Get('/:id')
  public async getById(@Param('id') id: Types.ObjectId): Promise<MyPost> {
    return this.postService.getById(id);
  }

  // Post

  @Post()
  public async post(
    @Headers('Authorization') auth: string,
    @Body() createPostDTO: CreatePostDTO,
  ): Promise<MyPost> {
    return this.postService.post(auth, createPostDTO);
  }

  // Update

  @Put('/:id')
  public async update(
    @Param('id') id: Types.ObjectId,
    @Body() updatePostDTO: UpdatePostDTO,
  ) {
    return this.postService.update(id, updatePostDTO);
  }

  // Delete

  @Delete('/:id')
  public async delete(@Param('id') id: Types.ObjectId): Promise<MyPost> {
    return this.postService.delete(id);
  }
}
