import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request } from 'express';
import { type JWTPayload } from '../../models/jwt.model';
import { MyJwtService } from '../../services/jwt/jwt.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    @Inject(MyJwtService) private readonly myJwtService: MyJwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refId: string = request.params.id;

    const authHeaders: string = request.headers.authorization;
    if (!authHeaders) throw new UnauthorizedException();

    const payload: JWTPayload =
      await this.myJwtService.decodeAccessToken(authHeaders);
    const userId = payload.sub.toString();
    return refId === userId;
  }
}
