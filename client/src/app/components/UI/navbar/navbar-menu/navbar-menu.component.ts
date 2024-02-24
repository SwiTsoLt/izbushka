import { Component, Input } from '@angular/core';
import { NavbarMenuLinkComponent } from './navbar-menu-link/navbar-menu-link.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { resetUser } from '../../../../store/user/user.actions';
import { Observable, of } from 'rxjs';
import { User } from '../../../../models/user.model';
import { selectUser } from '../../../../store/user/user.selectors';

interface IMenuLink {
  href: string;
  iconName: string;
  name: string;
}

interface Menu {
  linkIconStaticPath: string;
  links: IMenuLink[];
}

@Component({
  selector: 'app-navbar-menu',
  standalone: true,
  imports: [CommonModule, NavbarMenuLinkComponent],
  templateUrl: './navbar-menu.component.html',
  styleUrl: './navbar-menu.component.scss',
})
export class NavbarMenuComponent {
  @Input() isShow: boolean = false;
  @Input() toggleNavbarMenuShow: () => void = () => { };

  public readonly user$: Observable<User> = this.store.select(
    selectUser as never,
  );

  public menu$: Observable<Menu> = of({
    linkIconStaticPath: '../../../../../assets/UI/navbar/menu/',
    links: [
      { iconName: 'profile.svg', name: 'Мой профиль', href: '/signin' },
      { iconName: 'my-posts.svg', name: 'Мои объявления', href: '/my-posts' },
      { iconName: 'favorites.svg', name: 'Избранные', href: '/favorite' },
      { iconName: 'chats.svg', name: 'Сообщения', href: '/chats' },
      { iconName: 'settings.svg', name: 'Настройки', href: '/settings' },
    ],
  });

  constructor(private readonly store: Store) {
    this.user$.subscribe((user: User) => {
      if (!user?._id) return;

      this.menu$ = of({
        linkIconStaticPath: '../../../../../assets/UI/navbar/menu/',
        links: [
          {
            iconName: 'profile.svg',
            name: 'Мой профиль',
            href: `/user/${user._id}`,
          },
          {
            iconName: 'my-posts.svg',
            name: 'Мои объявления',
            href: '/my-posts',
          },
          { iconName: 'favorites.svg', name: 'Избранные', href: '/favorite' },
          { iconName: 'chats.svg', name: 'Сообщения', href: '/chats' },
          { iconName: 'settings.svg', name: 'Настройки', href: '/settings' },
        ],
      });
    });
  }

  public signout(): void {
    const answer = confirm('Вы действительно хотите покинуть учетную запись?');
    if (!answer) return;

    window.localStorage.removeItem('access_token');
    this.store.dispatch(resetUser());
  }
}
