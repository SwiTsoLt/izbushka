import { User } from '../schemas/user.schema';

export class GetUserByJWTResponse {
  user: User;
  access_token: string;
}
