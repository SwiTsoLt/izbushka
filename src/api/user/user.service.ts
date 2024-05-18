import {
  BadRequestException,
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
import { ISharpResult } from '../../interfaces/sharp.interface';
import { GoogleDriveService } from '../../services/google-drive/google-drive.service';
import { IUserImage } from '../../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly myJwtService: MyJwtService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly verifyOwnerService: VerifyOwnerService,
    private readonly cacheService: CacheService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  private readonly AVATARS_PARENTS = ['1Y8u93OSNydgx2kMFQjk8zoS8BXaYfWel'];

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
    access_token: string,
    updateUserDTO: UpdateUserDTO,
    avatarFile: ISharpResult,
  ): Promise<User> {
    // Check Auth and get user data
    const { sub } = await this.myJwtService.decodeAuth(access_token);
    if (!sub) throw new UnauthorizedException();

    // Check Owner
    const isUserOwnerVerified = await this.errorHandlerService.handleError(
      this.verifyOwnerService.verifyUserOwner(
        sub,
        access_token,
        rolesEnum.admin,
      ),
    );
    if (!isUserOwnerVerified) throw new ForbiddenException();

    // Find User in Redis or in MongoDB
    let user: User | undefined = await this.errorHandlerService.handleError(
      this.cacheService.getUserById(sub.toString()),
    );

    if (!user) {
      user = await this.errorHandlerService
        .handleError(this.userModel.findById(sub))
        .catch((err) => {
          console.error(err);
          throw new BadRequestException();
        });
    }

    // Upload User Avatar and remove last
    const uploadAvatarResponse: IUserImage =
      await this.errorHandlerService.handleError<IUserImage>(
        this.googleDriveService.uploadFile({
          ...avatarFile,
          parents: this.AVATARS_PARENTS,
        }),
      );

    if (user.avatar?.id?.length) {
      this.errorHandlerService
        .handleError(this.googleDriveService.removeFileById(user.avatar.id))
        .catch(console.error);
    }

    // Clear User in Redis
    this.cacheService.deleteUserById(sub);

    // Update User in MongoDB and return
    return this.errorHandlerService.handleError(
      this.userModel
        .findByIdAndUpdate(
          sub,
          {
            first_name: updateUserDTO.first_name,
            last_name: updateUserDTO.last_name,
            avatar: uploadAvatarResponse,
            location: JSON.parse(updateUserDTO.location),
          },
          { new: true },
        )
        .select('-password')
        .exec(),
    );
  }

  public async patch(
    id: Types.ObjectId,
    updateUserDTO: UpdateUserDTO,
    access_token: string,
    avatarFile: ISharpResult,
  ): Promise<User> {
    // Check Owner
    const isUserOwnerVerified = await this.errorHandlerService.handleError(
      this.verifyOwnerService.verifyUserOwner(
        id,
        access_token,
        rolesEnum.admin,
      ),
    );
    if (!isUserOwnerVerified) throw new ForbiddenException();

    // Find User in Redis or in MongoDB
    let user: User | undefined = await this.errorHandlerService.handleError(
      this.cacheService.getUserById(id.toString()),
    );

    if (!user) {
      user = await this.errorHandlerService
        .handleError(this.userModel.findById(id))
        .catch((err) => {
          console.error(err);
          throw new BadRequestException();
        });
    }

    // Clear in cache
    this.cacheService.deleteUserById(id);

    // Upload User Avatar and remove last
    const uploadAvatarResponse: IUserImage =
      await this.errorHandlerService.handleError<IUserImage>(
        this.googleDriveService.uploadFile({
          ...avatarFile,
          parents: this.AVATARS_PARENTS,
        }),
      );

    if (user.avatar?.id?.length) {
      this.errorHandlerService
        .handleError(this.googleDriveService.removeFileById(user.avatar.id))
        .catch(console.error);
    }

    // Update user in MongoDB and return
    return this.errorHandlerService.handleError<User>(
      this.userModel
        .findByIdAndUpdate(
          id,
          {
            first_name: updateUserDTO.first_name,
            last_name: updateUserDTO.last_name,
            avatar: uploadAvatarResponse,
            location: JSON.parse(updateUserDTO.last_name),
          },
          { new: true },
        )
        .select('-password')
        .exec(),
    );
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
