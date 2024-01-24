import { Component } from '@angular/core';
import { MyButtonComponent } from '../my-button/my-button.component';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';
import { SearchButtonComponent } from '../search-button/search-button.component';
import { Router } from '@angular/router';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../model/user.model';
import { selectUser } from '../../../store/user/user.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MyButtonComponent, ProfileButtonComponent, SearchButtonComponent, NavbarMenuComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  public isNavbarMenuShow: boolean = false;
  public user$: Observable<User> = this.store.select(selectUser as never);

  constructor(
    private readonly router: Router,
    private readonly store: Store
  ) { }

  public redirectToSignIn(): void {
    this.router.navigate(['/signin']);
  }

  public redirectToCreatePost(): void {
    this.router.navigate(['/create-post']);
  }

  public toggleNavbarMenuShow(): void {
    this.isNavbarMenuShow = !this.isNavbarMenuShow;
  }
}
