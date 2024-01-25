import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetUserByJWTResponse, UpdateUserDTO } from '../dtos/user.dto';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';
import { MyJwtService } from '../services/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly myJwtService: MyJwtService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  // Get

  public async getAll(): Promise<User[]> {
    return this.errorHandlerService.handleError<User[]>(
      this.userModel.find().select('-password').exec(),
    );
  }

  public async getById(id: string): Promise<User> {
    return this.errorHandlerService.handleError<User>(
      this.userModel.findById(id).select('-password').exec(),
    );
  }

  public async getByJWT(access_token: string): Promise<GetUserByJWTResponse> {
    const { sub } = await this.myJwtService.decodeAccessToken(access_token);

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

  // Update

  public async update(
    id: Types.ObjectId,
    updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    console.log(updateUserDTO);
    return this.errorHandlerService.handleError<User>(
      this.userModel.findByIdAndUpdate(id, updateUserDTO),
    );
  }

  // Delete

  public async delete(id: Types.ObjectId): Promise<User> {
    return this.errorHandlerService.handleError(
      this.userModel.findByIdAndDelete(id),
    );
  }
}
