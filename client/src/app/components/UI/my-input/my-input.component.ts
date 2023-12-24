import { Component, Input } from '@angular/core';

type MyInputColor = 'none' | 'white' | 'beige' | 'green';

@Component({
  selector: 'app-my-input',
  templateUrl: './my-input.component.html',
  styleUrls: ['./my-input.component.scss'],
})
export class MyInputComponent {
  @Input('label') label = '';
  @Input('placeholder') placeholder = '';
  @Input('color') color: MyInputColor = 'white';
  @Input('nBorder') noBorder = false;
}
