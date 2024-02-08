import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MyJwtService } from '../../services/jwt/jwt.service';
import { type Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(MyJwtService) private readonly myJwtService: MyJwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authHeaders: string = request.headers.authorization;
    if (!authHeaders) throw new UnauthorizedException();

    await this.myJwtService.decodeAccessToken(authHeaders).catch(() => {
      throw new UnauthorizedException();
    });

    return true;
  }
}
