import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportService } from 'src/app/core/services/report.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MemberActivity } from 'src/app/models/report.model';

@Component({
  selector: 'app-active-members',
  templateUrl: './active-members.component.html',
  styleUrls: ['./active-members.component.scss']
})
export class ActiveMembersComponent implements OnInit, OnDestroy {
  activeMembers: MemberActivity[] = [];
  filteredMembers: MemberActivity[] = [];
  isLoading = false;
  limit = 10;
  searchTerm = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private reportService: ReportService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadActiveMembers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadActiveMembers(): void {
    this.isLoading = true;
    const sub = this.reportService.getActiveMembers(this.limit).subscribe({
      next: (data) => {
        this.activeMembers = data;
        this.filteredMembers = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load active members');
      }
    });
    this.subscriptions.push(sub);
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredMembers = this.activeMembers.filter(member =>
      member.memberName.toLowerCase().includes(term) ||
      member.email.toLowerCase().includes(term) ||
      member.membershipNumber.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredMembers = this.activeMembers;
  }

  changeLimit(limit: number): void {
    this.limit = limit;
    this.loadActiveMembers();
  }

  getActivityLevel(borrowCount: number): string {
    if (borrowCount >= 20) return 'High';
    if (borrowCount >= 10) return 'Medium';
    return 'Low';
  }

  getActivityClass(borrowCount: number): string {
    if (borrowCount >= 20) return 'badge-success';
    if (borrowCount >= 10) return 'badge-warning';
    return 'badge-secondary';
  }

  getActivityColor(borrowCount: number): string {
    if (borrowCount >= 20) return '#22c55e';
    if (borrowCount >= 10) return '#f59e0b';
    return '#94a3b8';
  }

  getActivityWidth(borrowCount: number): number {
    // Max borrow count for scaling is 30
    return Math.min((borrowCount / 30) * 100, 100);
  }

  getStatusIcon(isActive: boolean): string {
    return isActive ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getMemberRank(borrowCount: number): string {
    if (borrowCount >= 20) return 'Top Borrower';
    if (borrowCount >= 10) return 'Frequent Borrower';
    return 'Occasional Borrower';
  }

  Math = Math;
}