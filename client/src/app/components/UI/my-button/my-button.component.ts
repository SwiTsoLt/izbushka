import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type MyButtonColor = 'none' | 'white' | 'beige' | 'green';

function foo() {
  return;
}

@Component({
  selector: 'app-my-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-button.component.html',
  styleUrl: './my-button.component.scss'
})
export class MyButtonComponent {
  @Input() text = '';
  @Input() color: MyButtonColor = 'green';
  @Input() hasBackground: boolean = false;
  @Input() disabled: boolean = false;
  @Input() callback: () => void = foo;
}
