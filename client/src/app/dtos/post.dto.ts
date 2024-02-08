import { ShortLocation } from '@models/location.model';

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
    public images?: string[],
    public category?: string,
    public location?: ShortLocation,
    public price?: number,
  ) {}
}
