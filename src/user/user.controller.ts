import { Controller, Get, Headers, Param, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { Response } from 'express';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/jwt')
  async getByJWT(
    @Headers('Authorization') auth: string,
    @Res() res: Response,
  ): Promise<Response<User>> {
    const { user, access_token } = await this.userService.getByJWT(auth);
    return res.setHeader('Authorization', 'Bearer ' + access_token).send(user);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    return this.userService.getById(id);
  }
}
