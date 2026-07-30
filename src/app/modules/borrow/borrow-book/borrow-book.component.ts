import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BookService } from 'src/app/core/services/book.service';
import { BorrowService } from 'src/app/core/services/borrow.service';
import { MemberService } from 'src/app/core/services/member.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Book } from 'src/app/models/book.model';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-borrow-book',
  templateUrl: './borrow-book.component.html',
  styleUrls: ['./borrow-book.component.scss']
})
export class BorrowBookComponent implements OnInit, OnDestroy {
  borrowForm: FormGroup;
  books: Book[] = [];
  members: Member[] = [];
  filteredBooks: Book[] = [];
  filteredMembers: Member[] = [];
  isLoading = false;
  isSubmitting = false;
  selectedBook: Book | null = null;
  selectedMember: Member | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private borrowService: BorrowService,
    private bookService: BookService,
    private memberService: MemberService,
    private notificationService: NotificationService
  ) {
    this.borrowForm = this.fb.group({
      bookId: ['', Validators.required],
      memberId: ['', Validators.required],
      loanPeriodDays: [14, [Validators.required, Validators.min(1), Validators.max(30)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.loadMembers();

    // Watch for book selection
    this.borrowForm.get('bookId')?.valueChanges.subscribe(bookId => {
      this.selectedBook = this.books.find(b => b.id === bookId) || null;
    });

    // Watch for member selection
    this.borrowForm.get('memberId')?.valueChanges.subscribe(memberId => {
      this.selectedMember = this.members.find(m => m.id === memberId) || null;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBooks(): void {
    this.isLoading = true;
    const sub = this.bookService.getBooks(1, 1000).subscribe({
      next: (response) => {
        this.books = response.data.filter(book => book.availableCopies > 0);
        this.filteredBooks = this.books;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load books');
      }
    });
    this.subscriptions.push(sub);
  }

  loadMembers(): void {
    const sub = this.memberService.getMembers(1, 1000).subscribe({
      next: (response) => {
        this.members = response.data.filter(member => member.isActive);
        this.filteredMembers = this.members;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load members');
      }
    });
    this.subscriptions.push(sub);
  }

  filterBooks(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredBooks = this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.isbn.includes(searchTerm)
    );
  }

  filterMembers(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredMembers = this.members.filter(member =>
      member.fullName.toLowerCase().includes(searchTerm) ||
      member.email.toLowerCase().includes(searchTerm) ||
      member.membershipNumber.includes(searchTerm)
    );
  }

  onSubmit(): void {
    if (this.borrowForm.invalid) {
      Object.keys(this.borrowForm.controls).forEach(key => {
        this.borrowForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.canBorrowBook()) {
      this.notificationService.showWarning('Cannot borrow book. Please check availability and member eligibility.');
      return;
    }

    this.isSubmitting = true;
    const sub = this.borrowService.borrowBook(this.borrowForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.notificationService.showSuccess(response.message);
        this.resetForm();
        this.loadBooks(); // Refresh book list
        this.loadMembers(); // Refresh member list
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.showError(error.message || 'Failed to borrow book');
      }
    });
    this.subscriptions.push(sub);
  }

  resetForm(): void {
    this.borrowForm.reset({ loanPeriodDays: 14 });
    this.selectedBook = null;
    this.selectedMember = null;
    this.filteredBooks = this.books;
    this.filteredMembers = this.members;
  }

  canBorrowBook(): boolean {
    if (!this.selectedBook || !this.selectedMember) {
      return false;
    }
    return this.selectedBook.availableCopies > 0 && 
           this.selectedMember.canBorrow;
  }

  getDueDate(): string {
    const days = this.borrowForm.get('loanPeriodDays')?.value || 14;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  getBookAvailabilityClass(): string {
    if (!this.selectedBook) return '';
    return this.selectedBook.availableCopies > 0 ? 'text-success' : 'text-danger';
  }

  getMemberStatusClass(): string {
    if (!this.selectedMember) return '';
    return this.selectedMember.canBorrow ? 'text-success' : 'text-danger';
  }

  getMemberStatusText(): string {
    if (!this.selectedMember) return '';
    if (!this.selectedMember.isActive) return 'Inactive';
    if (this.selectedMember.outstandingFines > 0) return 'Has Outstanding Fines';
    if (this.selectedMember.currentBorrowedCount >= this.selectedMember.maxBooksAllowed) {
      return 'Borrowing Limit Reached';
    }
    return 'Eligible to Borrow';
  }
}