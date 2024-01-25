import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, map, of, take } from 'rxjs';
import { UserService } from '@services/user.service';
import { User } from '@model/user.model';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '@UI/user-card/user-card.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, NavbarComponent, UserCardComponent, RouterModule, MobileContextMenuComponent, MobileMenuComponent, MobileNavbarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  public user$: Observable<User | null> = of(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      take(1),
      map((params) => {
        return params.get('id')
      })
    ).subscribe((id: string | null) => {
      if (!id) {
        this.router.navigate(['/']);
        return;
      }

      this.user$ = this.userService.getUserById(id)
    })
  }
}