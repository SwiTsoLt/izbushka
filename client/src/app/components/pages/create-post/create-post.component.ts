import { NavbarComponent } from '@UI/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Category } from '@model/category.model';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { MyButtonComponent } from '@UI/my-button/my-button.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';

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
    MobileContextMenuComponent
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {

  public imagesPreview: string[] = [];
  public isDragStart: boolean = false;

  public selectedCategoryId: string = '0';
  public selectedSubCategoryId: string = '0';

  public isPriceFree: boolean = false;

  public categoryList: Category[] = [
    {
      _id: '0', name: 'Строительный инструмент', children: [
        { children: [], _id: '01', parent: '0', name: 'Бензо и электрорезы' },
        { children: [], _id: '02', parent: '0', name: 'Дрели' },
        { children: [], _id: '03', parent: '0', name: 'Измерительный инструмент' },
        { children: [], _id: '04', parent: '0', name: 'Ключи, отвёртки' },
        { children: [], _id: '05', parent: '0', name: 'Краскораспылители, краскопульты' },
        { children: [], _id: '06', parent: '0', name: 'Кусачки, плоскогубцы, пассатижи' },
        { children: [], _id: '07', parent: '0', name: 'Лобзики' },
        { children: [], _id: '08', parent: '0', name: 'Миксеры строительные' },
        { children: [], _id: '09', parent: '0', name: 'Наборы инструментов' },
        { children: [], _id: '010', parent: '0', name: 'Ножницы по металлу' },
      ]
    },
    { _id: '1', name: 'Строительное оборудование', children: [] },
    { _id: '2', name: 'Стройматериалы', children: [] },
    { _id: '3', name: 'Дома, срубы и сооружения', children: [] },
    { _id: '4', name: 'Сантехника и отопление', children: [] },
    { _id: '5', name: 'Отделочные материалы', children: [] },
    { _id: '6', name: 'Окна и двери', children: [] },
    { _id: '7', name: 'Ворота, заборы', children: [] },
    { _id: '8', name: 'Электроснабжение', children: [] },
    { _id: '9', name: 'Средства индивидуальной защиты', children: [] },
    { _id: '10', name: 'Прочее для ремонта и стройки', children: [] },
  ]

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

    for (let i = 0; i < files?.length; i++) {
      const file: File = files[i];
      const url = URL.createObjectURL(file);
      this.imagesPreview.push(url);
    }
  }

  public removeImage(index: number): void {
    this.imagesPreview = this.imagesPreview.filter((_, i) => i !== index);
  }

  public get subcategoryList(): Category[] {
    const selectedCategory = this.categoryList.find(cat => cat._id === this.selectedCategoryId);
    if (!selectedCategory) return [];
    return selectedCategory.children;
  }

  public setCategory(id: string): void {
    this.selectedCategoryId = id;
  }

  public setSubCategory(id: string): void {
    this.selectedSubCategoryId = id;
  }

  public setIsPriceFree(state: boolean): void {
    this.isPriceFree = state;
  }

  public post(): void {
  }
}
