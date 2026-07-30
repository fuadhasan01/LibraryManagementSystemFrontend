import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BorrowRoutingModule } from './borrow-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BorrowBookComponent } from './borrow-book/borrow-book.component';
import { ReturnBookComponent } from './return-book/return-book.component';
import { BorrowHistoryComponent } from './borrow-history/borrow-history.component';

@NgModule({
  declarations: [
    BorrowBookComponent,
    ReturnBookComponent,
    BorrowHistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BorrowRoutingModule,
    SharedModule
  ]
})
export class BorrowModule { }