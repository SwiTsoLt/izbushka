import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '@models/post.model';
import { User } from '@models/user.model';
import { Store } from '@ngrx/store';
import { toggleFavoritePost } from '@store/user/user.actions';
import { selectUser } from '@store/user/user.selectors';
import { Observable, of, take } from 'rxjs';

@Component({
  selector: 'app-mobile-navbar-special',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-navbar-special.component.html',
  styleUrl: './mobile-navbar-special.component.scss',
})
export class MobileNavbarSpecialComponent implements OnInit {

  @Input() title?: string;
  @Input() description?: string;
  @Input() type?: 'DEFAULT' | 'POST' | 'USER';
  @Input() post?: Post | null;
  @Input() backPath?: string;

  @Output() goBack = new EventEmitter();

  public me$: Observable<User> = this.store.select(selectUser as never);
  public isPostFavorite$: Observable<boolean> = of(false)

  constructor(
    private readonly store: Store,
    private readonly location: Location,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (this.type === 'POST') {
      this.me$.subscribe((me: User) => {
        if (!me?._id) {
          this.isPostFavorite$ = of(false);
          return;
        }
  
        if (this.post) {
          this.isPostFavorite$ = of(me.favorites.includes(this.post._id));
        }
      })
    }
  }

  public back(): void {
    this.goBack.emit();
    if (this.backPath) {
      this.router.navigate([this.backPath]);
      return;
    }
    this.router.navigate(['/home']);
  }

  public toggleFavorite(): void {
    this.me$.pipe(take(1)).subscribe((me: User) => {
      if (!me?._id) {
        this.isPostFavorite$ = of(false);
        return;
      }
      if (!this.post?._id) return;
      this.store.dispatch(toggleFavoritePost({ postId: this.post._id }))
    })
  }

  public share(): void {
    navigator.share({
      title: this.title,
      text: this.description,
      url: this.location.path(),
    })
  }
}
