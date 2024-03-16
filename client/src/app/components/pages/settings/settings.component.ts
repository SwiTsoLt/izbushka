import { Component, HostListener, OnInit } from '@angular/core';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileNavbarSpecialComponent } from '@MUI/mobile-navbar-special/mobile-navbar-special.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    RouterModule,
    MobileNavbarSpecialComponent,
    MobileMenuComponent,
    MobileContextMenuComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private readonly DEFAULT_PAGE_TITLE = 'Настройки';

  public showChildren = false;
  public pageTitle = this.DEFAULT_PAGE_TITLE;

  constructor(
    private readonly location: Location,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.location.path().includes('/settings/profile')) {
      const tabWidth: number = window.innerWidth;
      if (tabWidth >= 600) {
        this.router.navigate(['/settings/profile'])
      }

      this.showChildren = this.router.url !== '/settings';

      this.router.events.subscribe((event) => {
        if (event.type === 1) {
          this.showChildren = this.router.url !== '/settings';

          if (this.router.url === '/settings') {
            this.pageTitle = this.DEFAULT_PAGE_TITLE;
          }
        }
      })
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (event.target && !this.location.path().includes('/settings/profile')) {
      const tabWidth: number = event.target['innerWidth' as keyof typeof event.target] as unknown as number;
      if (tabWidth >= 600) {
        this.router.navigate(['/settings/profile'])
      }
    }
  }

  public toggleShowChildren() {
    this.showChildren = !this.showChildren;
  }

  public setPageTitle(title: string) {
    this.pageTitle = title;
  }
}
