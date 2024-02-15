import { Injectable } from '@nestjs/common';
import { MyJwtService } from '../jwt/jwt.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../../schemas/post.schema';

@Injectable()
export class VerifyOwnerService {
  constructor(
    private readonly myJwtService: MyJwtService,
    private readonly errorHandlerService: ErrorHandlerService,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  public verifyUserOwner(
    refId: Types.ObjectId,
    auth: string,
  ): Promise<boolean> {
    return this.verify(refId, auth);
  }

  public async verifyPostOwner(
    refId: Types.ObjectId,
    auth: string,
  ): Promise<boolean> {
    const postId = await this.errorHandlerService.handleError<Types.ObjectId>(
      this.postModel.findById<Types.ObjectId>(refId, '_id').exec(),
    );
    return this.verify(postId, auth);
  }

  // Private

  private async verify(refId: Types.ObjectId, auth: string) {
    if (!refId) return false;
    const access_token = auth.split(' ')[1];
    const { sub } = await this.errorHandlerService.handleError(
      this.myJwtService.decodeAccessToken(access_token),
    );
    return refId === sub;
  }
}
