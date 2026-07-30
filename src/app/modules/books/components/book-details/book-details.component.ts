import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Book } from '../../../../models/book.model';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  book: Book | null = null;
  isLoading = false;
  isAdminOrLibrarian = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private bookService: BookService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isAdminOrLibrarian = this.authService.hasAnyRole(['Admin', 'Librarian']);
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadBook(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBook(id: string): void {
    this.isLoading = true;
    const sub = this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.book = book;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load book details');
        this.router.navigate(['/books']);
      }
    });
    this.subscriptions.push(sub);
  }

  goBack(): void {
    this.location.back();
  }

  editBook(): void {
    if (this.book) {
      this.router.navigate(['/books/edit', this.book.id]);
    }
  }

  deleteBook(): void {
    if (this.book && confirm('Are you sure you want to delete this book?')) {
      const sub = this.bookService.deleteBook(this.book.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Book deleted successfully');
          this.router.navigate(['/books']);
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete book');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  getStatusClass(availableCopies: number): string {
    return availableCopies > 0 ? 'text-success' : 'text-danger';
  }

  getStatusText(availableCopies: number): string {
    return availableCopies > 0 ? 'Available' : 'Not Available';
  }

  getAvailabilityIcon(availableCopies: number): string {
    return availableCopies > 0 ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger';
  }
}