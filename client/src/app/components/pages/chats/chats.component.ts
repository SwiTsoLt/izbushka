import { Component } from '@angular/core';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    NavbarComponent,
    MobileMenuComponent,
    MobileNavbarComponent,
    MobileContextMenuComponent,
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsComponent {}
