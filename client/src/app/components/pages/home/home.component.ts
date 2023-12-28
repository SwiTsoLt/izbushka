import { Component } from '@angular/core';
import { Post } from '../../../model/post.model';
import { PostRepository } from 'src/app/model/post.repository';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public posts: Post[] = []
  
  constructor(postRepository: PostRepository) {
    this.posts = postRepository.getPosts()
  }
}
