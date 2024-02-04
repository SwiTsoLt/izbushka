import { Component } from '@angular/core';
import { MyButtonComponent } from '@UI/my-button/my-button.component';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { getUserByAccessToken } from '@store/user/user.actions';
import { Store } from '@ngrx/store';
import { AuthService } from '@services/auth.service';
import { SignInForm } from 'models/auth.model';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [MyButtonComponent, RouterModule, ReactiveFormsModule],
  providers: [UserService, AuthService],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SignInComponent {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly store: Store
    ) {}

  public signInForm: FormGroup<SignInForm> = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
      ]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6)
      ]
    })
  });

  public onSubmit(): void {
    this.authService.signIn(this.signInForm.value).subscribe(data => {
      if (data && data.access_token) {
        window.localStorage.setItem('access_token', data.access_token ?? '');
        this.store.dispatch(getUserByAccessToken())
        this.router.navigate(['/home']);
      }
    })
  }
}
