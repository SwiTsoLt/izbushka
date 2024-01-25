import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserRepository } from '../../../../model/user.repository';
import { Post } from '../../../../model/post.model';
import { User } from '../../../../model/user.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-posts-item',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: UserRepository },
  ],
  templateUrl: './posts-item.component.html',
  styleUrl: './posts-item.component.scss'
})
export class PostsItemComponent implements OnInit {
  @Input() post: Post | undefined;
  public user$: Observable<User | undefined> = of();

  constructor(
    private userRepository: UserRepository,
  ) { }

  ngOnInit(): void {
    if (!this.post?.owner) return;
    this.user$ = this.getUserById(this.post.owner);
  }

  public getUserById(id: string): Observable<User | undefined> {
    return this.userRepository.getUser(id)
  }
}
