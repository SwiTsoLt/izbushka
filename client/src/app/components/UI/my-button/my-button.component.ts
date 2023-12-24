import { Component, Input } from '@angular/core';

type MyButtonColor = 'none' | 'white' | 'beige' | 'green';

function foo() {
  return;
}

@Component({
  selector: 'app-my-button',
  templateUrl: './my-button.component.html',
  styleUrls: ['./my-button.component.scss'],
})
export class MyButtonComponent {
  @Input('text') text = '';
  @Input('color') color: MyButtonColor = 'green';
  @Input('callback') callback: () => void = foo;
}
