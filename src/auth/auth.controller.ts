import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInDTO,
  SignInResponseDTO,
  SignUpDTO,
  SignUpResponseDTO,
} from '../dtos/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async setIn(@Body() signInDTO: SignInDTO): Promise<SignInResponseDTO> {
    return this.authService.signIn(signInDTO);
  }

  @Post('/signup')
  async setUp(@Body() signUpDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    return this.authService.signUp(signUpDTO);
  }
}
