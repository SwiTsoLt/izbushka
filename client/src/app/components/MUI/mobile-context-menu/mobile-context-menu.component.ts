import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '@model/user.model';
import { Store } from '@ngrx/store';
import { resetUser } from '@store/user/user.actions';
import { selectUser } from '@store/user/user.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mobile-context-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mobile-context-menu.component.html',
  styleUrl: './mobile-context-menu.component.scss'
})
export class MobileContextMenuComponent {
  @Input() isShow: boolean = false;  
  
  public user$: Observable<User> = this.store.select(selectUser as never); 

  constructor(private readonly store: Store) {}

  public signout(): void {
    const answer = confirm('Вы действительно хотите покинуть учетную запись?');
    if (!answer) return;
    window.localStorage.removeItem('access_token');
    this.store.dispatch(resetUser());
  }
}
