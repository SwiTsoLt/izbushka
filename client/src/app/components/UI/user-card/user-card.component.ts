import { Component, Input } from '@angular/core';
import { User } from '../../../model/user.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {

  @Input() user: User | null = null;
  @Input() isMe?: boolean;
}
