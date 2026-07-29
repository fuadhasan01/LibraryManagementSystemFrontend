import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DashboardStats, BookStatistics, MemberActivity, BorrowTrend, OverdueReport } from 'src/app/models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/reports/dashboard`)
      .pipe(catchError(this.handleError));
  }

  getPopularBooks(limit: number = 10, fromDate?: string, toDate?: string): Observable<BookStatistics[]> {
    let params = new HttpParams().set('limit', limit.toString());

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get<BookStatistics[]>(`${this.apiUrl}/reports/books/popular`, { params })
      .pipe(catchError(this.handleError));
  }

  getActiveMembers(limit: number = 10, fromDate?: string, toDate?: string): Observable<MemberActivity[]> {
    let params = new HttpParams().set('limit', limit.toString());

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get<MemberActivity[]>(`${this.apiUrl}/reports/members/active`, { params })
      .pipe(catchError(this.handleError));
  }

  getBorrowTrends(days: number = 30, interval: string = 'day'): Observable<BorrowTrend[]> {
    const params = new HttpParams()
      .set('days', days.toString())
      .set('interval', interval);

    return this.http.get<BorrowTrend[]>(`${this.apiUrl}/reports/borrows/trends`, { params })
      .pipe(catchError(this.handleError));
  }

  getOverdueBooks(): Observable<OverdueReport[]> {
    return this.http.get<OverdueReport[]>(`${this.apiUrl}/reports/overdue`)
      .pipe(catchError(this.handleError));
  }

  getInventoryReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/inventory`)
      .pipe(catchError(this.handleError));
  }

  getFinesReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reports/fines`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while generating the report';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}