import { Component } from '@angular/core';
import { MyButtonComponent } from '../../UI/my-button/my-button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MyButtonComponent, RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: '../login/login.component.scss'
})
export class RegistrationComponent {

  public registration(event: SubmitEvent): void {
    event.preventDefault();
  }
}
