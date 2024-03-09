import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { SelectorItemComponent } from './selector-item/selector-item.component';

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [
    CommonModule,
    SelectorItemComponent,
  ],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss'
})
export class SelectorComponent implements AfterViewInit {
  @ContentChildren(SelectorItemComponent) selectorItemList!: QueryList<SelectorItemComponent>;

  @Input() optionList: unknown[] = [];
  @Input() valueList: unknown[] = [];
  @Input() name: string = '';

  @Output() selectOption = new EventEmitter();

  ngAfterViewInit(): void {
    if (this.selectorItemList.length) {
      this.selectorItemList.forEach(selectorItem => {
        selectorItem.selectOption.subscribe(event => this.selectOption.emit(event));
      })
    }
  }
}
