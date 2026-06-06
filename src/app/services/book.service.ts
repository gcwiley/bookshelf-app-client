import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, of, throwError, map, retry } from 'rxjs';

// environment
import { environment } from '../../environments/environment';

// book interfaces
import { Book, BookInput } from '../types/book.interface';
import {
  ApiResponse,
  PaginatedResponse,
} from '../types/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly API_URL = `${environment.apiUrl}/books`;
  private readonly http = inject(HttpClient);
  private readonly DEFAULT_RETRY = { count: 1, delay: 1000 };

  // GET - GET BOOKS (PAGINATION)
  public getBooks(
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ): Observable<PaginatedResponse<Book>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);

    return this.http
      .get<PaginatedResponse<Book>>(this.API_URL, { params })
      .pipe(
        retry(this.DEFAULT_RETRY),
        catchError((error) => this.handleError(error)),
      );
  }

  // GET: - GET BOOK BY ID
  public getBookById(id: string): Observable<Book> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<ApiResponse<Book>>(url).pipe(
      retry(this.DEFAULT_RETRY),
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: - SEARCH BOOKS
  public searchBooks(term: string): Observable<Book[]> {
    if (!term.trim()) {
      // if no search term, return an empty book array
      return of([]);
    }

    const params = new HttpParams().set('query', term);
    return this.http.get<ApiResponse<Book[]>>(this.API_URL, { params }).pipe(
      retry(this.DEFAULT_RETRY),
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: - GET BOOK COUNT
  public getBookCount(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.API_URL}/count`).pipe(
      retry(this.DEFAULT_RETRY),
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: - RECENTLY CREATED BOOKS
  public getRecentlyCreatedBooks(): Observable<Book[]> {
    return this.http.get<ApiResponse<Book[]>>(`${this.API_URL}/recent`).pipe(
      retry(this.DEFAULT_RETRY),
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // GET: - FEATURED BOOKS
  public getFeaturedBooks(): Observable<Book[]> {
    return this.http
      .get<ApiResponse<Book[]>>(`${this.API_URL}/favorites`)
      .pipe(
        retry(this.DEFAULT_RETRY),
        map((res) => res.data),
        catchError((error) => this.handleError(error)),
      );
  }

  // SAVE METHODS //

  // POST: - NEW BOOK
  public addBook(newBook: BookInput): Observable<Book> {
    return this.http.post<ApiResponse<Book>>(this.API_URL, newBook).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // DELETE: - DELETE BOOK BY ID
  public deleteBookById(id: string): Observable<Book> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<ApiResponse<Book>>(url).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // PATCH: - UPDATE BOOK BY ID
  public updateBookById(
    id: string,
    body: Partial<Book>,
  ): Observable<Book> {
    const url = `${this.API_URL}/${id}`;
    return this.http.patch<ApiResponse<Book>>(url, body).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // PATCH: - FAVORITE BOOK
  public setBookFavorite(
    id: string,
    favorite: boolean,
  ): Observable<Book> {
    const url = `${this.API_URL}/${id}`;
    return this.http.patch<ApiResponse<Book>>(url, { favorite }).pipe(
      map((res) => res.data),
      catchError((error) => this.handleError(error)),
    );
  }

  // HANDLE ERROR
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Network error:', error.message);
    } else {
      console.error(`Backend error ${error.status}:`, error.error);
    }
    return throwError(() => error);
  }
}
