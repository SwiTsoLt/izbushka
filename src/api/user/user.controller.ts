import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { type User } from '../../schemas/user.schema';
import { Response } from 'express';
import { Types } from 'mongoose';
import { UpdateUserDTO } from '../../dtos/user.dto';
import { rolesEnum } from '../../interfaces/roles.interface';
import { Roles } from '../../decorators/roles.decorator';
import { Auth } from '../../decorators/auth.decorator';
import { SharpPipe } from 'src/pipes/sharp.pipe';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ISharpResult } from '../../interfaces/sharp.interface';

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
  @Auth()
  public async getByJWT(
    @Headers('Authorization') auth: string,
    @Res() res: Response,
  ) {
    const { user, access_token } = await this.userService.getByJWT(auth);
    return res.setHeader('Authorization', 'Bearer ' + access_token).send(user);
  }

  @Get(':id')
  public async getById(@Param('id') id: string): Promise<User> {
    return await this.userService.getById(id);
  }

  // Patch

  @Patch('/jwt')
  @Auth()
  @UseInterceptors(AnyFilesInterceptor())
  public async patchByJWT(
    @Headers('Authorization') auth: string,
    @Body() updateUserDTO: UpdateUserDTO,
    @UploadedFiles(SharpPipe) results: ISharpResult,
  ) {
    return await this.userService.patchByJWT(auth, updateUserDTO, results);
  }

  @Patch('/:id')
  @Auth()
  @UseInterceptors(AnyFilesInterceptor())
  public async patch(
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDTO: UpdateUserDTO,
    @Headers('Authorization') auth: string,
    @UploadedFiles(SharpPipe) results: ISharpResult,
  ) {
    return await this.userService.patch(id, updateUserDTO, auth, results);
  }

  // Delete

  @Delete('/:id')
  @Auth()
  public async delete(
    @Param('id') id: Types.ObjectId,
    @Headers('Authorization') auth: string,
  ) {
    return await this.userService.delete(id, auth);
  }
}
