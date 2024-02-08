import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  public async decodeAccessToken(access_token: string): Promise<JWTPayload> {
    if (!access_token) {
      throw new UnauthorizedException();
    }

    const [type, token] = access_token.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    const isTokenVerify = await this.verifyAsync(token).catch((err) => {
      throw new HttpException(err, HttpStatus.UNAUTHORIZED);
    });

    if (!isTokenVerify) {
      throw new UnauthorizedException();
    }

    const payload = this.decode(token);
    return payload;
  }
}
