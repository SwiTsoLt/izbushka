import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../model/post.model';
import { Observable } from 'rxjs';
import { User } from '../../../model/user.model';
import { UserRepository } from '../../../model/user.repository';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: UserRepository }
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  @Input() post: Post | undefined
  @Input() user$: Observable<User> | undefined

  constructor(private userRepository: UserRepository) {}  

  ngOnInit(): void {
    this.user$ = new Observable((observer) => {
      if (!this.post) {
        observer.next(undefined);
        return;
      }
      observer.next(this.userRepository.getUser(this.post.ownerID))
    })
  }
}
