import { type Types } from 'mongoose';

export interface ILocation {
  area: Types.ObjectId;
  region: Types.ObjectId;
}
