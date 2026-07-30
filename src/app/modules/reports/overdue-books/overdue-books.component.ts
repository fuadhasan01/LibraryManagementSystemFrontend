import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportService } from 'src/app/core/services/report.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { OverdueReport } from 'src/app/models/report.model';

@Component({
  selector: 'app-overdue-books',
  templateUrl: './overdue-books.component.html',
  styleUrls: ['./overdue-books.component.scss']
})
export class OverdueBooksComponent implements OnInit, OnDestroy {
  overdueBooks: OverdueReport[] = [];
  filteredBooks: OverdueReport[] = [];
  isLoading = false;
  searchTerm = '';
  sortBy: 'daysOverdue' | 'fineAmount' = 'daysOverdue';
  sortDirection: 'asc' | 'desc' = 'desc';
  totalFines = 0;
  totalOverdueDays = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private reportService: ReportService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOverdueBooks();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadOverdueBooks(): void {
    this.isLoading = true;
    const sub = this.reportService.getOverdueBooks().subscribe({
      next: (data) => {
        this.overdueBooks = data;
        this.filteredBooks = data;
        this.calculateTotals();
        this.sortData();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load overdue books');
      }
    });
    this.subscriptions.push(sub);
  }

  calculateTotals(): void {
    this.totalFines = this.overdueBooks.reduce((sum, book) => sum + book.fineAmount, 0);
    this.totalOverdueDays = this.overdueBooks.reduce((sum, book) => sum + book.daysOverdue, 0);
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredBooks = this.overdueBooks.filter(book =>
      book.bookTitle.toLowerCase().includes(term) ||
      book.memberName.toLowerCase().includes(term) ||
      book.memberEmail.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredBooks = this.overdueBooks;
  }

  sortData(): void {
    this.filteredBooks.sort((a, b) => {
      const aValue = a[this.sortBy];
      const bValue = b[this.sortBy];
      
      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  changeSort(field: 'daysOverdue' | 'fineAmount'): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'desc';
    }
    this.sortData();
  }

  getSeverityClass(daysOverdue: number): string {
    if (daysOverdue >= 30) return 'severity-critical';
    if (daysOverdue >= 14) return 'severity-high';
    if (daysOverdue >= 7) return 'severity-medium';
    return 'severity-low';
  }

  getSeverityText(daysOverdue: number): string {
    if (daysOverdue >= 30) return 'Critical';
    if (daysOverdue >= 14) return 'High';
    if (daysOverdue >= 7) return 'Medium';
    return 'Low';
  }

  getFineColor(fineAmount: number): string {
    if (fineAmount >= 20) return 'text-danger';
    if (fineAmount >= 10) return 'text-warning';
    return 'text-muted';
  }

  getSortIcon(field: string): string {
    if (this.sortBy !== field) return 'fas fa-sort';
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  refreshData(): void {
    this.loadOverdueBooks();
    this.notificationService.showInfo('Refreshing overdue books data...');
  }

  getDaysOverdueClass(days: number): string {
    if (days >= 30) return 'text-danger fw-bold';
    if (days >= 14) return 'text-danger';
    if (days >= 7) return 'text-warning';
    return 'text-muted';
  }
}