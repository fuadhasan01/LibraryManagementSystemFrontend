import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { Book } from '../../../../models/book.model';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit, OnDestroy {
  bookForm: FormGroup;
  isEditMode = false;
  bookId: string = '';
  isLoading = false;
  isSubmitting = false;
  currentBook: Book | null = null;
  private subscriptions: Subscription[] = [];

  genres = [
    'Technology',
    'Software Development',
    'Software Design',
    'Software Architecture',
    'Computer Science',
    'Web Development',
    'Java Programming',
    'Python Programming',
    'JavaScript',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Cybersecurity',
    'Database',
    'Cloud Computing',
    'DevOps',
    'Mobile Development',
    'Game Development',
    'Networking',
    'Operating Systems',
    'Algorithms',
    'Data Structures',
    'Programming Languages',
    'Software Engineering',
    'Agile',
    'Project Management',
    'Business',
    'Self-Help',
    'Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Philosophy',
    'Psychology',
    'Economics',
    'Finance',
    'Marketing',
    'Leadership'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private notificationService: NotificationService
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(500)]],
      author: ['', [Validators.required, Validators.maxLength(200)]],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]+$/)]],
      publisher: ['', Validators.maxLength(200)],
      publicationYear: ['', [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear() + 1)]],
      genre: [''],
      description: ['', Validators.maxLength(2000)],
      totalCopies: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.maxLength(100)]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.bookId = id;
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
        this.currentBook = book;
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          publisher: book.publisher || '',
          publicationYear: book.publicationYear,
          genre: book.genre || '',
          description: book.description || '',
          totalCopies: book.totalCopies,
          location: book.location || ''
        });
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

  onSubmit(): void {
    if (this.bookForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookForm.controls).forEach(key => {
        this.bookForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formData = this.bookForm.value;

    if (this.isEditMode) {
      // Update existing book
      const sub = this.bookService.updateBook(this.bookId, formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('Book updated successfully');
          this.router.navigate(['/books', this.bookId]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notificationService.showError(error.message || 'Failed to update book');
        }
      });
      this.subscriptions.push(sub);
    } else {
      // Create new book
      const sub = this.bookService.createBook(formData).subscribe({
        next: (book) => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('Book created successfully');
          this.router.navigate(['/books', book.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notificationService.showError(error.message || 'Failed to create book');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  cancel(): void {
    this.router.navigate(['/books']);
  }

  getFormControlErrors(controlName: string): string {
    const control = this.bookForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['maxlength']) {
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    }
    if (errors['minlength']) {
      return `Minimum ${errors['minlength'].requiredLength} characters required`;
    }
    if (errors['min']) {
      return `Minimum value is ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `Maximum value is ${errors['max'].max}`;
    }
    if (errors['pattern']) {
      if (controlName === 'isbn') {
        return 'ISBN can only contain numbers and hyphens';
      }
      return 'Invalid format';
    }
    if (errors['email']) {
      return 'Invalid email format';
    }

    return 'Invalid value';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.bookForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}