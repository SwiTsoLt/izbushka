import { FormControl, FormGroup } from '@angular/forms';
import { ShortLocation } from './location.model';

export class PostImage {
  constructor(
    public id: string,
    public link: string,
  ) {}
}

export class Post {
  constructor(
    public _id: string,
    public title: string,
    public body: string,
    public images: PostImage[],
    public category: string,
    public owner: string,
    public location: ShortLocation,
    public price: number,
    public publishDate: number,
  ) {}
}

// From

export class PostLocationFormGroup {
  constructor(
    public area: FormControl<string>,
    public region: FormControl<string>,
  ) {}
}

export class PostForm {
  constructor(
    public title: FormControl<string>,
    public body: FormControl<string>,
    public price: FormControl<number | null>,
    public images: FormControl<FileList>,
    public category: FormControl<string>,
    public location: FormGroup<PostLocationFormGroup>,
  ) {}
}

export class RawPostForm {
  constructor(
    public title?: string,
    public body?: string,
    public price?: number | null,
    public images?: FileList,
    public category?: string,
    public location?: ShortLocation,
  ) {}
}
