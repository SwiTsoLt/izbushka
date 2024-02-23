import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  type GetUserByJWTResponse,
  type UpdateUserDTO,
} from '../../dtos/user.dto';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { MyJwtService } from '../../services/jwt/jwt.service';
import { VerifyOwnerService } from '../../services/verify-owner/verify-owner.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly myJwtService: MyJwtService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly verifyOwnerService: VerifyOwnerService,
  ) {}

  // Get

  public async getAll(): Promise<User[]> {
    return await this.errorHandlerService.handleError<User[]>(
      this.userModel.find().select('-password').exec(),
    );
  }

  public async getById(id: string): Promise<User> {
    return await this.errorHandlerService.handleError<User>(
      this.userModel.findById(id).select('-password').exec(),
    );
  }

  public async getByJWT(auth: string): Promise<GetUserByJWTResponse> {
    const { sub } = await this.myJwtService.decodeAuth(auth);

    if (!sub) {
      throw new UnauthorizedException();
    }

    const user = await this.errorHandlerService.handleError(
      this.userModel.findById(sub).select('-password').exec(),
    );
    const payload = { sub: user._id, roles: user.roles };
    const new_access_token = await this.myJwtService.signAsync(payload);

    return {
      user,
      access_token: new_access_token,
    };
  }

  // Patch

  public async update(
    id: Types.ObjectId,
    updateUserDTO: UpdateUserDTO,
    auth: string,
  ): Promise<User> {
    const isUserOwnerVerified = await this.errorHandlerService.handleError(
      this.verifyOwnerService.verifyUserOwner(id, auth),
    );
    if (!isUserOwnerVerified) throw new ForbiddenException();
    return await this.errorHandlerService.handleError<User>(
      this.userModel.findByIdAndUpdate(id, updateUserDTO, { new: true }).exec(),
    );
  }

  // Delete

  public async delete(id: Types.ObjectId, auth: string): Promise<User> {
    const isUserOwnerVerified = await this.errorHandlerService.handleError(
      this.verifyOwnerService.verifyUserOwner(id, auth),
    );
    if (!isUserOwnerVerified) throw new ForbiddenException();
    return await this.errorHandlerService.handleError(
      this.userModel.findByIdAndDelete(id).exec(),
    );
  }
}
