import { Component, inject } from '@angular/core';
import { MyButtonComponent } from '../../UI/my-button/my-button.component';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { setUser } from '../../../store/user/user.actions';
import { Store } from '@ngrx/store';
import { User } from '../../../model/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [MyButtonComponent, RouterModule, ReactiveFormsModule],
  providers: [UserService, AuthService],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SignInComponent {
  private readonly store: Store = inject(Store);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router
    ) {}

  public signInForm = new FormGroup({
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
