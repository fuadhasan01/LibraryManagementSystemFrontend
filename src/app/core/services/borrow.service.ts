import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BorrowTransaction, BorrowBookRequest, ReturnBookRequest, BorrowHistoryRequest, BorrowHistoryResponse } from 'src/app/models/borrow.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  borrowBook(request: BorrowBookRequest): Observable<{ message: string; data: BorrowTransaction }> {
    return this.http.post<{ message: string; data: BorrowTransaction }>(`${this.apiUrl}/borrow/borrow`, request)
      .pipe(catchError(this.handleError));
  }

  returnBook(request: ReturnBookRequest): Observable<{ message: string; fineAmount: number; data: BorrowTransaction }> {
    return this.http.post<{ message: string; fineAmount: number; data: BorrowTransaction }>(`${this.apiUrl}/borrow/return`, request)
      .pipe(catchError(this.handleError));
  }

  getBorrowHistory(request: BorrowHistoryRequest): Observable<BorrowHistoryResponse> {
    let params = new HttpParams()
      .set('page', request.page.toString())
      .set('pageSize', request.pageSize.toString());

    if (request.memberId) {
      params = params.set('memberId', request.memberId);
    }
    if (request.bookId) {
      params = params.set('bookId', request.bookId);
    }
    if (request.status) {
      params = params.set('status', request.status);
    }
    if (request.fromDate) {
      params = params.set('fromDate', request.fromDate);
    }
    if (request.toDate) {
      params = params.set('toDate', request.toDate);
    }

    return this.http.get<BorrowHistoryResponse>(`${this.apiUrl}/borrow/transactions`, { params })
      .pipe(catchError(this.handleError));
  }

  getMemberBorrowHistory(memberId: string): Observable<BorrowTransaction[]> {
    return this.http.get<BorrowTransaction[]>(`${this.apiUrl}/borrow/member/${memberId}`)
      .pipe(catchError(this.handleError));
  }

  getCurrentBorrows(memberId: string): Observable<BorrowTransaction[]> {
    return this.http.get<BorrowTransaction[]>(`${this.apiUrl}/borrow/current/${memberId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while processing your request';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 400) {
      errorMessage = 'Invalid request. Please check your input.';
    } else if (error.status === 404) {
      errorMessage = 'Transaction not found';
    }

    return throwError(() => new Error(errorMessage));
  }
}