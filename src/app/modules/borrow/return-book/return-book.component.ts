import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BorrowService } from 'src/app/core/services/borrow.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { BorrowTransaction } from 'src/app/models/borrow.model';
@Component({
  selector: 'app-return-book',
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.scss']
})
export class ReturnBookComponent implements OnInit, OnDestroy {
  returnForm: FormGroup;
  borrowTransactions: BorrowTransaction[] = [];
  filteredTransactions: BorrowTransaction[] = [];
  isLoading = false;
  isSubmitting = false;
  selectedTransaction: BorrowTransaction | null = null;
  fineAmount = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private borrowService: BorrowService,
    private notificationService: NotificationService
  ) {
    this.returnForm = this.fb.group({
      transactionId: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadTransactions();

    // Watch for transaction selection
    this.returnForm.get('transactionId')?.valueChanges.subscribe(transactionId => {
      this.selectedTransaction = this.borrowTransactions.find(t => t.id === transactionId) || null;
      if (this.selectedTransaction && this.selectedTransaction.isOverdue) {
        this.fineAmount = this.selectedTransaction.daysOverdue * 1.0;
      } else {
        this.fineAmount = 0;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadTransactions(): void {
    this.isLoading = true;
    const sub = this.borrowService.getBorrowHistory({ page: 1, pageSize: 1000 }).subscribe({
      next: (response) => {
        this.borrowTransactions = response.data.filter(
          t => t.status === 'Borrowed' || t.status === 'Overdue'
        );
        this.filteredTransactions = this.borrowTransactions;
        this.isLoading = false;

        // If no transactions found, show info
        if (this.borrowTransactions.length === 0) {
          this.notificationService.showInfo('No books are currently borrowed.');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load borrow transactions');
      }
    });
    this.subscriptions.push(sub);
  }

  filterTransactions(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredTransactions = this.borrowTransactions.filter(t =>
      t.bookTitle.toLowerCase().includes(searchTerm) ||
      t.memberName.toLowerCase().includes(searchTerm) ||
      t.memberEmail.toLowerCase().includes(searchTerm)
    );
  }

  onSubmit(): void {
    if (this.returnForm.invalid) {
      this.returnForm.get('transactionId')?.markAsTouched();
      return;
    }

    if (!this.selectedTransaction) {
      this.notificationService.showWarning('Please select a transaction to return');
      return;
    }

    this.isSubmitting = true;
    const request = {
      transactionId: this.returnForm.value.transactionId,
      notes: this.returnForm.value.notes
    };

    const sub = this.borrowService.returnBook(request).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        const message = response.fineAmount > 0 
          ? `Book returned successfully. Fine: $${response.fineAmount.toFixed(2)}`
          : 'Book returned successfully. No fine applied.';
        this.notificationService.showSuccess(message);
        this.resetForm();
        this.loadTransactions();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.showError(error.message || 'Failed to return book');
      }
    });
    this.subscriptions.push(sub);
  }

  resetForm(): void {
    this.returnForm.reset();
    this.selectedTransaction = null;
    this.fineAmount = 0;
    this.filteredTransactions = this.borrowTransactions;
  }

  getTransactionStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Borrowed': 'badge-info',
      'Overdue': 'badge-danger',
      'Returned': 'badge-success',
      'Lost': 'badge-dark'
    };
    return statusMap[status] || 'badge-secondary';
  }

  getTransactionStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Borrowed': 'Borrowed',
      'Overdue': 'Overdue',
      'Returned': 'Returned',
      'Lost': 'Lost'
    };
    return statusMap[status] || status;
  }

  calculateFine(daysOverdue: number): number {
    return daysOverdue > 0 ? daysOverdue * 1.0 : 0;
  }

  isTransactionSelected(): boolean {
    return !!this.selectedTransaction;
  }
}