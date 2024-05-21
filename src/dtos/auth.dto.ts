// SingIn

import { type ILocation } from '../interfaces/location.interface';

export class SignInDTO {
  email: string;
  password: string;
}

export class SignInResponseDTO {
  access_token: string;
}

// Sign up

export class SignUpDTO {
  email: string;
  first_name: string;
  last_name: string;
  location: ILocation;
  password: string;
}

export class SignUpResponseDTO {
  access_token: string;
}
