import { Component, Input } from '@angular/core';

type MyInputColor = 'none' | 'white' | 'beige' | 'green';

@Component({
  selector: 'app-my-input',
  templateUrl: './my-input.component.html',
  styleUrls: ['./my-input.component.scss'],
})
export class MyInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() color: MyInputColor = 'white';
  @Input() noBorder: '' | boolean = false;
}
