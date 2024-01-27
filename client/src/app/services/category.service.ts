import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Category } from "@model/category.model";
import { Observable, map } from "rxjs";
import { HttpResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    constructor(private httpService: HttpService) { }

    public getAll(): Observable<Category[] | null> {
        return this.httpService.get<Category[]>('/api/category').pipe(
            map((response: HttpResponse<Category[] | null>) => response.body)
        )
    }
}