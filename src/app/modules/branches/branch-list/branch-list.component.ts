import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { BranchService } from 'src/app/core/services/branch.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Branch } from 'src/app/models/branch.model';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit, OnDestroy {
  branches: Branch[] = [];
  filteredBranches: Branch[] = [];
  isLoading = false;
  isAdmin = false;
  searchTerm = '';
  showActiveOnly = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private branchService: BranchService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    this.loadBranches();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBranches(): void {
    this.isLoading = true;
    const sub = this.branchService.getBranches().subscribe({
      next: (data) => {
        this.branches = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load branches');
      }
    });
    this.subscriptions.push(sub);
  }

  applyFilters(): void {
    this.filteredBranches = this.branches.filter(branch => {
      const matchesSearch = this.searchTerm === '' || 
        branch.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        branch.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesActive = !this.showActiveOnly || branch.isActive;
      
      return matchesSearch && matchesActive;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  toggleActiveFilter(): void {
    this.showActiveOnly = !this.showActiveOnly;
    this.applyFilters();
  }

  createBranch(): void {
    this.router.navigate(['/branches/create']);
  }

  editBranch(id: string): void {
    this.router.navigate(['/branches/edit', id]);
  }

  viewInventory(id: string): void {
    this.router.navigate(['/branches', id, 'inventory']);
  }

  deleteBranch(id: string): void {
    if (confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      const sub = this.branchService.deleteBranch(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Branch deleted successfully');
          this.loadBranches();
        },
        error: (error) => {
          this.notificationService.showError(error.message || 'Failed to delete branch');
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

  getStatusIcon(isActive: boolean): string {
    return isActive ? 'fas fa-check-circle' : 'fas fa-times-circle';
  }

  getTotalBooks(branch: Branch): number {
    return branch.totalBooks || 0;
  }

  getTotalMembers(branch: Branch): number {
    return branch.totalMembers || 0;
  }

  getOperatingHours(branch: Branch): string {
    return `${branch.openingTime} - ${branch.closingTime}`;
  }
}