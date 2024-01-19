import { Component } from '@angular/core';
import { NavbarMenuLinkComponent } from './navbar-menu-link/navbar-menu-link.component';

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
  imports: [NavbarMenuLinkComponent],
  templateUrl: './navbar-menu.component.html',
  styleUrl: './navbar-menu.component.scss'
})
export class NavbarMenuComponent {
  public menu: Menu = {
    linkIconStaticPath: '../../../../../assets/UI/navbar/menu/',
    links: [
      { iconName: 'my-posts.svg', name: 'Мои объявления', href: '/my-posts' },
      { iconName: 'favorites.svg', name: 'Избранные', href: '/my-posts' },
      { iconName: 'chats.svg', name: 'Сообщения', href: '/my-posts' },
      { iconName: 'settings.svg', name: 'Настройки', href: '/my-posts' },
      { iconName: 'exit.svg', name: 'Выход', href: '/my-posts' },
    ]
  }
}
