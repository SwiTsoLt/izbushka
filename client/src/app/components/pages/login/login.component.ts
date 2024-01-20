import { Component } from '@angular/core';
import { MyButtonComponent } from '../../UI/my-button/my-button.component';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MyButtonComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public loginGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  public login(event: SubmitEvent): void {
    event.preventDefault();
  }
}
