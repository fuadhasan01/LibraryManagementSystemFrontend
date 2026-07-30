import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Branch,
  CreateBranchRequest,
  UpdateBranchRequest,
  BranchInventory,
  UpdateBranchInventoryRequest,
  BranchListResponse,
} from 'src/app/models/branch.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBranches(): Observable<Branch[]> {
    return this.http.get<BranchListResponse>(`${this.apiUrl}/branches`).pipe(
      map((response) => response.data),
      catchError(this.handleError),
    );
  }

  getBranch(id: string): Observable<Branch> {
    return this.http
      .get<Branch>(`${this.apiUrl}/branches/${id}`)
      .pipe(catchError(this.handleError));
  }

  createBranch(branch: CreateBranchRequest): Observable<Branch> {
    return this.http
      .post<Branch>(`${this.apiUrl}/branches`, branch)
      .pipe(catchError(this.handleError));
  }

  updateBranch(id: string, branch: UpdateBranchRequest): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/branches/${id}`, branch)
      .pipe(catchError(this.handleError));
  }

  deleteBranch(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/branches/${id}`)
      .pipe(catchError(this.handleError));
  }

  getBranchInventory(branchId: string): Observable<BranchInventory[]> {
    return this.http
      .get<BranchInventory[]>(`${this.apiUrl}/branches/${branchId}/inventory`)
      .pipe(catchError(this.handleError));
  }

  getBranchBookInventory(
    branchId: string,
    bookId: string,
  ): Observable<BranchInventory> {
    return this.http
      .get<BranchInventory>(
        `${this.apiUrl}/branches/${branchId}/inventory/${bookId}`,
      )
      .pipe(catchError(this.handleError));
  }

  updateInventory(
    inventory: UpdateBranchInventoryRequest,
  ): Observable<BranchInventory> {
    return this.http
      .post<BranchInventory>(`${this.apiUrl}/branches/inventory`, inventory)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while processing your request';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.status === 404) {
      errorMessage = 'Branch not found';
    } else if (error.status === 409) {
      errorMessage = 'Branch with this code or email already exists';
    }

    return throwError(() => new Error(errorMessage));
  }
}