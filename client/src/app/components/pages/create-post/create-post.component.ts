import { NavbarComponent } from '@UI/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Category } from 'models/category.model';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import { MyButtonComponent } from '@UI/my-button/my-button.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { Observable, of, take, zip } from 'rxjs';
import { LocationArea, LocationRegion } from 'models/location.model';
import { Store } from '@ngrx/store';
import {
  selectLocationArea,
  selectLocationRegion,
} from '@store/location/location.selectors';
import { PostForm, PostLocationFormGroup } from 'models/post.model';
import { selectCategories } from '@store/category/category.selectors';
import { PostService } from '@services/post.service';
import { CreatePostDTO } from '@dtos/post.dto';
import { User } from '@models/user.model';
import { selectUser } from '@store/user/user.selectors';
import { MobileNavbarSpecialComponent } from '@MUI/mobile-navbar-special/mobile-navbar-special.component';
import { SelectorComponent } from '@UI/selector/selector.component';
import { ISelectOptionEvent } from '@UI/selector/selector.interface';
import { SelectorItemComponent } from '@UI/selector/selector-item/selector-item.component';
import { MobileSelectorComponent } from '@MUI/mobile-selector/mobile-selector.component';
import { IMobileOptionItem, IMobileSelectOptionEvent } from '@MUI/mobile-selector/mobile-selector.interface';
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
    MobileNavbarSpecialComponent,
    MobileContextMenuComponent,
    SelectorComponent,
    SelectorItemComponent,
    MobileSelectorComponent,
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
})
export class CreatePostComponent implements OnInit {
  // User

  public user$: Observable<User> = this.store.select(selectUser as never);
  
  // Location

  public areaList$: Observable<LocationArea[]> = this.store.select(
    selectLocationArea as never,
  );
  public regionList$: Observable<LocationRegion[]> = this.store.select(
    selectLocationRegion as never,
  );

  // Category

  private categoryList$: Observable<Category[]> = this.store.select(
    selectCategories as never,
  );
  public rootCategoryId$: Observable<string> = of('');
  public rootCategoryList$: Observable<Category[]> = of([]);
  public subCategoryList$: Observable<Category[]> = of([]);

  public mobileCategoryList$: Observable<IMobileOptionItem[]> = of([]);
  public currentCategoryName: string | undefined;

  // Images

  public imagesPreview: string[] = [];
  public isDragStart: boolean = false;
  public isPriceFree: boolean = false;
  public isLoading: boolean = false;

  // Form

