import { Component, inject } from '@angular/core';
import { MyButtonComponent } from '../../UI/my-button/my-button.component';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISignUpForm } from '../../../dtos/auth.dto';
import { UserService } from '../../../services/user.service';
import { setUser } from '../../../store/user/user.actions';
import { Store } from '@ngrx/store';
import { User } from '../../../model/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MyButtonComponent, RouterModule, ReactiveFormsModule],
  providers: [UserService, AuthService],
  templateUrl: './signup.component.html',
  styleUrl: '../signin/signin.component.scss'
})
export class SignUpComponent {
  private readonly store: Store = inject(Store);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router
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
    this.authService.signUp(this.signUpForm.value).subscribe(data => {
      if (data && data.access_token) {
        window.localStorage.setItem('access_token', data.access_token ?? '');

        this.userService.getUserByJWT(data.access_token).subscribe((user: User | null) => {
          if (user) {
            this.store.dispatch(setUser({ user }));
          }
        })

        this.router.navigate(['/home']);
      }
    })
  }
}
