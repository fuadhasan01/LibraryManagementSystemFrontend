import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ReportsDashboardComponent } from './reports-dashboard/reports-dashboard.component';
import { PopularBooksComponent } from './popular-books/popular-books.component';
import { ActiveMembersComponent } from './active-members/active-members.component';
import { OverdueBooksComponent } from './overdue-books/overdue-books.component';

@NgModule({
  declarations: [
    ReportsDashboardComponent,
    PopularBooksComponent,
    ActiveMembersComponent,
    OverdueBooksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    SharedModule
  ]
})
export class ReportsModule { }