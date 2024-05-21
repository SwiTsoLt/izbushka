import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type SearchButtonColor = 'black' | 'white' | 'green';

@Component({
  selector: 'app-search-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-button.component.html',
  styleUrl: './search-button.component.scss',
})
export class SearchButtonComponent {
  @Input() color: SearchButtonColor = 'black';
  @Output() press = new EventEmitter();
}
