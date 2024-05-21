import { type Types } from 'mongoose';

export interface IJWTPayload {
  sub: Types.ObjectId;
  roles: string[];
}
