import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../../schemas/post.schema';
import { User } from '../../schemas/user.schema';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { type CreatePostDTO, type UpdatePostDTO } from '../../dtos/post.dto';
import { MyJwtService } from '../../services/jwt/jwt.service';
import { type IMultiSharpResult } from '../../pipes/multisharp.pipe';
import { GoogleDriveService } from '../../services/google-drive/google-drive.service';
import { VerifyOwnerService } from '../../services/verify-owner/verify-owner.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly myJwtService: MyJwtService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly verifyOwnerService: VerifyOwnerService,
  ) {}

  private readonly PAGE_SIZE = 10;
  private readonly POST_PARENTS = ['1BZXHP1gQPnk9CwZPnwxBeqJ7EOIjIX2O'];

  // Get

  public async getPage(page = 0): Promise<Post[]> {
    const posts = await this.errorHandlerService.handleError<Post[]>(
      this.postModel
        .find()
        .skip(this.PAGE_SIZE * page)
        .limit(this.PAGE_SIZE)
        .exec(),
    );
    return posts;
  }

  public async getById(id: Types.ObjectId): Promise<Post> {
    return await this.errorHandlerService.handleError<Post>(
      this.postModel.findById(id).exec(),
    );
  }

  // Post

  public async post(
    access_token: string,
    createPostDTO: CreatePostDTO,
    results: IMultiSharpResult[],
  ): Promise<Post> {
    const { sub } = await this.myJwtService.decodeAuth(access_token);

    const promiseArr: Array<Promise<string>> = [];
    results.forEach(async (result) => {
      promiseArr.push(
        this.errorHandlerService.handleError<string>(
          this.googleDriveService.uploadFile({
            ...result,
            parents: this.POST_PARENTS,
          }),
        ),
      );
    });

    const publicLinkArr: string[] = await Promise.all(promiseArr);

    const newPost = await this.errorHandlerService.handleError(
      new this.postModel({
        ...createPostDTO,
        images: publicLinkArr,
        location: {
          area: createPostDTO.location.area,
          region: createPostDTO.location.region,
        },
        category: createPostDTO.category,
        owner: sub,
        publishDate: Date.now(),
      }).save(),
    );

    await this.errorHandlerService.handleError<User>(
      this.userModel.findByIdAndUpdate(newPost.owner, {
        $push: { posts: newPost._id },
      }),
    );

    return newPost;
  }

  // Patch

  public async update(
    id: Types.ObjectId,
    updatePostDTO: UpdatePostDTO,
    auth: string,
  ): Promise<Post> {
    const isPostOwnerVerified = await this.errorHandlerService.handleError(
      this.verifyOwnerService.verifyPostOwner(id, auth),
    );
    if (!isPostOwnerVerified) throw new ForbiddenException();
    return await this.errorHandlerService.handleError<Post>(
      this.postModel
        .findByIdAndUpdate(id, {
          ...updatePostDTO,
          location: {
            area: updatePostDTO.location.area,
            region: updatePostDTO.location.region,
          },
          category: updatePostDTO.category,
        })
        .exec(),
    );
  }

  // Delete

  public async delete(id: Types.ObjectId, auth: string): Promise<Post> {
    const isPostOwnerVerified = await this.errorHandlerService.handleError(
      this.verifyOwnerService.verifyPostOwner(id, auth),
    );
    if (!isPostOwnerVerified) throw new ForbiddenException();
    return await this.errorHandlerService.handleError<Post>(
      this.postModel.findByIdAndDelete(id).exec(),
    );
  }
}
