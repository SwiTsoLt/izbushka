import { type Types } from 'mongoose';
import { type Location } from '../models/location.model';

export class CreatePostDTO {
  title: string;
  body: string;
  images: string[];
  category: Types.ObjectId;
  location: Location;
  price: number;
}

export class UpdatePostDTO {
  title: string;
  body: string;
  images: string[];
  category: Types.ObjectId;
  location: Location;
  price: number;
}
