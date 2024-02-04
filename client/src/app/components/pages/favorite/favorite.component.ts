import { Component, OnInit } from '@angular/core';
import { Post } from 'models/post.model';
import { PostRepository } from 'models/post.repository';
import { StaticDataSource } from 'models/static.datasource';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { PostsComponent } from '@UI/posts/posts.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [NavbarComponent, MobileMenuComponent, MobileNavbarComponent, PostsComponent, MobileContextMenuComponent],
  providers: [
    { provide: PostRepository },
    { provide: StaticDataSource },
  ],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  constructor(private readonly postRepository: PostRepository) {}

  public posts$: Observable<Post[]> = of([]);

  ngOnInit(): void {
    this.posts$ = this.postRepository.getPosts();
  }
}
