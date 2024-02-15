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
import { MyJwtService } from 'src/services/jwt/jwt.service';
import { type JWTPayload } from 'src/models/jwt.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(MyJwtService) private readonly myJwtService: MyJwtService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;

    const request: Request = context.switchToHttp().getRequest();
    const authHeaders = request.headers.authorization;

    if (!authHeaders) throw new UnauthorizedException();

    const payload: JWTPayload =
      await this.myJwtService.decodeAccessToken(authHeaders);

    if (!payload?.sub) throw new UnauthorizedException();

    return this.matchRoles(roles, payload.roles);
  }

  private matchRoles(roles: string[], userRoles: string[]): boolean {
    if (!userRoles.some((userRole) => !roles.includes(userRole))) {
      throw new ForbiddenException();
    }
    return true;
  }
}
