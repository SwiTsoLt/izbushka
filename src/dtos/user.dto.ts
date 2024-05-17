import { type User } from '../schemas/user.schema';

export class GetUserByJWTResponse {
  user: User;
  access_token: string;
}

export class UserAvatar {
  id: string;
  link: string;
}

export class UpdateUserDTO {
  first_name: string;
  last_name: string;
  location: string;
}
