import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { type Post as MyPost } from '../../schemas/post.schema';
import { Types } from 'mongoose';
import { CreatePostDTO, UpdatePostDTO } from '../../dtos/post.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  MultiSharpPipe,
  type IMultiSharpResult,
} from '../../pipes/multisharp.pipe';
import { Auth } from '../../decorators/auth.decorator';

@Controller('/api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Get

  @Get()
  public async getPage(@Query('page') page: number): Promise<MyPost[]> {
    return await this.postService.getPage(page);
  }

  @Get('/:id')
  public async getById(@Param('id') id: Types.ObjectId): Promise<MyPost> {
    return await this.postService.getById(id);
  }

  // Post

  @Post()
  @Auth()
  @UseInterceptors(AnyFilesInterceptor())
  public async post(
    @Headers('Authorization') auth: string,
    @Body() createPostDTO: CreatePostDTO,
    @UploadedFiles(MultiSharpPipe) results: IMultiSharpResult[],
  ): Promise<MyPost> {
    return await this.postService.post(auth, createPostDTO, results);
  }

  // Patch

  @Patch('/:id')
  public async update(
    @Param('id') id: Types.ObjectId,
    @Body() updatePostDTO: UpdatePostDTO,
  ) {
    return await this.postService.update(id, updatePostDTO);
  }

  // Delete

  @Delete('/:id')
  public async delete(@Param('id') id: Types.ObjectId): Promise<MyPost> {
    return await this.postService.delete(id);
  }
}
