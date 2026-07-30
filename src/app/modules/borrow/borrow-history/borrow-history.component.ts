import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BorrowService } from 'src/app/core/services/borrow.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { BorrowTransaction } from 'src/app/models/borrow.model';

@Component({
  selector: 'app-borrow-history',
  templateUrl: './borrow-history.component.html',
  styleUrls: ['./borrow-history.component.scss']
})
export class BorrowHistoryComponent implements OnInit, OnDestroy {
  transactions: BorrowTransaction[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  isLoading = false;
  selectedStatus = 'All';
  private subscriptions: Subscription[] = [];

  statuses = ['All', 'Borrowed', 'Returned', 'Overdue', 'Lost'];

  constructor(
    private borrowService: BorrowService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadTransactions(): void {
    this.isLoading = true;
    const status = this.selectedStatus === 'All' ? '' : this.selectedStatus;
    
    const sub = this.borrowService.getBorrowHistory({
      page: this.currentPage,
      pageSize: this.pageSize,
      status: status
    }).subscribe({
      next: (response) => {
        this.transactions = response.data;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load borrow history');
      }
    });
    this.subscriptions.push(sub);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loadTransactions();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.loadTransactions();
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Borrowed': 'badge-info',
      'Returned': 'badge-success',
      'Overdue': 'badge-danger',
      'Lost': 'badge-dark'
    };
    return statusMap[status] || 'badge-secondary';
  }

  getStatusCount(status: string): number {
    if (status === 'All') {
      return this.totalItems;
    }
    return this.transactions.filter(t => t.status === status).length;
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
      // Show first page, last page, and pages around current page
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(totalPages, startPage + 4);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push(-1); // Ellipsis
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(-1); // Ellipsis
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