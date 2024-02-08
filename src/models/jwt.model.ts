import { type Types } from 'mongoose';

export class JWTPayload {
  sub: Types.ObjectId;
  roles: string[];
}
