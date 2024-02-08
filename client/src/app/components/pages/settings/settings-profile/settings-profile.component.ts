import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from 'models/user.model';
import * as fromUser from '@store/user/user.selectors';
import { MyButtonComponent } from '@UI/my-button/my-button.component';
import { UserCardComponent } from '@UI/user-card/user-card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MyButtonComponent, RouterModule, UserCardComponent],
  templateUrl: './settings-profile.component.html',
  styleUrl: './settings-profile.component.scss',
})
export class ProfileComponent {
  public user$: Observable<User> = this.store.select(
    fromUser.selectUser as never,
  );

  constructor(private readonly store: Store) {}
}
