import { Component } from '@angular/core';
import { MyButtonComponent } from '../my-button/my-button.component';
import { MyInputComponent } from '../my-input/my-input.component';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';
import { SearchButtonComponent } from '../search-button/search-button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MyInputComponent, MyButtonComponent, ProfileButtonComponent, SearchButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
