import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User, UserAvatarFormGroup } from 'models/user.model';
import * as fromUser from '@store/user/user.selectors';
import { MyButtonComponent } from '@UI/my-button/my-button.component';
import { UserCardComponent } from '@UI/user-card/user-card.component';
import { setUser } from '@store/user/user.actions';
import { SelectorLocationComponent } from '@UI/selector-location/selector-location.component';
import { LocationArea, LocationRegion } from '@models/location.model';
import {
  selectLocationArea,
  selectLocationRegion,
} from '@store/location/location.selectors';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostLocationFormGroup } from '@models/post.model';
import * as interfaces from './settings-profile.interface';
import { UserRepository } from '@models/user.repository';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MyButtonComponent,
    RouterModule,
    UserCardComponent,
    SelectorLocationComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './settings-profile.component.html',
  styleUrl: './settings-profile.component.scss',
})
export class ProfileComponent implements OnInit {
  public user$: Observable<User> = this.store.select(
    fromUser.selectUser as never,
  );
  public areaList$: Observable<LocationArea[]> = this.store.select(
    selectLocationArea as never,
  );
  public regionList$: Observable<LocationRegion[]> = this.store.select(
    selectLocationRegion as never,
  );

  public updateUserForm: FormGroup<interfaces.IUpdateForm> = new FormGroup({
    avatar: new FormGroup<UserAvatarFormGroup>({
      id: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      link: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    }),
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
  });

  private newAvatarFileList?: FileList;

  constructor(
    private readonly store: Store,
    private readonly userRepository: UserRepository,
  ) {}

  ngOnInit(): void {
    this.user$.subscribe((user: User) => {
      this.updateUserForm.setValue({
        avatar: {
          id: user.avatar.id ?? '',
          link: user.avatar.link ?? '../../../../../assets/UI/user-card/default-avatar.webp',
        },
        first_name: user.first_name,
        location: {
          area: user.location.area ?? '',
          region: user.location.region ?? '',
        },
      });
    });
  }

  public onChangeAvatar(event: Event) {
    if (!event.target) return;
    const fileList: FileList = event.target[
      'files' as keyof typeof event.target
    ] as unknown as FileList;

    this.newAvatarFileList = fileList;

    this.getBase64(fileList[0]).subscribe(link => {
      this.updateUserForm.controls.avatar.setValue({ id: '', link });
    });
  }

  public onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const values = this.updateUserForm.value;
    const updateFormData = new FormData();
    
    values.first_name && updateFormData.append('first_name', values.first_name);
    values.location && updateFormData.append('location', JSON.stringify(values.location));
    
    if (this.newAvatarFileList?.length) {
      updateFormData.append('files', this.newAvatarFileList.item(0) as File);
    }
  
    this.userRepository.updateUserByJWT(updateFormData).subscribe((user: User) => {
      if (user._id) {
        this.store.dispatch(setUser({ user }));
        alert("Изменения успешно сохранены!");
      }
    });
  }

  public onCancel() {
    const isConfirm = confirm("Вы действительно хотите отменить изменения?");

    if (!isConfirm) return;

    this.user$.subscribe((user: User) => {
      this.updateUserForm.setValue({
        avatar: {
          id: user.avatar.id ?? '',
          link: user.avatar.link ?? '../../../../../assets/UI/user-card/default-avatar.webp',
        },
        first_name: user.first_name,
        location: {
          area: user.location.area ?? '',
          region: user.location.region ?? '',
        },
      });
    });
  }

  private getBase64(file: File): Observable<string> {
    return new Observable<string>((subscriber) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        if (reader.result === null) {
          subscriber.error();
          return;
        }
        subscriber.next(reader.result.toString());
      };
      reader.onerror = function (error) {
        subscriber.error(`Error: ${error}`);
      };
    });
  }
}
