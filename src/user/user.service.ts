import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { GetUserByJWTResponse } from '../dtos/user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  public async getAll(): Promise<User[]> {
    return this.userModel.find().select('-password');
  }

  public async getById(id: string): Promise<User> {
    return this.userModel.findById(id).select('-password');
  }

  public async getByJWT(access_token: string): Promise<GetUserByJWTResponse> {
    const [type, token] = access_token.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    const isTokenVerify = await this.jwtService
      .verifyAsync(token)
      .catch((err) => {
        throw new UnauthorizedException(err);
      });

    if (!isTokenVerify) {
      throw new UnauthorizedException();
    }

    const { sub } = this.jwtService.decode(token);

    if (!sub) {
      throw new UnauthorizedException();
    }

    const user = await this.userModel.findById(sub).select('-password');
    const payload = { sub: user._id, roles: user.roles };
    const new_access_token = await this.authService.generateAccessToken(
      payload,
    );

    return {
      user,
      access_token: new_access_token,
    };
  }
}
