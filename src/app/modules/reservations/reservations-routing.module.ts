import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { RoleGuard } from 'src/app/core/interceptors/role.guard';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  },
  {
    path: 'create',
    component: ReservationFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Librarian'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationsRoutingModule { }