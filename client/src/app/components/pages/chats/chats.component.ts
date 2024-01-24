import { Component } from '@angular/core';
import { NavbarComponent } from '@UI/navbar/navbar.component';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsComponent {

}
