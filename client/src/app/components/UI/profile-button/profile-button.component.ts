import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [],
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss',
})
export class ProfileButtonComponent {
  @Input() src = '';
}
