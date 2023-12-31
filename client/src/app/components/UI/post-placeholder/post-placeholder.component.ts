import { Component } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-post-placeholder',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './post-placeholder.component.html',
  styleUrl: './post-placeholder.component.scss'
})
export class PostPlaceholderComponent {

}
