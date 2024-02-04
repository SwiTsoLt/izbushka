import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Post } from "@models/post.model";
import { Observable, map } from "rxjs";
import { HttpResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpService: HttpService) { }

  public getPage(page: number): Observable<Post[]> {
    return this.httpService.get<Post[]>(`/api/post?page=${page}`).pipe(
      map((response: HttpResponse<Post[] | null>) => {
        if (!response.body) return [];
        return response.body;
      })
    )
  }

  public createPost(createPostDTO: FormData): Observable<Post | null> {
    console.log(createPostDTO);
    return this.httpService.post<Post | null>('/api/post', createPostDTO, {
      reportProgress: true,
    }).pipe(
      map((response: HttpResponse<Post | null>) => response.body)
    )
  }
}