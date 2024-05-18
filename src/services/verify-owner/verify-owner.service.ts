import { Injectable } from '@nestjs/common';
import { MyJwtService } from '../jwt/jwt.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../../schemas/post.schema';
import { rolesEnum } from '../../interfaces/roles.interface';

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
    role?: rolesEnum,
  ): Promise<boolean> {
    return this.verify(refId, auth, role);
  }

  public async verifyPostOwner(
    refId: Types.ObjectId,
    auth: string,
    role?: rolesEnum,
  ): Promise<boolean> {
    const postId = await this.errorHandlerService.handleError<Types.ObjectId>(
      this.postModel.findById<Types.ObjectId>(refId, '_id').exec(),
    );

    return this.verify(postId, auth, role);
  }

  // Private

  private async verify(refId: Types.ObjectId, auth: string, role?: rolesEnum) {
    if (!refId || !role) return false;
    const { sub, roles } = await this.errorHandlerService.handleError(
      this.myJwtService.decodeAuth(auth),
    );
    if (roles.includes(role)) return true;
    return refId === sub;
  }
}
