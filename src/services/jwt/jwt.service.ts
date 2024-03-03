import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type JWTPayload } from '../../models/jwt.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyJwtService extends JwtService {
  constructor() {
    super({
      global: true,
      secret: new ConfigService().get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    });
  }

  public async decodeAuth(auth: string): Promise<JWTPayload> {
    if (!auth) {
      throw new UnauthorizedException();
    }

    const [type, token] = auth.split(' ');

    if (type.toUpperCase() !== 'BEARER' || !token?.length) {
      throw new UnauthorizedException();
    }

    const { sub, roles } = await this.verifyAsync(token).catch((err) => {
      throw new UnauthorizedException(err);
    });

    if (!sub?.length || !roles.length) {
      throw new UnauthorizedException();
    }

    return { sub, roles };
  }
}
