import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserDto } from 'src/app/models/auth.model';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  roles: string[];
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fa-chart-pie',
      route: '/dashboard',
      roles: ['Admin', 'Librarian', 'Member'],
    },
    {
      label: 'Books',
      icon: 'fa-book',
      route: '/books',
      roles: ['Admin', 'Librarian', 'Member'],
    },
    {
      label: 'Members',
      icon: 'fa-users',
      route: '/members',
      roles: ['Admin', 'Librarian'],
    },
    {
      label: 'Branches',
      icon: 'fa-store',
      route: '/branches',
      roles: ['Admin', 'Librarian'],
    },
    {
      label: 'Borrow / Return',
      icon: 'fa-exchange-alt',
      roles: ['Admin', 'Librarian'],
      expanded: false,
      children: [
        {
          label: 'Borrow Book',
          icon: 'fa-hand-holding-heart',
          route: '/borrow/borrow',
          roles: ['Admin', 'Librarian'],
        },
        {
          label: 'Return Book',
          icon: 'fa-undo-alt',
          route: '/borrow/return',
          roles: ['Admin', 'Librarian'],
        },
        {
          label: 'Borrow History',
          icon: 'fa-history',
          route: '/borrow/history',
          roles: ['Admin', 'Librarian'],
        },
      ],
    },
    {
      label: 'Reservations',
      icon: 'fa-clock',
      route: '/reservations',
      roles: ['Admin', 'Librarian'],
    },
    {
      label: 'Reports',
      icon: 'fa-file-alt',
      roles: ['Admin', 'Librarian'],
      expanded: false,
      children: [
        {
          label: 'Dashboard',
          icon: 'fa-chart-pie',
          route: '/reports',
          roles: ['Admin', 'Librarian'],
        },
        {
          label: 'Popular Books',
          icon: 'fa-star',
          route: '/reports/popular-books',
          roles: ['Admin', 'Librarian'],
        },
        {
          label: 'Active Members',
          icon: 'fa-user-graduate',
          route: '/reports/active-members',
          roles: ['Admin', 'Librarian'],
        },
        {
          label: 'Overdue Books',
          icon: 'fa-exclamation-triangle',
          route: '/reports/overdue',
          roles: ['Admin', 'Librarian'],
        },
      ],
    },
  ];

  currentUser: UserDto | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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
    switch (menuLabel) {
      case 'Reservations':
        return 0;
      case 'Borrow / Return':
        return 0;
      case 'Reports':
        return 0;
      default:
        return 0;
    }
  }

  toggleDropdown(item: MenuItem): void {
    // Close other open dropdowns
    this.menuItems.forEach((menu) => {
      if (menu !== item && menu.children) {
        menu.expanded = false;
      }
    });
    item.expanded = !item.expanded;
  }

  isChildActive(childRoute: string): boolean {
    return this.router.url === childRoute;
  }

  isParentActive(item: MenuItem): boolean {
    if (item.children) {
      return item.children.some((child) => this.router.url === child.route);
    }
    return this.router.url === item.route;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

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

  hasRole(roles: string[]): boolean {
    if (!this.currentUser) return false;
    return roles.includes(this.currentUser.role);
  }

  shouldShowItem(item: MenuItem): boolean {
    return this.hasRole(item.roles);
  }

  isExpanded(item: MenuItem): boolean {
    return item.expanded || false;
  }

  // Helper method to check if any child is active (to keep parent expanded)
  isAnyChildActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some((child) => this.router.url === child.route);
  }
}
