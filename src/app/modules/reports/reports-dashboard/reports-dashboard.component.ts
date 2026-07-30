import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportService } from 'src/app/core/services/report.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DashboardStats } from 'src/app/models/report.model';

@Component({
  selector: 'app-reports-dashboard',
  templateUrl: './reports-dashboard.component.html',
  styleUrls: ['./reports-dashboard.component.scss']
})
export class ReportsDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  isLoading = true;
  private subscriptions: Subscription[] = [];

  // Color mapping for stat cards
  cardColors = {
    primary: { bg: 'bg-primary', text: 'text-primary', icon: 'fa-book' },
    success: { bg: 'bg-success', text: 'text-success', icon: 'fa-check-circle' },
    info: { bg: 'bg-info', text: 'text-info', icon: 'fa-users' },
    warning: { bg: 'bg-warning', text: 'text-warning', icon: 'fa-exchange-alt' },
    danger: { bg: 'bg-danger', text: 'text-danger', icon: 'fa-exclamation-triangle' },
    secondary: { bg: 'bg-secondary', text: 'text-secondary', icon: 'fa-clock' }
  };

  constructor(
    private reportService: ReportService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadStats(): void {
    this.isLoading = true;
    const sub = this.reportService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load dashboard statistics');
      }
    });
    this.subscriptions.push(sub);
  }

  getStatCards(): any[] {
    if (!this.stats) return [];
    return [
      { 
        label: 'Total Books', 
        value: this.stats.totalBooks, 
        icon: 'fa-book', 
        color: 'primary',
        subText: `${this.stats.availableBooks} available`
      },
      { 
        label: 'Available Books', 
        value: this.stats.availableBooks, 
        icon: 'fa-check-circle', 
        color: 'success',
        subText: `${((this.stats.availableBooks / this.stats.totalBooks) * 100).toFixed(1)}% of total`
      },
      { 
        label: 'Total Members', 
        value: this.stats.totalMembers, 
        icon: 'fa-users', 
        color: 'info',
        subText: `${this.stats.activeMembers} active`
      },
      { 
        label: 'Active Members', 
        value: this.stats.activeMembers, 
        icon: 'fa-user-check', 
        color: 'success',
        subText: `${((this.stats.activeMembers / this.stats.totalMembers) * 100).toFixed(1)}% active`
      },
      { 
        label: 'Active Borrows', 
        value: this.stats.activeBorrows, 
        icon: 'fa-exchange-alt', 
        color: 'warning',
        subText: `${this.stats.overdueBorrows} overdue`
      },
      { 
        label: 'Overdue Borrows', 
        value: this.stats.overdueBorrows, 
        icon: 'fa-exclamation-triangle', 
        color: 'danger',
        subText: this.stats.overdueBorrows > 0 ? 'Needs attention' : 'All good'
      },
      { 
        label: 'Active Reservations', 
        value: this.stats.activeReservations, 
        icon: 'fa-clock', 
        color: 'info',
        subText: `${this.stats.totalReservations} total`
      },
      { 
        label: 'Total Fines', 
        value: `$${this.stats.totalFines.toFixed(2)}`, 
        icon: 'fa-dollar-sign', 
        color: 'warning',
        subText: `Outstanding: $${this.stats.outstandingFines.toFixed(2)}`
      },
      { 
        label: 'Outstanding Fines', 
        value: `$${this.stats.outstandingFines.toFixed(2)}`, 
        icon: 'fa-money-bill-wave', 
        color: 'danger',
        subText: this.stats.outstandingFines > 0 ? 'Needs collection' : 'No outstanding fines'
      }
    ];
  }

  getColorClass(color: string): string {
    const colorMap: { [key: string]: string } = {
      'primary': 'bg-primary bg-opacity-10 text-primary',
      'success': 'bg-success bg-opacity-10 text-success',
      'info': 'bg-info bg-opacity-10 text-info',
      'warning': 'bg-warning bg-opacity-10 text-warning',
      'danger': 'bg-danger bg-opacity-10 text-danger',
      'secondary': 'bg-secondary bg-opacity-10 text-secondary'
    };
    return colorMap[color] || 'bg-secondary bg-opacity-10 text-secondary';
  }

  refreshStats(): void {
    this.loadStats();
    this.notificationService.showInfo('Refreshing statistics...');
  }

  Math = Math;
}