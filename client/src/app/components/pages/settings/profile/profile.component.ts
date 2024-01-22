import { Component } from '@angular/core';
import { User } from '../../../../model/user.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromUser from '../../../../store/user/user.selectors';
import { CommonModule } from '@angular/common';
import { MyButtonComponent } from '../../../UI/my-button/my-button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MyButtonComponent, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  public user$: Observable<User> = this.store.select(fromUser.selectUser as never);

  constructor(private readonly store: Store) {}
}
