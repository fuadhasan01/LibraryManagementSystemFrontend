import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/interceptors/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'books',
    loadChildren: () =>
      import('./modules/books/books.module').then((m) => m.BooksModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'members',
    loadChildren: () =>
      import('./modules/members/members.module').then((m) => m.MembersModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'branches',
    loadChildren: () =>
      import('./modules/branches/branches.module').then(
        (m) => m.BranchesModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'borrow',
    loadChildren: () =>
      import('./modules/borrow/borrow.module').then((m) => m.BorrowModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reservations',
    loadChildren: () =>
      import('./modules/reservations/reservations.module').then(
        (m) => m.ReservationsModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./modules/reports/reports.module').then((m) => m.ReportsModule),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}