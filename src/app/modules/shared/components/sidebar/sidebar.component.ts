import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', icon: 'fa-chart-pie', route: '/dashboard', roles: ['Admin', 'Librarian', 'Member'] },
    { label: 'Books', icon: 'fa-book', route: '/books', roles: ['Admin', 'Librarian', 'Member'] },
    { label: 'Members', icon: 'fa-users', route: '/members', roles: ['Admin', 'Librarian'] },
    { label: 'Branches', icon: 'fa-store', route: '/branches', roles: ['Admin', 'Librarian'] },
    { label: 'Borrow/Return', icon: 'fa-exchange-alt', route: '/borrow', roles: ['Admin', 'Librarian'] },
    { label: 'Reservations', icon: 'fa-clock', route: '/reservations', roles: ['Admin', 'Librarian'] },
    { label: 'Reports', icon: 'fa-file-alt', route: '/reports', roles: ['Admin', 'Librarian'] }
  ];
}