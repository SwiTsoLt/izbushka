import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '../models/jwt.model';

@Injectable()
export class MyJWTService extends JwtService {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  public async generateAccessToken(payload: JWTPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
