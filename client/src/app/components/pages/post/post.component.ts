import { MobileContextMenuComponent } from '@MUI/mobile-context-menu/mobile-context-menu.component';
import { MobileMenuComponent } from '@MUI/mobile-menu/mobile-menu.component';
import { MobileNavbarComponent } from '@MUI/mobile-navbar/mobile-navbar.component';
import { NavbarComponent } from '@UI/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CacheRepository } from '@models/cache.repository';
import { Post } from '@models/post.model';
import { PostRepository } from '@models/post.repository';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    MobileNavbarComponent,
    MobileMenuComponent,
    MobileContextMenuComponent,
  ],
  providers: [PostRepository, CacheRepository],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {

  public post$: Observable<Post | null> = of(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postsRepository: PostRepository
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const postId = params['id']
      this.post$ = this.postsRepository.getPostById(postId);
    })
  }
}
