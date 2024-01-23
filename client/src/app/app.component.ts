import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';
import { User } from './model/user.model';
import { Store } from '@ngrx/store';
import { setUser } from './store/user/user.actions';
import { SettingsComponent } from './components/pages/settings/settings.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HomeComponent,
    SettingsComponent,
    HttpClientModule
  ],
  providers: [
    { provide: HttpService },
    { provide: UserService }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    private readonly userService: UserService,
    private readonly store: Store
  ) { }

  ngOnInit(): void {
    const access_token = window.localStorage.getItem('access_token');
    if (access_token) {
      this.userService.getUserByJWT(access_token).subscribe((user: User | null) => {
        if (user) {
          this.store.dispatch(setUser({ user }));
        }
      })
    }
  }
}
