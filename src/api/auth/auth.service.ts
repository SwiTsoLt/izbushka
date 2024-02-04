import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  SignInDTO,
  SignInResponseDTO,
  SignUpDTO,
  SignUpResponseDTO,
} from '../../dtos/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JWTPayload } from '../../models/jwt.model';
import { JwtService } from '@nestjs/jwt';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async signIn(signInDTO: SignInDTO): Promise<SignInResponseDTO> {
    const candidate = await this.errorHandlerService.handleError(
      this.userModel.findOne({ email: signInDTO.email }).exec(),
    );

    const isMatch = await bcrypt.compare(
      signInDTO.password,
      candidate.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload: JWTPayload = { sub: candidate._id, roles: candidate.roles };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async signUp(signUpDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(signUpDTO.password, salt);

    const user = new this.userModel({
      ...signUpDTO,
      location: {
        area: new Types.ObjectId(signUpDTO.location.area),
        region: new Types.ObjectId(signUpDTO.location.region),
      },
      password: passwordHash,
      roles: ['USER'],
      posts: [],
      registration_date: Date.now(),
    });
    await this.errorHandlerService.handleError<User>(user.save());

    const payload: JWTPayload = { sub: user._id, roles: user.roles };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}