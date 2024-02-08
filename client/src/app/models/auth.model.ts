import { FormControl, FormGroup } from '@angular/forms';

// SignIn

export class SignInForm {
  constructor(
    public email: FormControl<string>,
    public password: FormControl<string>,
  ) {}
}

// SignUp

export class SignUpLocationFromGroup {
  constructor(
    public area: FormControl<string>,
    public region: FormControl<string>,
  ) {}
}

export class SignUpForm {
  constructor(
    public email: FormControl<string>,
    public first_name: FormControl<string>,
    public last_name: FormControl<string>,
    public location: FormGroup<SignUpLocationFromGroup>,
    public password: FormControl<string>,
    public confirm_password: FormControl<string>,
  ) {}
}
