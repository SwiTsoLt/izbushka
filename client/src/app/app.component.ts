import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { getUserByAccessToken } from '@store/user/user.actions';
import { SettingsComponent } from '@pages/settings/settings.component';
import { HomeComponent } from '@pages/home/home.component';
import { HttpService } from '@services/http.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { getAllCategories } from '@store/category/category.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HomeComponent,
    SettingsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    private readonly store: Store
  ) { }

  ngOnInit(): void {
    const access_token = window.localStorage.getItem('access_token');

    if (access_token) {
      this.store.dispatch(getUserByAccessToken({ access_token }))
    }

    this.store.dispatch(getAllCategories())
  }
}
