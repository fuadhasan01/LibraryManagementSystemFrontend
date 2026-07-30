import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { MemberService } from 'src/app/core/services/member.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit, OnDestroy {
  members: Member[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  showActiveOnly = false;
  isLoading = false;
  isAdmin = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private memberService: MemberService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    this.loadMembers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadMembers(): void {
    this.isLoading = true;
    const sub = this.memberService.getMembers(
      this.currentPage, 
      this.pageSize, 
      this.searchTerm, 
      this.showActiveOnly
    ).subscribe({
      next: (response) => {
        this.members = response.data;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load members');
      }
    });
    this.subscriptions.push(sub);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMembers();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadMembers();
  }

  toggleActiveFilter(): void {
    this.showActiveOnly = !this.showActiveOnly;
    this.currentPage = 1;
    this.loadMembers();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.showActiveOnly = false;
    this.currentPage = 1;
    this.loadMembers();
  }

  createMember(): void {
    this.router.navigate(['/members/create']);
  }

  editMember(id: string): void {
    this.router.navigate(['/members/edit', id]);
  }

  viewMember(id: string): void {
    this.router.navigate(['/members', id]);
  }

  viewBorrowHistory(id: string): void {
    this.router.navigate(['/borrow/history'], { queryParams: { memberId: id } });
  }

  deleteMember(id: string): void {
    if (confirm('Are you sure you want to delete this member?')) {
      const sub = this.memberService.deleteMember(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Member deleted successfully');
          this.loadMembers();
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete member');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'badge-success' : 'badge-danger';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getInitials(member: Member): string {
    if (!member) return '';
    return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
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