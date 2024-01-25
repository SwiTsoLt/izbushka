import { Component } from '@angular/core';
import { PostRepository } from '@model/post.repository';
import { Post } from '@model/post.model';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { StaticDataSource } from '@model/static.datasource';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { PostsComponent } from '@UI/posts/posts.component';
import { HomeAsideComponent } from './home-aside/home-aside.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    PostsComponent,
    HomeAsideComponent,
    MobileNavbarComponent,
    MobileMenuComponent,
    MobileContextMenuComponent
  ],
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
