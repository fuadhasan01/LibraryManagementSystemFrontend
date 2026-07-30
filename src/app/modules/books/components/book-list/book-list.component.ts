import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Book } from '../../../../models/book.model';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  standalone: false,
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  selectedGenre = '';
  isLoading = false;
  isAdminOrLibrarian = false;
  private subscriptions: Subscription[] = [];
  protected readonly Math = Math;

  genres = ['Technology', 'Software Development', 'Software Design', 'Software Architecture', 
            'Computer Science', 'Web Development', 'Java Programming'];

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isAdminOrLibrarian = this.authService.hasAnyRole(['Admin', 'Librarian']);
    this.loadBooks();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBooks(): void {
    this.isLoading = true;
    const sub = this.bookService.getBooks(
      this.currentPage, 
      this.pageSize, 
      this.searchTerm, 
      this.selectedGenre
    ).subscribe({
      next: (response) => {
        this.books = response.data;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load books');
      }
    });
    this.subscriptions.push(sub);
  }

  getEndItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.loadBooks();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadBooks();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  onGenreChange(genre: string): void {
    this.selectedGenre = genre;
    this.currentPage = 1;
    this.loadBooks();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedGenre = '';
    this.currentPage = 1;
    this.loadBooks();
  }
  getBookTitle(title: string): string {
    return title.length > 40 ? `${title.substring(0, 40)}...` : title;
  }

  createBook(): void {
    this.router.navigate(['/books/create']);
  }

  editBook(id: string): void {
    this.router.navigate(['/books/edit', id]);
  }

  viewBook(id: string): void {
    this.router.navigate(['/books', id]);
  }

  deleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      const sub = this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Book deleted successfully');
          this.loadBooks();
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete book');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  onGenreSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedGenre = select.value;
    this.onGenreChange(this.selectedGenre);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}