import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchListComponent } from './branch-list/branch-list.component';
import { RoleGuard } from 'src/app/core/interceptors/role.guard';
import { BranchFormComponent } from './branch-form/branch-form.component';
import { BranchInventoryComponent } from './branch-inventory/branch-inventory.component';

const routes: Routes = [
  {
    path: '',
    component: BranchListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  },
  {
    path: 'create',
    component: BranchFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'edit/:id',
    component: BranchFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: ':id/inventory',
    component: BranchInventoryComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchesRoutingModule { }