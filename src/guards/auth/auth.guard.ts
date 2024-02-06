import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    if (!auth) throw new UnauthorizedException();
    const [type, token] = auth.split(' ');
    if (type !== 'Bearer') throw new UnauthorizedException();
    return this.jwtService
      .verifyAsync(token)
      .then((state) => {
        if (state) return true;
        throw new UnauthorizedException();
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
  }
}
