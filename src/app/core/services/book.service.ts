import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Book, CreateBookRequest, UpdateBookRequest, BookListResponse } from 'src/app/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBooks(page: number = 1, pageSize: number = 10, search?: string, genre?: string): Observable<BookListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (genre) {
      params = params.set('genre', genre);
    }

    return this.http.get<BookListResponse>(`${this.apiUrl}/books`, { params })
      .pipe(catchError(this.handleError));
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`)
      .pipe(catchError(this.handleError));
  }

  createBook(book: CreateBookRequest): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/books`, book)
      .pipe(catchError(this.handleError));
  }

  updateBook(id: string, book: UpdateBookRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/books/${id}`, book)
      .pipe(catchError(this.handleError));
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while processing your request';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'Book not found';
    } else if (error.status === 400) {
      errorMessage = 'Invalid book data';
    }

    return throwError(() => new Error(errorMessage));
  }
}