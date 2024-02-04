import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PostsItemComponent } from './posts-item/posts-item.component';
import { Post } from 'models/post.model';
import { UserRepository } from 'models/user.repository';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, PostsItemComponent],
  providers: [
    { provide: UserRepository }
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  @Input() posts$: Observable<Post[]> = of([]);
}
