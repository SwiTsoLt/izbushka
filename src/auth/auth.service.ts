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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
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

    const payload = { sub: candidate._id };
    return { access_token: await this.generateAccessToken(payload) };
  }

  async signUp(signUpDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(signUpDTO.password, salt);
    const user = new this.userModel({
      ...signUpDTO,
      password: passwordHash,
      roles: ['USER'],
      registration_date: Date.now(),
    });
    await user.save();

    const payload = { sub: user._id };

    return {
      access_token: await this.generateAccessToken(payload),
    };
  }

  private generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
