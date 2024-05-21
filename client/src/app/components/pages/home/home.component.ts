import { Component, OnInit } from '@angular/core';
import { PostRepository } from 'models/post.repository';
import { Post, PostSearchParams } from 'models/post.model';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Observable, take } from 'rxjs';
import { PostsComponent } from '@UI/posts/posts.component';
import { HomeAsideComponent } from './home-aside/home-aside.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { CacheRepository } from '@models/cache.repository';
import { ActivatedRoute } from '@angular/router';

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
    MobileContextMenuComponent,
  ],
  providers: [PostRepository, CacheRepository],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public posts$: Observable<Post[]> = this.postRepository.getPage();

  constructor(
    private readonly postRepository: PostRepository,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      const searchParams: PostSearchParams = new PostSearchParams(params['page'] ?? '0', params['text'] ?? '');
      this.posts$ = this.postRepository.getPage(searchParams).pipe(take(1));
    });
  }
}
