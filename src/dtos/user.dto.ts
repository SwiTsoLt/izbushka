import { Location } from '../models/location.model';
import { User } from '../schemas/user.schema';

export class GetUserByJWTResponse {
  user: User;
  access_token: string;
}

export class UpdateUserDTO {
  avatar: string;
  first_name: string;
  last_name: string;
  location: Location;
}
