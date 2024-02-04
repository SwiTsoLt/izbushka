import { Component } from '@angular/core';
import { MyButtonComponent } from '@UI/my-button/my-button.component';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { getUserByAccessToken } from '@store/user/user.actions';
import { Store } from '@ngrx/store';
import { AuthService } from '@services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LocationArea, LocationRegion } from 'models/location.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { selectLocationArea, selectLocationRegion } from '@store/location/location.selectors';
import { SignUpForm, SignUpLocationFromGroup } from 'models/auth.model';
import { SignUpDTO } from '@dtos/auth.dto';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, MyButtonComponent, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  providers: [UserService, AuthService],
  templateUrl: './signup.component.html',
  styleUrl: '../signin/signin.component.scss'
})
export class SignUpComponent {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly store: Store,
  ) { }

  public areaList$: Observable<LocationArea[]> = this.store.select(selectLocationArea as never);
  public regionList$: Observable<LocationRegion[]> = this.store.select(selectLocationRegion as never);

  public isPasswordsEqual: boolean = false;

  public signUpForm: FormGroup<SignUpForm> = new FormGroup<SignUpForm>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),
    first_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1)
      ]
    }),
    last_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1)
      ]
    }),
    location: new FormGroup<SignUpLocationFromGroup>({
      area: new FormControl('', { nonNullable: true }),
      region: new FormControl('', { nonNullable: true }),
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6)
      ]
    }),
    confirm_password: new FormControl<string>('', {
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
    const rawSingUpForm: SignUpDTO = {
      ...this.signUpForm.value,
      location: this.signUpForm.value.location?.region
    }
    this.authService.signUp(rawSingUpForm).subscribe(data => {
      if (data && data.access_token) {
        window.localStorage.setItem('access_token', data.access_token ?? '');
        this.store.dispatch(getUserByAccessToken())
        this.router.navigate(['/home']);
      }
    })
  }
}
