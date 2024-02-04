import { NavbarComponent } from '@UI/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Category } from 'models/category.model';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { MyButtonComponent } from '@UI/my-button/my-button.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { Observable } from 'rxjs';
import { LocationArea, LocationRegion } from 'models/location.model';
import { Store } from '@ngrx/store';
import { selectLocationArea, selectLocationRegion } from '@store/location/location.selectors';
import { PostForm, PostLocationFormGroup } from 'models/post.model';
import { selectCategories } from '@store/category/category.selectors';
import { PostService } from '@services/post.service';
import { CreatePostDTO } from '@dtos/post.dto';
import { User } from '@models/user.model';
import { selectUser } from '@store/user/user.selectors';
@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    RouterModule,
    MyButtonComponent,
    MobileMenuComponent,
    MobileNavbarComponent,
    MobileContextMenuComponent,
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent implements OnInit {

  constructor(
    private readonly store: Store,
    private readonly postService: PostService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.user$.subscribe((user: User) => {
      if (user?._id?.length) {
        this.createPostForm.controls.location.controls.area.setValue(user.location.area ?? '')
        this.createPostForm.controls.location.controls.region.setValue(user.location.region ?? '')
      }
    })

    this.categoryList$.subscribe((categoryList: Category[]) => {
      if (!categoryList.length) return;
      const rootCategoryList = categoryList.filter(c => !c.parent)
      this.setRootCategory(rootCategoryList[0]._id);
    })
  }

  public user$: Observable<User> = this.store.select(selectUser as never);
  public areaList$: Observable<LocationArea[]> = this.store.select(selectLocationArea as never);
  public regionList$: Observable<LocationRegion[]> = this.store.select(selectLocationRegion as never);

  public categoryList$: Observable<Category[]> = this.store.select(selectCategories as never)

  public imagesPreview: string[] = [];
  public isDragStart: boolean = false;
  public isPriceFree: boolean = false;
  public isLoading: boolean = false;

  public createPostForm: FormGroup<PostForm> = new FormGroup<PostForm>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    body: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(20),
      ],
    }),
    price: new FormControl<number | null>(null, {
      nonNullable: false,
      validators: [
        Validators.min(0),
        Validators.maxLength(6),
      ],
    }),
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    location: new FormGroup<PostLocationFormGroup>({
      area: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
        ]
      }),
      region: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
        ]
      })
    }),
    images: new FormControl<FileList>(new DataTransfer().files, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
      ],
    })
  })

  // Category

  public rootCategory: string = '';

  public setRootCategory(id: string): void {
    this.rootCategory = id;
  }

  // Images

  public isDragStartSet(state: boolean): void {
    this.isDragStart = state
  }

  public onFilesLoad(event: Event): void {
    event.preventDefault();
    this.isDragStartSet(false);
    if (!event.target) return;
    const inputElem = event.target as HTMLInputElement;
    const files: FileList | null = inputElem.files

    if (!files) return;

    this.createPostForm.controls.images.setValue(files);

    for (let i = 0; i < files?.length; i++) {
      const file: File = files[i];
      const url = URL.createObjectURL(file);
      this.imagesPreview.push(url);
    }
  }

  public removeImage(index: number): void {
    this.imagesPreview = this.imagesPreview.filter((_, i) => i !== index);
    const files: FileList | null | undefined = this.createPostForm.value.images;
    if (!files?.length) return;

    const fileArr = Array.from(files);
    fileArr.splice(index, 1);
    
    const dt = new DataTransfer()
    fileArr.forEach((file) => dt.items.add(file));

    this.createPostForm.controls.images.setValue(dt.files);
  }

  public setIsPriceFree(state: boolean): void {
    this.isPriceFree = state;
  }

  public onSubmit(): void {
    this.isLoading = true;
    const rawCreatePostForm: CreatePostDTO = this.createPostForm.value

    const createPostFormData: FormData = new FormData()
    
    !!rawCreatePostForm.title && createPostFormData.append('title', rawCreatePostForm.title)
    !!rawCreatePostForm.body && createPostFormData.append('body', rawCreatePostForm.body)
    !!rawCreatePostForm.price && createPostFormData.append('price', rawCreatePostForm.price.toString())
    !!rawCreatePostForm.category && createPostFormData.append('category', rawCreatePostForm.category)
    !!rawCreatePostForm.location && createPostFormData.append('location', JSON.stringify(rawCreatePostForm.location))

    if (rawCreatePostForm.images?.length) {
      for (let i = 0; i < rawCreatePostForm.images.length; i++) {
        const file: File | null = rawCreatePostForm.images.item(i);
        if (!file) continue;
        createPostFormData.append('files', file);
      }
    }
    this.postService.createPost(createPostFormData).subscribe(data => {
      if (data?._id) {
        this.router.navigate(['/home']);
        return;
      }
      this.isLoading = false;
    })
  }

  public checkFieldValid(element: HTMLElement): void {
    if (element.classList.contains('ng-invalid')) {
      element.classList.add('invalid');
    } else {
      element.classList.remove('invalid');
    }
  }
}
