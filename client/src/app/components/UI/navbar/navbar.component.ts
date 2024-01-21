import { Component } from '@angular/core';
import { MyButtonComponent } from '../my-button/my-button.component';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';
import { SearchButtonComponent } from '../search-button/search-button.component';
import { Router } from '@angular/router';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MyButtonComponent, ProfileButtonComponent, SearchButtonComponent, NavbarMenuComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    private router: Router
  ) { }

  public redirect_to_signin(): void {
    this.router.navigate(['/signin']);
  }
}
