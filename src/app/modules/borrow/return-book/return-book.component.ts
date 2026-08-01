import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BorrowService } from 'src/app/core/services/borrow.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { BorrowTransaction } from 'src/app/models/borrow.model';

@Component({
  selector: 'app-return-book',
  templateUrl: './return-book.component.html',
  styleUrls: ['./return-book.component.scss'],
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
    private notificationService: NotificationService,
  ) {
    this.returnForm = this.fb.group({
      transactionId: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.loadTransactions();

    // Watch for transaction selection
    this.returnForm
      .get('transactionId')
      ?.valueChanges.subscribe((transactionId) => {
        console.log('Transaction selected:', transactionId);
        if (transactionId) {
          this.selectedTransaction =
            this.borrowTransactions.find((t) => t.id === transactionId) || null;
          console.log('Selected transaction:', this.selectedTransaction);
          if (this.selectedTransaction && this.selectedTransaction.isOverdue) {
            this.fineAmount = this.selectedTransaction.daysOverdue * 1.0;
          } else {
            this.fineAmount = 0;
          }
        } else {
          this.selectedTransaction = null;
          this.fineAmount = 0;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadTransactions(): void {
    this.isLoading = true;
    console.log('Loading transactions...');

    const sub = this.borrowService
      .getBorrowHistory({
        page: 1,
        pageSize: 1000,
      })
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);
          console.log('Total transactions:', response.total);
          console.log('All transactions:', response.data);

          // Filter only borrowed or overdue transactions
          this.borrowTransactions = response.data.filter((t) => {
            const isBorrowedOrOverdue =
              t.status === 'Borrowed' || t.status === 'Overdue';
            console.log(
              `Transaction ${t.id}: status=${t.status}, filtered=${isBorrowedOrOverdue}`,
            );
            return isBorrowedOrOverdue;
          });

          console.log(
            'Filtered transactions (Borrowed/Overdue):',
            this.borrowTransactions,
          );
          this.filteredTransactions = [...this.borrowTransactions];
          this.isLoading = false;

          if (this.borrowTransactions.length === 0) {
            this.notificationService.showInfo(
              'No books are currently borrowed or overdue.',
            );
          } else {
            this.notificationService.showSuccess(
              `Found ${this.borrowTransactions.length} borrowed books`,
            );
          }
        },
        error: (error) => {
          console.error('Error loading transactions:', error);
          this.isLoading = false;
          this.notificationService.showError(
            error.message || 'Failed to load borrow transactions',
          );
        },
      });
    this.subscriptions.push(sub);
  }

  filterTransactions(event: any): void {
    const searchTerm = event.target.value?.toLowerCase() || '';
    console.log('Filtering with term:', searchTerm);

    if (!searchTerm) {
      this.filteredTransactions = [...this.borrowTransactions];
      return;
    }

    this.filteredTransactions = this.borrowTransactions.filter(
      (t) =>
        t.bookTitle?.toLowerCase().includes(searchTerm) ||
        t.memberName?.toLowerCase().includes(searchTerm) ||
        t.memberEmail?.toLowerCase().includes(searchTerm),
    );
    console.log('Filtered results:', this.filteredTransactions.length);
  }

  onSubmit(): void {
    if (this.returnForm.invalid) {
      this.returnForm.get('transactionId')?.markAsTouched();
      return;
    }

    if (!this.selectedTransaction) {
      this.notificationService.showWarning(
        'Please select a transaction to return',
      );
      return;
    }

    this.isSubmitting = true;
    const request = {
      transactionId: this.returnForm.value.transactionId,
      notes: this.returnForm.value.notes,
    };

    console.log('Return request:', request);

    const sub = this.borrowService.returnBook(request).subscribe({
      next: (response) => {
        console.log('Return response:', response);
        this.isSubmitting = false;
        const message =
          response.fineAmount > 0
            ? `Book returned successfully. Fine: $${response.fineAmount.toFixed(2)}`
            : 'Book returned successfully. No fine applied.';
        this.notificationService.showSuccess(message);
        this.resetForm();
        this.loadTransactions();
      },
      error: (error) => {
        console.error('Return error:', error);
        this.isSubmitting = false;
        this.notificationService.showError(
          error.message || 'Failed to return book',
        );
      },
    });
    this.subscriptions.push(sub);
  }

  resetForm(): void {
    this.returnForm.reset();
    this.selectedTransaction = null;
    this.fineAmount = 0;
    this.filteredTransactions = [...this.borrowTransactions];
  }

  getTransactionStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      Borrowed: 'badge-info',
      Overdue: 'badge-danger',
      Returned: 'badge-success',
      Lost: 'badge-dark',
    };
    return statusMap[status] || 'badge-secondary';
  }

  getTransactionDisplayText(transaction: BorrowTransaction): string {
    if (!transaction) return '';
    const overdueText = transaction.isOverdue
      ? ` - ${transaction.daysOverdue} days overdue`
      : '';
    return `${transaction.bookTitle} - ${transaction.memberName} (${transaction.statusDisplay})${overdueText}`;
  }

  isTransactionSelected(): boolean {
    return !!this.selectedTransaction;
  }

  // Helper method to refresh data
  refreshData(): void {
    this.loadTransactions();
  }
}
