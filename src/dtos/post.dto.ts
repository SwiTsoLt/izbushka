import { type Types } from 'mongoose';
import { type ILocation } from '../interfaces/location.interface';

export class CreatePostDTO {
  title: string;
  body: string;
  images: string[];
  category: Types.ObjectId;
  location: ILocation;
  price: number;
}

export class UpdatePostDTO {
  title: string;
  body: string;
  images: string[];
  category: Types.ObjectId;
  location: ILocation;
  price: number;
}
