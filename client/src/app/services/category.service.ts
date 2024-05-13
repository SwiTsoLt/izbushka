import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Category } from '@models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpService: HttpService) {}

  public getAll(): Observable<Category[]> {
    return this.httpService.get('/api/category');
  }
}
