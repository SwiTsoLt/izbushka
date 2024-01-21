import { Component } from '@angular/core';
import { MyButtonComponent } from '../../UI/my-button/my-button.component';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignUpService } from './signup.service';
import { ISignUpForm } from '../../../dtos/auth.dto';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MyButtonComponent, RouterModule, ReactiveFormsModule],
  providers: [
    { provide: SignUpService }
  ],
  templateUrl: './signup.component.html',
  styleUrl: '../signin/signin.component.scss'
})
export class SignUpComponent {

  constructor(
    private signUpService: SignUpService,
    private router: Router
  ) { }

  public isPasswordsEqual: boolean = false;

  public signUpForm: FormGroup<ISignUpForm> = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),
    first_name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1)
      ]
    }),
    last_name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1)
      ]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6)
      ]
    }),
    confirm_password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6)
      ]
    })
  });

  public checkIsPasswordsEqual(): void {
    const password = this.signUpForm.controls.password.value
    const confirm_password = this.signUpForm.controls.confirm_password.value
    this.isPasswordsEqual = password === confirm_password
  }

  public onSubmit(): void {
    this.signUpService.signUp(this.signUpForm.value).subscribe(data => {
      if (data) {
        window.localStorage.setItem('access_token', data.access_token ?? '');
        this.router.navigate(['/home']);
      }
    })
  }
}
