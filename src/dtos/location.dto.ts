// Area

import { Types } from 'mongoose';

export class PostAreaDTO {
  name: string;
  children: Types.ObjectId[];
}

export class UpdateAreaDTO {
  name: string;
  children: Types.ObjectId[];
}

// Region

export class PostRegionDTO {
  name: string;
  parent: Types.ObjectId;
}

export class UpdateRegionDTO {
  name: string;
  parent: Types.ObjectId;
}
