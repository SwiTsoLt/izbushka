import { Component } from '@angular/core';
import { MyInputComponent } from '../../UI/my-input/my-input.component';
import { MyButtonComponent } from '../../UI/my-button/my-button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MyInputComponent, MyButtonComponent, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public login(event: SubmitEvent): void {
    event.preventDefault();
  }
}
