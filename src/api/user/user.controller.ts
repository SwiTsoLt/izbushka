import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { type User } from '../../schemas/user.schema';
import { Response } from 'express';
import { Types } from 'mongoose';
import { UpdateUserDTO } from 'src/dtos/user.dto';
import { rolesEnum } from '../../interfaces/roles.interface';
import { Roles } from '../../decorators/roles.decorator';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get

  @Get()
  @Roles(rolesEnum.moderator, rolesEnum.admin)
  public async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Get('/jwt')
  public async getByJWT(
    @Headers('Authorization') auth: string,
    @Res() res: Response,
  ): Promise<Response<User>> {
    const { user, access_token } = await this.userService.getByJWT(auth);
    return res.setHeader('Authorization', 'Bearer ' + access_token).send(user);
  }

  @Get(':id')
  public async getById(@Param('id') id: string): Promise<User> {
    return await this.userService.getById(id);
  }

  // Patch

  @Patch('/:id')
  public async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDTO);
  }

  // Delete

  @Delete('/:id')
  public async delete(@Param('id') id: Types.ObjectId): Promise<User> {
    return await this.userService.delete(id);
  }
}
