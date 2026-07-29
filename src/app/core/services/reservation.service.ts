import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reservation, CreateReservationRequest, UpdateReservationRequest, ReservationListResponse } from 'src/app/models/reservation.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReservations(page: number = 1, pageSize: number = 10, bookId?: string, memberId?: string, status?: string): Observable<ReservationListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (bookId) {
      params = params.set('bookId', bookId);
    }
    if (memberId) {
      params = params.set('memberId', memberId);
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ReservationListResponse>(`${this.apiUrl}/reservations`, { params })
      .pipe(catchError(this.handleError));
  }

  getReservation(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/reservations/${id}`)
      .pipe(catchError(this.handleError));
  }

  getReservationsForBook(bookId: string): Observable<{ bookId: string; bookTitle: string; queueLength: number; reservations: Reservation[] }> {
    return this.http.get<{ bookId: string; bookTitle: string; queueLength: number; reservations: Reservation[] }>(
      `${this.apiUrl}/reservations/book/${bookId}`
    ).pipe(catchError(this.handleError));
  }

  getReservationsForMember(memberId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations/member/${memberId}`)
      .pipe(catchError(this.handleError));
  }

  createReservation(request: CreateReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/reservations`, request)
      .pipe(catchError(this.handleError));
  }

  updateReservationStatus(id: string, request: UpdateReservationRequest): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/reservations/${id}/status`, request)
      .pipe(catchError(this.handleError));
  }

  cancelReservation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reservations/${id}`)
      .pipe(catchError(this.handleError));
  }

  processExpiredReservations(): Observable<{ message: string; processed: number }> {
    return this.http.post<{ message: string; processed: number }>(`${this.apiUrl}/reservations/process-expired`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while processing your request';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 409) {
      errorMessage = 'A reservation already exists for this book and member';
    }

    return throwError(() => new Error(errorMessage));
  }
}