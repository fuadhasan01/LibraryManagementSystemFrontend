import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserDto } from 'src/app/models/auth.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems = [
    { label: 'Dashboard', icon: 'fa-chart-pie', route: '/dashboard', roles: ['Admin', 'Librarian', 'Member'] },
    { label: 'Books', icon: 'fa-book', route: '/books', roles: ['Admin', 'Librarian', 'Member'] },
    { label: 'Members', icon: 'fa-users', route: '/members', roles: ['Admin', 'Librarian'] },
    { label: 'Branches', icon: 'fa-store', route: '/branches', roles: ['Admin', 'Librarian'] },
    { label: 'Borrow/Return', icon: 'fa-exchange-alt', route: '/borrow', roles: ['Admin', 'Librarian'] },
    { label: 'Reservations', icon: 'fa-clock', route: '/reservations', roles: ['Admin', 'Librarian'] },
    { label: 'Reports', icon: 'fa-file-alt', route: '/reports', roles: ['Admin', 'Librarian'] }
  ];

  currentUser: UserDto | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getUserName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return 'User';
  }

  getUserRole(): string {
    if (this.currentUser) {
      return this.currentUser.role;
    }
    return 'Guest';
  }

  getBadgeCount(menuLabel: string): number {
    // This method can be extended to show notification counts
    // For example, show count of overdue books, pending reservations, etc.
    switch (menuLabel) {
      case 'Reservations':
        // Could fetch pending reservation count
        return 0;
      case 'Borrow/Return':
        // Could fetch overdue items count
        return 0;
      default:
        return 0;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // Toggle sidebar on mobile
  toggleSidebar(): void {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
    if (overlay) {
      overlay.classList.toggle('show');
    }
  }

  // Close sidebar on mobile
  closeSidebar(): void {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) {
      sidebar.classList.remove('open');
    }
    if (overlay) {
      overlay.classList.remove('show');
    }
  }
}