import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-menu-link',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar-menu-link.component.html',
  styleUrl: './navbar-menu-link.component.scss',
})
export class NavbarMenuLinkComponent {
  @Input() href: string | undefined;
  @Input() iconSrc: string | undefined;
  @Input() name: string | undefined;
}
