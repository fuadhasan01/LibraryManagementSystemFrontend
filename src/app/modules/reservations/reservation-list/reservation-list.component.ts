import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Reservation } from 'src/app/models/reservation.model';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  isLoading = false;
  selectedStatus = 'All';
  searchTerm = '';
  isAdmin = false;
  private subscriptions: Subscription[] = [];

  statuses = ['All', 'Active', 'Fulfilled', 'Cancelled', 'Expired'];

  constructor(
    private reservationService: ReservationService,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    this.loadReservations();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadReservations(): void {
    this.isLoading = true;
    const status = this.selectedStatus === 'All' ? '' : this.selectedStatus;
    
    const sub = this.reservationService.getReservations(
      this.currentPage,
      this.pageSize,
      undefined,
      undefined,
      status
    ).subscribe({
      next: (response) => {
        this.reservations = response.data;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load reservations');
      }
    });
    this.subscriptions.push(sub);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loadReservations();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.loadReservations();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadReservations();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadReservations();
  }

  createReservation(): void {
    this.router.navigate(['/reservations/create']);
  }

  updateStatus(id: string, status: string): void {
    const statusMap: { [key: string]: string } = {
      'Active': 'activate',
      'Fulfilled': 'fulfill',
      'Cancelled': 'cancel',
      'Expired': 'expire'
    };

    const action = statusMap[status] || status.toLowerCase();
    if (confirm(`Are you sure you want to ${action} this reservation?`)) {
      const sub = this.reservationService.updateReservationStatus(id, { status }).subscribe({
        next: () => {
          this.notificationService.showSuccess(`Reservation ${action}d successfully`);
          this.loadReservations();
        },
        error: (error) => {
          this.notificationService.showError(error.message || `Failed to ${action} reservation`);
        }
      });
      this.subscriptions.push(sub);
    }
  }

  cancelReservation(id: string): void {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      const sub = this.reservationService.cancelReservation(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Reservation cancelled successfully');
          this.loadReservations();
        },
        error: (error) => {
          this.notificationService.showError(error.message || 'Failed to cancel reservation');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  processExpired(): void {
    if (confirm('Process all expired reservations? This will mark all expired reservations as expired.')) {
      const sub = this.reservationService.processExpiredReservations().subscribe({
        next: (response) => {
          this.notificationService.showSuccess(response.message);
          this.loadReservations();
        },
        error: (error) => {
          this.notificationService.showError(error.message || 'Failed to process expired reservations');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Active': 'badge-success',
      'Fulfilled': 'badge-info',
      'Cancelled': 'badge-warning',
      'Expired': 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  }

  getStatusIcon(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Active': 'fas fa-clock',
      'Fulfilled': 'fas fa-check-circle',
      'Cancelled': 'fas fa-times-circle',
      'Expired': 'fas fa-exclamation-circle'
    };
    return statusMap[status] || 'fas fa-question-circle';
  }

  getStatusCount(status: string): number {
    if (status === 'All') {
      return this.totalItems;
    }
    return this.reservations.filter(r => r.status === status).length;
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(totalPages, startPage + 4);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push(-1);
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(-1);
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  Math = Math;
}