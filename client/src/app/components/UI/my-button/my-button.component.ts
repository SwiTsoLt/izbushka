import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type MyButtonColor = 'none' | 'white' | 'beige' | 'green';

@Component({
  selector: 'app-my-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-button.component.html',
  styleUrl: './my-button.component.scss',
})
export class MyButtonComponent {
  @Input() type = '';
  @Input() color: MyButtonColor = 'green';
  @Input() hasBackground: boolean = false;
  @Input() disabled: boolean = false;
  
  @Output() press = new EventEmitter();
}
