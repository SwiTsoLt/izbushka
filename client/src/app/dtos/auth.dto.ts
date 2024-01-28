import { FormControl, FormGroup } from "@angular/forms";
import { SignUpLocation } from "@model/location.model";

// SignIn

export class SignInDTO {
    constructor(
        public email?: string,
        public password?: string,
    ) {}
}

export class SignInForm {
    constructor(
        public email: FormControl<string>,
        public password: FormControl<string>,
    ) {}
}

export class RawSignInFormValue {
    constructor(
        public email?: string,
        public password?: string,
    ) {}
}

export class SignInResponseDTO {
    constructor(
        public access_token: string
    ) {}
}

// SignUp

export class SignUpDTO {
    constructor(
        public email?: string,
        public first_name?: string,
        public last_name?: string,
        public location?: SignUpLocation,
        public password?: string,
        public confirm_password?: string
    ) { }
}

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
        public confirm_password: FormControl<string>
    ) {}
}

export class RawSignUpFormValue {
    constructor(
        public email?: string,
        public first_name?: string,
        public last_name?: string,
        public location?: SignUpLocation,
        public password?: string,
        public confirm_password?: string,
    ) { }
}

export class SignUpResponseDTO {
    constructor(
        public access_token: string
    ) {}
}