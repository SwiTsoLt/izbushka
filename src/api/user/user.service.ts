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
import { rolesEnum } from '../../interfaces/roles.interface';
import { CacheService } from '../../services/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly myJwtService: MyJwtService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly verifyOwnerService: VerifyOwnerService,
    private readonly cacheService: CacheService,
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

    const user = await this.userModel.findById(sub).select('-password').exec();

    const payload = { sub: user._id, roles: user.roles };

    return this.errorHandlerService
      .handleError(this.myJwtService.signAsync(payload))
      .then((new_access_token) => {
        return {
          user,
          access_token: new_access_token,
        };
      });
  }

  // Patch

  public async patchByJWT(
    auth: string,
    updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    delete updateUserDTO['password'];
    const { sub } = await this.myJwtService.decodeAuth(auth);

    if (!sub) {
      throw new UnauthorizedException();
    }

    return this.errorHandlerService.handleError(
      this.userModel
        .findByIdAndUpdate(sub, updateUserDTO, { new: true })
        .select('-password')
        .exec(),
    );
  }

  public async update(
    id: Types.ObjectId,
    updateUserDTO: UpdateUserDTO,
    auth: string,
  ): Promise<User> {
    delete updateUserDTO['password'];
    this.cacheService.deleteUserById(id);

    const isUserOwnerVerified = await this.errorHandlerService.handleError(
      this.verifyOwnerService.verifyUserOwner(id, auth, rolesEnum.admin),
    );
    if (!isUserOwnerVerified) throw new ForbiddenException();
    const user = await this.errorHandlerService.handleError<User>(
      this.userModel
        .findByIdAndUpdate(id, updateUserDTO, { new: true })
        .select('-password')
        .exec(),
    );

    user.posts.forEach((post) => {
      this.cacheService.deletePostById(post);
    });

    return user;
  }

  // Delete

  public async delete(id: Types.ObjectId, auth: string): Promise<User> {
    this.cacheService.deleteUserById(id);

    const isUserOwnerVerified = await this.errorHandlerService.handleError(
      this.verifyOwnerService.verifyUserOwner(id, auth, rolesEnum.admin),
    );
    if (!isUserOwnerVerified) throw new ForbiddenException();
    return await this.errorHandlerService.handleError(
      this.userModel.findByIdAndDelete(id).exec(),
    );
  }
}
