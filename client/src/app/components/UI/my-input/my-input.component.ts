import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type MyInputColor = 'none' | 'white' | 'beige' | 'green';

@Component({
  selector: 'app-my-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-input.component.html',
  styleUrl: './my-input.component.scss'
})
export class MyInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() color: MyInputColor = 'white';
  @Input() noBorder: '' | boolean = false;
}
