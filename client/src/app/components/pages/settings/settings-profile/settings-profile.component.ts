import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from 'models/user.model';
import * as fromUser from '@store/user/user.selectors';
import { MyButtonComponent } from '@UI/my-button/my-button.component';
import { UserCardComponent } from '@UI/user-card/user-card.component';
import { UserService } from '@services/user.service';
import { setUser } from '@store/user/user.actions';
import { SelectorLocationComponent } from '@UI/selector-location/selector-location.component';
import { LocationArea, LocationRegion } from '@models/location.model';
import { selectLocationArea, selectLocationRegion } from '@store/location/location.selectors';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostLocationFormGroup } from '@models/post.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MyButtonComponent,
    RouterModule,
    UserCardComponent,
    SelectorLocationComponent,
    ReactiveFormsModule
  ],
  templateUrl: './settings-profile.component.html',
  styleUrl: './settings-profile.component.scss',
})
export class ProfileComponent implements OnInit {
  public user$: Observable<User> = this.store.select(
    fromUser.selectUser as never,
  );
  public areaList$: Observable<LocationArea[]> = this.store.select(selectLocationArea as never);
  public regionList$: Observable<LocationRegion[]> = this.store.select(selectLocationRegion as never);

  public updateUserForm = new FormGroup({
    first_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    location: new FormGroup<PostLocationFormGroup>({
      area: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      region: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    }),
  })

  constructor(
    private readonly store: Store,
    private readonly userService: UserService,
  ) { }

  ngOnInit(): void {
    this.user$.subscribe((user: User) => {
      this.updateUserForm.setValue({
        first_name: user.first_name,
        location: {
          area: user.location.area ?? '',
          region: user.location.region ?? '',
        }
      })
    })
  }

  public onSubmit(event: SubmitEvent): void {
    event.preventDefault();
  }

  public updateProfile(): void {
    const data = this.updateUserForm.value;
    this.userService.updateUserByJWT(data).subscribe((user: User) => {
      if (user._id) {
        console.log(user);
        this.store.dispatch(setUser({ user }));
      }
    });
  }
}
