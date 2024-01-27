import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  public get<T>(url: string, options = {}): Observable<HttpResponse<T | null>> {
    return this.httpClient.get<T>(url, { observe: 'response', ...options })
      .pipe(
        map(this.handleUpdateAccessToken),
        catchError(this.handleError)
      );
  }

  public post<T>(url: string, data: unknown, options = {}): Observable<HttpResponse<T | null>> {
    return this.httpClient.post<T | null>(url, data ?? {}, { observe: 'response', ...options })
      .pipe(
        map(this.handleUpdateAccessToken),
        catchError(this.handleError)
      )
  }

  // Private

  private handleUpdateAccessToken<T>(response: HttpResponse<T>): HttpResponse<T> {
    const authorizationHeader = response.headers.get('Authorization')

    if (!authorizationHeader) return response;

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer') return response;
    if (!token) return response;

    window.localStorage.setItem('access_token', token);
    return response
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
