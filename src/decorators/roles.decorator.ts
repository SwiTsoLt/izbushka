import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';

export const Roles = (...roles: string[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(RolesGuard));
