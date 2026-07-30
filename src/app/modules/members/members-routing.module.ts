import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberListComponent } from './member-list/member-list.component';
import { RoleGuard } from 'src/app/core/interceptors/role.guard';
import { MemberFormComponent } from './member-form/member-form.component';
import { MemberDetailsComponent } from './member-details/member-details.component';

const routes: Routes = [
  {
    path: '',
    component: MemberListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  },
  {
    path: 'create',
    component: MemberFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'edit/:id',
    component: MemberFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: ':id',
    component: MemberDetailsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }