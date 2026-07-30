import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { RoleGuard } from 'src/app/core/interceptors/role.guard';

const routes: Routes = [
  {
    path: '',
    component: BookListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian', 'Member'] }
  },
  {
    path: 'create',
    component: BookFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  },
  {
    path: 'edit/:id',
    component: BookFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  },
  {
    path: ':id',
    component: BookDetailsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian', 'Member'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }