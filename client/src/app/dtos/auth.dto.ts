import { FormControl } from "@angular/forms";

// SignIn

export class SignInDTO {
    email?: string;
    password?: string;
}

export interface ISignInForm {
    email: FormControl<string>,
    password: FormControl<string>,
}

export interface IRawSignInFormValue {
    email?: string,
    password?: string,
}

export class SignInResponseDTO {
    access_token?: string
}

// SignUp

export class SignUpDTO {
    email?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
}

export interface ISignUpForm {
    email: FormControl<string>,
    first_name: FormControl<string>,
    last_name: FormControl<string>,
    password: FormControl<string>,
    confirm_password: FormControl<string>
}

export interface IRawSignUpFormValue {
    email?: string,
    first_name?: string,
    last_name?: string,
    password?: string,
    confirm_password?: string
}

export class SignUpResponseDTO {
    access_token?: string
}