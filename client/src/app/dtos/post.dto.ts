import { ShortLocation } from '@models/location.model';
import { PostImage } from '@models/post.model';

export class CreatePostDTO {
  constructor(
    public title?: string,
    public body?: string,
    public images?: FileList,
    public category?: string,
    public location?: ShortLocation,
    public price?: number | null,
  ) {}
}

export class UpdatePostDTO {
  constructor(
    public title?: string,
    public body?: string,
    public images?: PostImage[],
    public category?: string,
    public location?: ShortLocation,
    public price?: number,
  ) {}
}
