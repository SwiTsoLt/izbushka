import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-navbar-special',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-navbar-special.component.html',
  styleUrl: './mobile-navbar-special.component.scss',
})
export class MobileNavbarSpecialComponent {

  @Input() title: string = 'Common page';

  constructor(private readonly location: Location) {}

  public back(): void {
    this.location.back();
  }
}
