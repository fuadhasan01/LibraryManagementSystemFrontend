import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/models/member.model';
import { BorrowTransaction } from 'src/app/models/borrow.model';
import { MemberService } from 'src/app/core/services/member.service';
import { BorrowService } from 'src/app/core/services/borrow.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit, OnDestroy {
  member: Member | null = null;
  borrowHistory: BorrowTransaction[] = [];
  currentBorrows: BorrowTransaction[] = [];
  totalFines = 0;
  isLoading = false;
  isLoadingHistory = false;
  isAdmin = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private location: Location,
    private memberService: MemberService,
    private borrowService: BorrowService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadMember(id);
        this.loadBorrowHistory(id);
        this.loadCurrentBorrows(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadMember(id: string): void {
    this.isLoading = true;
    const sub = this.memberService.getMember(id).subscribe({
      next: (member) => {
        this.member = member;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load member details');
        this.router.navigate(['/members']);
      }
    });
    this.subscriptions.push(sub);
  }

  loadBorrowHistory(id: string): void {
    this.isLoadingHistory = true;
    const sub = this.borrowService.getMemberBorrowHistory(id).subscribe({
      next: (history) => {
        this.borrowHistory = history;
        this.totalFines = history.reduce(
          (sum, borrow) => sum + (borrow.fineAmount ?? 0),
          0
        );

        this.isLoadingHistory = false;
      },
      error: (error) => {
        this.isLoadingHistory = false;
        // Don't show error here as it's not critical
      }
    });
    this.subscriptions.push(sub);
  }

  loadCurrentBorrows(id: string): void {
    const sub = this.borrowService.getCurrentBorrows(id).subscribe({
      next: (borrows) => {
        this.currentBorrows = borrows;
      },
      error: (error) => {
        // Don't show error here as it's not critical
      }
    });
    this.subscriptions.push(sub);
  }

  goBack(): void {
    this.location.back();
  }

  editMember(): void {
    if (this.member) {
      this.router.navigate(['/members/edit', this.member.id]);
    }
  }

  deleteMember(): void {
    if (this.member && confirm('Are you sure you want to delete this member?')) {
      const sub = this.memberService.deleteMember(this.member.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Member deleted successfully');
          this.router.navigate(['/members']);
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete member');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  toggleMemberStatus(): void {
    if (this.member) {
      const newStatus = !this.member.isActive;
      const action = newStatus ? 'activate' : 'deactivate';
      
      if (confirm(`Are you sure you want to ${action} this member?`)) {
        const updateData = {
          firstName: this.member.firstName,
          lastName: this.member.lastName,
          phone: this.member.phone,
          address: this.member.address || '',
          isActive: newStatus,
          maxBooksAllowed: this.member.maxBooksAllowed
        };

        const sub = this.memberService.updateMember(this.member.id, updateData).subscribe({
          next: () => {
            this.notificationService.showSuccess(`Member ${action}d successfully`);
            if (this.member) {
              this.member.isActive = newStatus;
            }
          },
          error: (error) => {
            this.notificationService.showError(`Failed to ${action} member`);
          }
        });
        this.subscriptions.push(sub);
      }
    }
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'badge-success' : 'badge-danger';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getStatusIcon(isActive: boolean): string {
    return isActive ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger';
  }

  getBorrowStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Borrowed': 'badge-info',
      'Returned': 'badge-success',
      'Overdue': 'badge-danger',
      'Lost': 'badge-dark'
    };
    return statusMap[status] || 'badge-secondary';
  }

  getDaysUntilDue(dueDate: string): number {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  canBorrow(): boolean {
    if (!this.member) return false;
    return this.member.isActive && 
           this.member.currentBorrowedCount < this.member.maxBooksAllowed &&
           this.member.outstandingFines === 0;
  }

  getBorrowLimitStatus(): string {
    if (!this.member) return '';
    const remaining = this.member.maxBooksAllowed - this.member.currentBorrowedCount;
    if (remaining <= 0) return 'danger';
    if (remaining <= 2) return 'warning';
    return 'success';
  }
}