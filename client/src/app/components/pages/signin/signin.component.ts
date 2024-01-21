import { Component } from '@angular/core';
import { MyButtonComponent } from '../../UI/my-button/my-button.component';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignInService } from './signin.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [MyButtonComponent, RouterModule, ReactiveFormsModule],
  providers: [
    { provide: SignInService }
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SignInComponent {

  constructor(
    private signInService: SignInService,
    private router: Router
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
    this.signInService.signIn(this.signInForm.value).subscribe(data => {
      if (data) {
        window.localStorage.setItem('access_token', data.access_token ?? '');
        this.router.navigate(['/home']);
      }
    })
  }
}
