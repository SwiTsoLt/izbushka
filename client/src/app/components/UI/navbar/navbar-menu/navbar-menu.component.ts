import { Component, Input } from '@angular/core';
import { NavbarMenuLinkComponent } from './navbar-menu-link/navbar-menu-link.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { resetUser } from '../../../../store/user/user.actions';

interface IMenuLink {
  href: string
  iconName: string
  name: string
}

interface Menu {
  linkIconStaticPath: string,
  links: IMenuLink[]
}

@Component({
  selector: 'app-navbar-menu',
  standalone: true,
  imports: [CommonModule, NavbarMenuLinkComponent],
  templateUrl: './navbar-menu.component.html',
  styleUrl: './navbar-menu.component.scss'
})
export class NavbarMenuComponent {
  @Input() isShow: boolean = false;
  @Input() toggleNavbarMenuShow: () => void = () => { };

  constructor(private readonly store: Store) { }

  public menu: Menu = {
    linkIconStaticPath: '../../../../../assets/UI/navbar/menu/',
    links: [
      { iconName: 'my-posts.svg', name: 'Мои объявления', href: '/my-posts' },
      { iconName: 'favorites.svg', name: 'Избранные', href: '/favorite' },
      { iconName: 'chats.svg', name: 'Сообщения', href: '/chats' },
      { iconName: 'settings.svg', name: 'Настройки', href: '/settings' },
    ]
  }

  public signout(): void {
    const answer = confirm('Вы действительно хотите покинуть учетную запись?');
    if (answer) {
      window.localStorage.removeItem('access_token');
      this.store.dispatch(resetUser());
    }
  }
}
