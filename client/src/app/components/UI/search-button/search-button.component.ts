import { Component, Input } from '@angular/core';

type SearchButtonColor = 'black' | 'white' | 'green';

function foo() {
  return;
}

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss'],
})
export class SearchButtonComponent {
  @Input('color') color: SearchButtonColor = 'black';
  @Input('callback') callback: () => void = foo;
}
