// SignIn

import { ShortLocation } from '@models/location.model';

export class SignInDTO {
  constructor(public email?: string, public password?: string) {}
}

export class SignInResponseDTO {
  constructor(public access_token: string) {}
}

// SignUp

export class SignUpDTO {
  constructor(
    public email?: string,
    public first_name?: string,
    public last_name?: string,
    public location?: ShortLocation,
    public password?: string,
    public confirm_password?: string,
  ) {}
}

export class SignUpResponseDTO {
  constructor(public access_token: string) {}
}
