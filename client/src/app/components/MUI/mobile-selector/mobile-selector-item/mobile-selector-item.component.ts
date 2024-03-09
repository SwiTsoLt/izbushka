import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mobile-selector-item',
  standalone: true,
  imports: [],
  templateUrl: './mobile-selector-item.component.html',
  styleUrl: './mobile-selector-item.component.scss'
})
export class MobileSelectorItemComponent {
  @Input() id: string = '';
  @Input() value: unknown;

  @Output() selectOption = new EventEmitter();
}
