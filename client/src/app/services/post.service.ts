import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Post, PostSearchParams } from '@models/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  public getPage(searchParams?: PostSearchParams): Observable<Post[]> {
    const url = new URL('http://localhost:3000/api/post');
    if (searchParams) {
      url.searchParams.append('page', searchParams.page);
      url.searchParams.append('text', searchParams.text);
    }
    return this.httpService.get(`${url.pathname}${url.search}`);
  }

  public getPostById(id: string): Observable<Post> {
    return this.httpService.get(`/api/post/${id}`)
  }

  public createPost(createPostDTO: FormData): Observable<Post> {
    return this.httpService.post('/api/post', createPostDTO, { reportProgress: true })
  }
}
