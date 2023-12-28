import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type SearchButtonColor = 'black' | 'white' | 'green';

function foo() {
  return;
}

@Component({
  selector: 'app-search-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-button.component.html',
  styleUrl: './search-button.component.scss'
})
export class SearchButtonComponent {
  @Input() color: SearchButtonColor = 'black';
  @Input() callback: () => void = foo;
}
