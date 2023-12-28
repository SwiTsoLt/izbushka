import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../../model/post.model';
import { User } from 'src/app/model/user.model';
import { UserRepository } from 'src/app/model/user.repository';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
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
