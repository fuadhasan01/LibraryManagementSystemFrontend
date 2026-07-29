import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { DashboardStats, BookStatistics, BorrowTrend } from '../../../../models/report.model';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  popularBooks: BookStatistics[] = [];
  borrowTrends: BorrowTrend[] = [];
  isLoading = true;
  private subscriptions: Subscription[] = [];

  constructor(
    private reportService: ReportService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load dashboard stats
    const statsSub = this.reportService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load dashboard statistics');
      }
    });
    this.subscriptions.push(statsSub);

    // Load popular books
    const booksSub = this.reportService.getPopularBooks(5).subscribe({
      next: (data) => {
        this.popularBooks = data;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load popular books');
      }
    });
    this.subscriptions.push(booksSub);

    // Load borrow trends
    const trendsSub = this.reportService.getBorrowTrends(7, 'day').subscribe({
      next: (data) => {
        this.borrowTrends = data;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load borrow trends');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
    this.subscriptions.push(trendsSub);
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Active': 'badge-success',
      'Borrowed': 'badge-info',
      'Overdue': 'badge-danger',
      'Returned': 'badge-success',
      'Fulfilled': 'badge-success',
      'Cancelled': 'badge-warning',
      'Expired': 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  }
}