import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Request } from 'express';
import { MyJwtService } from '../services/jwt/jwt.service';
import { type IJWTPayload } from '../interfaces/jwt.interface';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(MyJwtService) private readonly myJwtService: MyJwtService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesWhiteList = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rolesWhiteList) return true;

    const request: Request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;

    if (!auth) throw new UnauthorizedException();

    const { sub, roles } =
      await this.errorHandlerService.handleError<IJWTPayload>(
        this.myJwtService.decodeAuth(auth),
      );

    if (!sub || !roles) throw new UnauthorizedException();

    return this.matchRoles(rolesWhiteList, roles);
  }

  private matchRoles(roles: string[], userRoles: string[]): boolean {
    if (!userRoles.some((userRole) => !roles.includes(userRole))) {
      throw new ForbiddenException();
    }
    return true;
  }
}
