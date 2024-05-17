import { FormControl } from '@angular/forms';
import { ShortLocation } from './location.model';

export class User {
  constructor(
    public _id: string,
    public email: string,
    public phone: string,
    public first_name: string,
    public last_name: string,
    public avatar: UserAvatar,
    public rating: number,
    public roles: string[],
    public posts: string[],
    public favorites: string[],
    public location: ShortLocation,
    public registration_date: number,
  ) {}
}

export class UserAvatar {
  constructor(
    public id: string,
    public link: string,
  ) {}
}

export class UserAvatarFormGroup {
  constructor(
    public id: FormControl<string>,
    public link: FormControl<string>,
  ) {}
}