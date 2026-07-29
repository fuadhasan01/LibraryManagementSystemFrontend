import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, UserDto } from '../../models/auth.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.loadUserFromToken();
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest)
      .pipe(
        tap(response => {
          this.tokenService.setToken(response.token);
          this.tokenService.setRefreshToken(response.refreshToken);
          this.currentUserSubject.next(response.user);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
  }

  private loadUserFromToken(): void {
    const token = this.tokenService.getToken();
    if (token) {
      // You could decode JWT to get user info or make an API call
      // For now, we'll just check if token exists
      this.currentUserSubject.next(null);
    }
  }

  getCurrentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.tokenService.hasValidToken();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred during authentication';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Invalid email or password';
    }

    return throwError(() => new Error(errorMessage));
  }
}