import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';
import { CreatePostDTO, UpdatePostDTO } from 'src/dtos/post.dto';
import { MyJwtService } from '../services/jwt/jwt.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly myJwtService: MyJwtService,
  ) {}

  // Get

  public async getAll(): Promise<Post[]> {
    return this.errorHandlerService.handleError<Post[]>(
      this.postModel.find().exec(),
    );
  }

  public async getById(id: Types.ObjectId): Promise<Post> {
    return this.errorHandlerService.handleError<Post>(
      this.postModel.findById(id).exec(),
    );
  }

  // Post

  public async post(
    access_token: string,
    createPostDTO: CreatePostDTO,
  ): Promise<Post> {
    const { sub } = await this.myJwtService.decodeAccessToken(access_token);
    return this.errorHandlerService.handleError<Post>(
      new this.postModel({
        ...createPostDTO,
        category: new Types.ObjectId(createPostDTO.category),
        owner: new Types.ObjectId(sub),
        publishDate: Date.now(),
      }).save(),
    );
  }

  // Update

  public async update(
    id: Types.ObjectId,
    updatePostDTO: UpdatePostDTO,
  ): Promise<Post> {
    return this.errorHandlerService.handleError<Post>(
      this.postModel
        .findByIdAndUpdate(id, {
          ...updatePostDTO,
          category: new Types.ObjectId(updatePostDTO.category),
        })
        .exec(),
    );
  }

  // Delete

  public async delete(id: Types.ObjectId): Promise<Post> {
    return this.errorHandlerService.handleError<Post>(
      this.postModel.findByIdAndDelete(id).exec(),
    );
  }
}
