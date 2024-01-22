import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';
// import { StoreModule } from '@ngrx/store'
// import * as FromUserReference from './store/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HomeComponent,
    HttpClientModule,
    // StoreModule.forRoot(FromUserReference.reducers),
  ],
  providers: [
    { provide: HttpService },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const access_token = window.localStorage.getItem('access_token');
    console.log(access_token);
  }
}
