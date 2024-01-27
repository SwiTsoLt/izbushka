import { Types } from 'mongoose';

export class PostCategoryDTO {
  name: string;
  children: Types.ObjectId[];
  parent: Types.ObjectId;
}

export class UpdateCategoryDTO {
  name: string;
  children: Types.ObjectId[];
  parent: Types.ObjectId;
}
