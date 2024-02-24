import { Component } from '@angular/core';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarSpecialComponent } from '@MUI/mobile-navbar-special/mobile-navbar-special.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    NavbarComponent,
    MobileMenuComponent,
    MobileNavbarSpecialComponent,
    MobileContextMenuComponent,
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent {}
