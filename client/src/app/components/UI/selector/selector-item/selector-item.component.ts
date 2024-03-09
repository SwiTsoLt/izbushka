import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-selector-item',
  standalone: true,
  imports: [],
  templateUrl: './selector-item.component.html',
  styleUrl: './selector-item.component.scss'
})
export class SelectorItemComponent {
  @Input() id: string = '';
  @Input() value: unknown;
  @Input() name: string = '';
  @Input() checked: boolean = false;

  @Output() selectOption = new EventEmitter();
}
