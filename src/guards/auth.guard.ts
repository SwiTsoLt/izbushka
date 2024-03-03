import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MyJwtService } from '../services/jwt/jwt.service';
import { type Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(MyJwtService) private readonly myJwtService: MyJwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const auth: string = request.headers.authorization;
    if (!auth) throw new UnauthorizedException();

    await this.myJwtService.decodeAuth(auth);

    return true;
  }
}
