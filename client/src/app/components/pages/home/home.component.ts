import { Component } from '@angular/core';
import { PostRepository } from '../../../model/post.repository';
import { Post } from '../../../model/post.model';
import { PostComponent } from '../../UI/post/post.component';
import { NavbarComponent } from '../../UI/navbar/navbar.component';
import { StaticDataSource } from '../../../model/static.datasource';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostComponent, NavbarComponent],
  providers: [
    { provide: PostRepository },
    { provide: StaticDataSource },
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public posts: Post[] = []
  
  constructor(postRepository: PostRepository) {
    this.posts = postRepository.getPosts()
  }
}
