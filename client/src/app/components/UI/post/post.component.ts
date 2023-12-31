import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../model/post.model';
import { User } from '../../../model/user.model';
import { CommonModule } from '@angular/common';
import { PostPlaceholderComponent } from '../post-placeholder/post-placeholder.component';
import { UserRepository } from '../../../model/user.repository';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, PostPlaceholderComponent],
  providers: [
    {provide: UserRepository},
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  public user$!: Observable<User | undefined>;

  constructor(
    public userRepository: UserRepository,
  ) {}

  ngOnInit(): void {
    this.userRepository.getUser(this.post.ownerID)
    .subscribe(user => {
      this.user$ = of(user)
    })
  }
}
