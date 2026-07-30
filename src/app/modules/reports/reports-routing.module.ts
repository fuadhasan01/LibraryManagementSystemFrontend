import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsDashboardComponent } from './reports-dashboard/reports-dashboard.component';
import { RoleGuard } from 'src/app/core/interceptors/role.guard';
import { PopularBooksComponent } from './popular-books/popular-books.component';
import { ActiveMembersComponent } from './active-members/active-members.component';
import { OverdueBooksComponent } from './overdue-books/overdue-books.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  },
  {
    path: 'popular-books',
    component: PopularBooksComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  },
  {
    path: 'active-members',
    component: ActiveMembersComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  },
  {
    path: 'overdue',
    component: OverdueBooksComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }