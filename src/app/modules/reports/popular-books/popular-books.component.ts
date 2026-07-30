import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportService } from 'src/app/core/services/report.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { BookStatistics } from 'src/app/models/report.model';

@Component({
  selector: 'app-popular-books',
  templateUrl: './popular-books.component.html',
  styleUrls: ['./popular-books.component.scss']
})
export class PopularBooksComponent implements OnInit, OnDestroy {
  popularBooks: BookStatistics[] = [];
  filteredBooks: BookStatistics[] = [];
  isLoading = false;
  limit = 10;
  searchTerm = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private reportService: ReportService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPopularBooks();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadPopularBooks(): void {
    this.isLoading = true;
    const sub = this.reportService.getPopularBooks(this.limit).subscribe({
      next: (data) => {
        this.popularBooks = data;
        this.filteredBooks = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load popular books');
      }
    });
    this.subscriptions.push(sub);
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredBooks = this.popularBooks.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.isbn.includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredBooks = this.popularBooks;
  }

  changeLimit(limit: number): void {
    this.limit = limit;
    this.loadPopularBooks();
  }

  getPopularityColor(score: number): string {
    if (score >= 8) return 'text-success';
    if (score >= 5) return 'text-warning';
    return 'text-danger';
  }

  getPopularityWidth(score: number): number {
    // Convert score to percentage (max score is 10)
    return Math.min((score / 10) * 100, 100);
  }

  getAvailabilityStatus(copies: number): string {
    if (copies > 0) return 'Available';
    return 'Not Available';
  }

  getAvailabilityClass(copies: number): string {
    return copies > 0 ? 'text-success' : 'text-danger';
  }

  getAvailabilityIcon(copies: number): string {
    return copies > 0 ? 'fas fa-check-circle' : 'fas fa-times-circle';
  }

  getPopularityRank(score: number): string {
    if (score >= 8) return 'High';
    if (score >= 5) return 'Medium';
    return 'Low';
  }

  Math = Math;
}