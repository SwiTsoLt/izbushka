import { SearchButtonComponent } from '@UI/search-button/search-button.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [SearchButtonComponent],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.scss',
})
export class MobileNavbarComponent {}