  public createPostForm: FormGroup<PostForm> = new FormGroup<PostForm>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    body: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
    price: new FormControl<number | null>(null, {
      nonNullable: false,
      validators: [Validators.min(0), Validators.maxLength(6)],
    }),
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
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
    images: new FormControl<FileList>(new DataTransfer().files, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });

  // Init

  constructor(
    private readonly store: Store,
    private readonly postService: PostService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.initLocation();
    this.initRootCategoryList();
    this.initSubCategoryList();
    this.initMobileCategoryList();
  }

  // Init Location

  private initLocation(): void {
    this.user$.subscribe((user: User) => {
      if (user?._id?.length) {
        this.createPostForm.controls.location.controls.area.setValue(
          user.location.area ?? '',
        );
        this.createPostForm.controls.location.controls.region.setValue(
          user.location.region ?? '',
        );
      }
    });
  }

  // Init Category

  private initRootCategoryList(): void {
    this.categoryList$.pipe(take(1)).subscribe((categoryList: Category[]) => {
      const rootCategoryList = categoryList.filter(c => !c.parent);
      this.rootCategoryList$ = of(rootCategoryList);
      this.rootCategoryId$ = of(rootCategoryList[0]._id);
    })
  }

  private initSubCategoryList(): void {
    zip([this.categoryList$, this.rootCategoryId$])
    .pipe(take(1)).subscribe(([categoryList, rootCategoryId]) => {
      const subCategoryList = categoryList.filter(c => c.parent === rootCategoryId);
      this.subCategoryList$ = of(subCategoryList);
    })
  }

  private initMobileCategoryList(): void {
    this.categoryList$.pipe(take(1)).subscribe((categoryList: Category[]) => {
      const rootCategoryList = categoryList.filter(c => !c.parent);
      
      const mobileRootCategoryList: IMobileOptionItem[] = rootCategoryList.reduce((list: IMobileOptionItem[], category: Category) => {
        return [...list, { id: category._id, name: category.name, children: [] }]
      }, []);

      const mobileCategoryList: IMobileOptionItem[] = mobileRootCategoryList.reduce((list: IMobileOptionItem[], category: IMobileOptionItem) => {
        const currentRootCategory = categoryList.find(c => c._id === category.id);
        const children = categoryList.filter(c => currentRootCategory?.children.includes(c._id));
        const mobileSubCategoryList: IMobileOptionItem[] = children.map(c => ({ id: c._id, name: c.name, children: [] }));
        return [...list, { ...category, children: mobileSubCategoryList }];
      }, [])

      this.mobileCategoryList$ = of(mobileCategoryList);
    })
  }

  // Category

  public onSelectRootCategory(event: ISelectOptionEvent<Category>): void {
    this.categoryList$.subscribe((categoryList: Category[]) => {
      const id = categoryList.filter(c => c._id === event.value._id)[0]._id;
      this.rootCategoryId$ = of(id);
    })
  }

  public onSelectSubCategory(event: ISelectOptionEvent<Category>): void {
    this.createPostForm.controls.category.setValue(event.id);
  }

  public onSelectOption(event: IMobileSelectOptionEvent<IMobileOptionItem>): void {
    this.createPostForm.controls.category.setValue(event.id);
    this.currentCategoryName = event.value.name;
  }

  // Images

  public isDragStartSet(state: boolean): void {
    this.isDragStart = state;
  }

  public onFilesLoad(event: Event): void {
    event.preventDefault();
    this.isDragStartSet(false);
    if (!event.target) return;
    const inputElem = event.target as HTMLInputElement;
    const files: FileList | null = inputElem.files;

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

    const dt = new DataTransfer();
    fileArr.forEach((file) => dt.items.add(file));

    this.createPostForm.controls.images.setValue(dt.files);
  }

  // Price

  public setIsPriceFree(state: boolean): void {
    this.isPriceFree = state;
  }

  // Submit

  public onSubmit(): void {
    this.isLoading = true;
    const rawCreatePostForm: CreatePostDTO = this.createPostForm.value;

    const createPostFormData: FormData = new FormData();

    !!rawCreatePostForm.title &&
      createPostFormData.append('title', rawCreatePostForm.title);
    !!rawCreatePostForm.body &&
      createPostFormData.append('body', rawCreatePostForm.body);
    !!rawCreatePostForm.price &&
      createPostFormData.append('price', rawCreatePostForm.price.toString());
    !!rawCreatePostForm.category &&
      createPostFormData.append('category', rawCreatePostForm.category);
    !!rawCreatePostForm.location &&
      createPostFormData.append(
        'location',
        JSON.stringify(rawCreatePostForm.location),
      );

    if (rawCreatePostForm.images?.length) {
      for (let i = 0; i < rawCreatePostForm.images.length; i++) {
        const file: File | null = rawCreatePostForm.images.item(i);
        if (!file) continue;
        createPostFormData.append('files', file);
      }
    }
    this.postService.createPost(createPostFormData).subscribe((data) => {
      if (data?._id) {
        this.router.navigate(['/home']);
        return;
      }
      this.isLoading = false;
    });
  }

  public checkFieldValid(element: HTMLElement): void {
    if (element.classList.contains('ng-invalid')) {
      element.classList.add('invalid');
    } else {
      element.classList.remove('invalid');
    }
  }
}
