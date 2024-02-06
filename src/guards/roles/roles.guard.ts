import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) return true;
    const request: Request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    if (!auth) throw new UnauthorizedException();
    const [type, token] = auth.split(' ');
    if (type !== 'Bearer') throw new UnauthorizedException();
    const isVerify = this.jwtService.verify(token);
    if (!isVerify) throw new UnauthorizedException();
    const tokenData = this.jwtService.decode(token);
    return this.matchRoles(roles, tokenData.roles);
  }

  private matchRoles(roles: string[], userRoles: string[]): boolean {
    if (!userRoles.every((userRole) => roles.indexOf(userRole) === -1))
      throw new ForbiddenException();
    return true;
  }
}
