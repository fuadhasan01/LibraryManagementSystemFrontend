import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService } from 'src/app/core/services/book.service';
import { MemberService } from 'src/app/core/services/member.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Book } from 'src/app/models/book.model';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit, OnDestroy {
  reservationForm: FormGroup;
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
    private router: Router,
    private reservationService: ReservationService,
    private bookService: BookService,
    private memberService: MemberService,
    private notificationService: NotificationService
  ) {
    this.reservationForm = this.fb.group({
      bookId: ['', Validators.required],
      memberId: ['', Validators.required],
      holdDays: [7, [Validators.required, Validators.min(1), Validators.max(14)]]
    });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.loadMembers();

    // Watch for book selection
    this.reservationForm.get('bookId')?.valueChanges.subscribe(bookId => {
      this.selectedBook = this.books.find(b => b.id === bookId) || null;
    });

    // Watch for member selection
    this.reservationForm.get('memberId')?.valueChanges.subscribe(memberId => {
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
        this.books = response.data;
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
    if (this.reservationForm.invalid) {
      Object.keys(this.reservationForm.controls).forEach(key => {
        this.reservationForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.canReserve()) {
      this.notificationService.showWarning('Cannot create reservation. Please check availability and member eligibility.');
      return;
    }

    this.isSubmitting = true;
    const sub = this.reservationService.createReservation(this.reservationForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.notificationService.showSuccess('Reservation created successfully');
        this.router.navigate(['/reservations']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.notificationService.showError(error.message || 'Failed to create reservation');
      }
    });
    this.subscriptions.push(sub);
  }

  resetForm(): void {
    this.reservationForm.reset({ holdDays: 7 });
    this.selectedBook = null;
    this.selectedMember = null;
    this.filteredBooks = this.books;
    this.filteredMembers = this.members;
  }

  canReserve(): boolean {
    if (!this.selectedBook || !this.selectedMember) {
      return false;
    }
    return this.selectedMember.isActive && 
           this.selectedMember.canBorrow;
  }

  getExpiryDate(): string {
    const days = this.reservationForm.get('holdDays')?.value || 7;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  getBookAvailabilityClass(): string {
    if (!this.selectedBook) return '';
    return this.selectedBook.availableCopies > 0 ? 'text-success' : 'text-warning';
  }

  getBookAvailabilityText(): string {
    if (!this.selectedBook) return '';
    if (this.selectedBook.availableCopies > 0) {
      return `${this.selectedBook.availableCopies} copies available`;
    }
    return 'Currently unavailable';
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
    return 'Eligible to Reserve';
  }

  cancel(): void {
    this.router.navigate(['/reservations']);
  }
}