import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './modules/shared/shared.module';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { BooksModule } from './modules/books/books.module';
import { MembersModule } from './modules/members/members.module';
import { BranchesModule } from './modules/branches/branches.module';
import { BorrowModule } from './modules/borrow/borrow.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { ReportsModule } from './modules/reports/reports.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AuthModule,
    DashboardModule,
    BooksModule,
    MembersModule,
    BranchesModule,
    BorrowModule,
    ReservationsModule,
    ReportsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}