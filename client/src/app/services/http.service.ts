import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import {
  EMPTY,
  Observable,
  catchError,
  map,
  shareReplay,
  takeLast
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) { }

  public get<T>(
    url: string,
    options: Record<string, unknown> = {},
  ): Observable<T> {
    return this.httpClient
      .get<T>(url, this.normalizeOptions(options))
      .pipe(
        takeLast(1),
        map(this.handleUpdateAccessToken),
        map(this.handleResponse),
        catchError(this.handleError),
        shareReplay(1),
      );
  }

  public post<T>(
    url: string,
    data: unknown,
    options: Record<string, unknown> = {},
  ): Observable<T> {
    return this.httpClient
      .post<T>(url, data ?? {}, this.normalizeOptions(options))
      .pipe(
        takeLast(1),
        map(this.handleUpdateAccessToken),
        map(this.handleResponse),
        catchError(this.handleError),
        shareReplay(1),
      );
  }

  public patch<T>(
    url: string,
    data: unknown,
    options: Record<string, unknown> = {},
  ): Observable<T> { 
    return this.httpClient
      .patch<T>(url, data ?? {}, this.normalizeOptions(options))
      .pipe(
        takeLast(1),
        map(this.handleUpdateAccessToken),
        map(this.handleResponse),
        catchError(this.handleError),
        shareReplay(1),
      );
  }

  public handleResponse<T>(response: HttpResponse<T>): T {
    if (!response.body) throw new Error('Body is empty');
    return response.body;
  }

  public handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
    console.error('Something bad happened; please try again later.');
    return EMPTY;
  }

  // Private

  private handleUpdateAccessToken<T>(
    response: HttpResponse<T>,
  ): HttpResponse<T> {
    const authorizationHeader = response.headers.get('Authorization');

    if (!authorizationHeader) return response;

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer') return response;
    if (!token) return response;

    window.localStorage.setItem('access_token', token);
    return response;
  }

  private normalizeOptions(options: Record<string, unknown>): {
    observe: 'response';
    [key: string]: unknown;
  } {
    const access_token = window.localStorage.getItem('access_token') ?? '';
    let headers = new HttpHeaders({ Authorization: `Bearer ${access_token.trim()}` });
    if ('headers' in options) {
      const newHeaders = options['headers'] as Record<string, unknown>;
      headers = new HttpHeaders({ ...headers, ...newHeaders });
    }
    return {
      observe: 'response',
      ...options,
      headers,
    };
  }
}
