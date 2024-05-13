import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Post } from '@models/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  public getPage(page: number = 0): Observable<Post[]> {
    return this.httpService.get(`/api/post?page=${page}`)
  }

  public getPostById(id: string): Observable<Post> {
    return this.httpService.get(`/api/post/${id}`)
  }

  public createPost(createPostDTO: FormData): Observable<Post> {
    return this.httpService.post('/api/post', createPostDTO, { reportProgress: true })
  }
}
