import { Component, Input } from '@angular/core';
import { User } from '../../../../model/user.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {

  @Input() user: User | null = null;
  @Input() isMe?: boolean;
}
