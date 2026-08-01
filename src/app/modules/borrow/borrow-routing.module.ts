import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BorrowBookComponent } from './borrow-book/borrow-book.component';
import { RoleGuard } from 'src/app/core/interceptors/role.guard';
import { ReturnBookComponent } from './return-book/return-book.component';
import { BorrowHistoryComponent } from './borrow-history/borrow-history.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'borrow',
    pathMatch: 'full',
  },
  {
    path: 'borrow',
    component: BorrowBookComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] },
  },
  {
    path: 'return',
    component: ReturnBookComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] },
  },
  {
    path: 'history',
    component: BorrowHistoryComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BorrowRoutingModule {}
