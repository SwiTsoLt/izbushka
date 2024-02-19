import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Post } from '@models/post.model';
import { Observable, map, takeLast } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  public getPage(page: number = 0): Observable<Post[]> {
    return this.httpService.get<Post[]>(`/api/post?page=${page}`).pipe(
      takeLast(1),
      map((response: HttpResponse<Post[] | null>) => {
        if (!response.body) return [];
        return response.body;
      }),
    )
  }

  public createPost(createPostDTO: FormData): Observable<Post | null> {
    return this.httpService
      .post<Post | null>('/api/post', createPostDTO, {
        reportProgress: true,
      })
      .pipe(
        takeLast(1),
        map((response: HttpResponse<Post | null>) => response.body),
      );
  }
}
