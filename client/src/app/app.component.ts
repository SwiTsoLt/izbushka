import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { SettingsComponent } from '@pages/settings/settings.component';
import { HomeComponent } from '@pages/home/home.component';
import { getOptions } from '@store/store.actions';

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
    this.store.dispatch(getOptions());
  }
}
