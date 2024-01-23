import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  SignInDTO,
  SignInResponseDTO,
  SignUpDTO,
  SignUpResponseDTO,
} from '../dtos/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { MyJWTService } from 'src/services/jwt.service';
import { JWTPayload } from 'src/models/jwt.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: MyJWTService,
  ) {}

  async signIn(signInDTO: SignInDTO): Promise<SignInResponseDTO> {
    const candidate = await this.userModel.findOne({ email: signInDTO.email });

    if (!candidate) {
      throw new NotFoundException();
    }

    const isMatch = await bcrypt.compare(
      signInDTO.password,
      candidate.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload: JWTPayload = { sub: candidate._id, roles: candidate.roles };
    return { access_token: await this.jwtService.generateAccessToken(payload) };
  }

  async signUp(signUpDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(signUpDTO.password, salt);
    const user = new this.userModel({
      ...signUpDTO,
      password: passwordHash,
      roles: ['USER'],
      posts: [],
      registration_date: Date.now(),
    });
    await user.save();

    const payload: JWTPayload = { sub: user._id, roles: user.roles };

    return {
      access_token: await this.jwtService.generateAccessToken(payload),
    };
  }
}
