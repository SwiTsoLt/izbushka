import { Component, Input } from '@angular/core';
import { NavbarMenuLinkComponent } from './navbar-menu-link/navbar-menu-link.component';
import { CommonModule } from '@angular/common';

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
  @Input() toggleNavbarMenuShow: () => void = () => {};

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
