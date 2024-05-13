import { NavbarComponent } from '@UI/navbar/navbar.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.scss',
})
export class PolicyComponent {}
