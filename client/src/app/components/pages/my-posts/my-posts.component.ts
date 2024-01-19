import { Component } from '@angular/core';
import { NavbarComponent } from '../../UI/navbar/navbar.component';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent {

}
