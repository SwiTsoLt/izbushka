import { Component } from '@angular/core';
import { PostRepository } from '../../../model/post.repository';
import { Post } from '../../../model/post.model';
import { PostComponent } from '../../UI/post/post.component';
import { NavbarComponent } from '../../UI/navbar/navbar.component';
import { StaticDataSource } from '../../../model/static.datasource';
import { PostPlaceholderComponent } from '../../UI/post-placeholder/post-placeholder.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PostComponent, PostPlaceholderComponent, NavbarComponent],
  providers: [
    { provide: PostRepository },
    { provide: StaticDataSource },
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  public posts$: Observable<Post[]> = this.postRepository.getPosts()

  constructor(
    public postRepository: PostRepository,
  ) { }
}
