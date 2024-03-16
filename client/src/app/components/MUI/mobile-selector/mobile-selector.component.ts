import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IMobileOptionItem, IMobileSelectOptionEvent } from './mobile-selector.interface';
import { MobileSelectorItemComponent } from './mobile-selector-item/mobile-selector-item.component';
import { MobileNavbarSpecialComponent } from '@MUI/mobile-navbar-special/mobile-navbar-special.component';

@Component({
  selector: 'app-mobile-selector',
  standalone: true,
  imports: [
    CommonModule,
    MobileNavbarSpecialComponent,
    MobileSelectorItemComponent,
  ],
  templateUrl: './mobile-selector.component.html',
  styleUrl: './mobile-selector.component.scss'
})
export class MobileSelectorComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() isShow: boolean = false;
  @Input() optionList: IMobileOptionItem[] = [];

  @Output() selectOption = new EventEmitter();

  private history: number[] = [];

  public currentOptionList: IMobileOptionItem[] = [];

  // Init

  constructor(
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    this.currentOptionList = this.optionList;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['optionList']) {
      this.currentOptionList = changes['optionList'].currentValue;
    }
  }

  // Handle select

  public onSelectOption(event: IMobileSelectOptionEvent<IMobileOptionItem>): void {
    const nextItemIndex = this.currentOptionList.findIndex(option => option.id === event.id);
    this.history.push(nextItemIndex);
    const nextOptionChildren = this.currentOptionList[nextItemIndex].children;

    if (nextOptionChildren.length) {
      this.currentOptionList = nextOptionChildren;
      return;
    }

    this.selectOption.emit(event);
    this.selectOption.emit();
    this.history = [];
  }

  public get currentLocation(): string {
    return this.location.path();
  }

  public back(): void {
    if (!this.history.length) {
      this.selectOption.emit();
      return;
    }

    this.currentOptionList = this.optionList;
    this.history.pop();
    this.history.forEach(val => {
      this.currentOptionList = this.currentOptionList[val].children;
    })
  }

}
