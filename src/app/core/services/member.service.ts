import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Member, CreateMemberRequest, UpdateMemberRequest, MemberListResponse } from 'src/app/models/member.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMembers(page: number = 1, pageSize: number = 10, search?: string, isActive?: boolean): Observable<MemberListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (isActive !== undefined) {
      params = params.set('isActive', isActive.toString());
    }

    return this.http.get<MemberListResponse>(`${this.apiUrl}/members`, { params })
      .pipe(catchError(this.handleError));
  }

  getMember(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/members/${id}`)
      .pipe(catchError(this.handleError));
  }

  getMemberByUserId(userId: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/members/user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  createMember(member: CreateMemberRequest): Observable<Member> {
    return this.http.post<Member>(`${this.apiUrl}/members`, member)
      .pipe(catchError(this.handleError));
  }

  updateMember(id: string, member: UpdateMemberRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/members/${id}`, member)
      .pipe(catchError(this.handleError));
  }

  deleteMember(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/members/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while processing your request';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'Member not found';
    } else if (error.status === 409) {
      errorMessage = 'Member already exists with this email';
    }

    return throwError(() => new Error(errorMessage));
  }
}