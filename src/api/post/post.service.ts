import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../../schemas/post.schema';
import { User } from '../../schemas/user.schema';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { type CreatePostDTO, type UpdatePostDTO } from '../../dtos/post.dto';
import { MyJwtService } from '../../services/jwt/jwt.service';
import { GoogleDriveService } from '../../services/google-drive/google-drive.service';
import { VerifyOwnerService } from '../../services/verify-owner/verify-owner.service';
import { rolesEnum } from '../../interfaces/roles.interface';
import { CacheService } from '../../services/cache/cache.service';
import { IPostImage } from '../../interfaces/post.interface';
import { IMultiSharpResult } from '../../interfaces/sharp.interface';
import { ISearchParams } from '../../interfaces/post.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly myJwtService: MyJwtService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly verifyOwnerService: VerifyOwnerService,
    private readonly cacheService: CacheService,
  ) {}

  private readonly PAGE_SIZE = 10;
  private readonly POST_PARENTS = ["1BZXHP1gQPnk9CwZPnwxBeqJ7EOIjIX2O"];

  // Get

  public async getPage(searchParams: ISearchParams): Promise<Post[]> {
    const page = Number(searchParams.page) || 0;
    
    const query = { };
    if (searchParams.text) {
      query['$text'] = { $search: searchParams.text ?? "" };
    }
    
    const posts = await this.errorHandlerService.handleError<Post[]>(
      this.postModel
        .find(query)
        .skip(this.PAGE_SIZE * page)
        .limit(this.PAGE_SIZE)
        .exec(),
    ).catch((err) => {
      console.error(err);
      return [];
    });
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

    if (!sub) {
      throw new UnauthorizedException();
    }

    await this.cacheService.deletePosts();
    await this.cacheService.deleteInfo();

    const promiseArr: Array<Promise<IPostImage>> = [];
    results.forEach(async (result) => {
      promiseArr.push(
        this.errorHandlerService.handleError<IPostImage>(
          this.googleDriveService.uploadFile({
            ...result,
            parents: this.POST_PARENTS,
          }),
        ),
      );
    });

    const publicLinkArr: IPostImage[] = await Promise.all(promiseArr);

    const postLocation = JSON.parse(
      createPostDTO.location as unknown as string,
    );

    const newPost = await this.errorHandlerService.handleError(
      new this.postModel({
        ...createPostDTO,
        images: publicLinkArr,
        location: {
          area: postLocation.area,
          region: postLocation.region,
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

  public async patch(
    id: Types.ObjectId,
    updatePostDTO: UpdatePostDTO,
    auth: string,
  ): Promise<Post> {
    await this.cacheService.deletePostById(id);

    const isPostOwnerVerified = await this.errorHandlerService.handleError(
      this.verifyOwnerService.verifyPostOwner(id, auth, rolesEnum.admin),
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
    await this.cacheService.deletePosts();
    await this.cacheService.deleteInfo();

    const isPostOwnerVerified = await this.errorHandlerService.handleError(
      this.verifyOwnerService.verifyPostOwner(id, auth, rolesEnum.admin),
    );
    if (!isPostOwnerVerified) throw new ForbiddenException();

    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException();

    await this.cacheService.deletePostById(post.owner);

    post.images.forEach(async (image: IPostImage) => {
      await this.googleDriveService.removeFileById(image.id);
    });

    await this.userModel.findByIdAndUpdate(post.owner, {
      $pull: {
        posts: post._id,
      },
    });

    return await this.errorHandlerService.handleError<Post>(
      this.postModel.findByIdAndDelete(id).exec(),
    );
  }
}
