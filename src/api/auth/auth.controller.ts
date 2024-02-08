import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInDTO,
  type SignInResponseDTO,
  SignUpDTO,
  type SignUpResponseDTO,
} from '../../dtos/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async setIn(@Body() signInDTO: SignInDTO): Promise<SignInResponseDTO> {
    return await this.authService.signIn(signInDTO);
  }

  @Post('/signup')
  async setUp(@Body() signUpDTO: SignUpDTO): Promise<SignUpResponseDTO> {
    return await this.authService.signUp(signUpDTO);
  }
}
