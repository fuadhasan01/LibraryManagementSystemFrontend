import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Branch, BranchInventory } from 'src/app/models/branch.model';
import { Book } from 'src/app/models/book.model';
import { BranchService } from 'src/app/core/services/branch.service';
import { BookService } from 'src/app/core/services/book.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-branch-inventory',
  templateUrl: './branch-inventory.component.html',
  styleUrls: ['./branch-inventory.component.scss']
})
export class BranchInventoryComponent implements OnInit, OnDestroy {
  branchId: string = '';
  branch: Branch | null = null;
  inventory: BranchInventory[] = [];
  allBooks: Book[] = [];
  filteredBooks: Book[] = [];
  isLoading = false;
  isAdmin = false;
  isEditing = false;
  selectedBookId: string = '';
  inventoryForm: FormGroup;
  searchTerm = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private branchService: BranchService,
    private bookService: BookService,
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.inventoryForm = this.fb.group({
      totalCopies: ['', [Validators.required, Validators.min(0)]],
      locationInBranch: ['']
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('Admin');
    this.route.params.subscribe(params => {
      this.branchId = params['id'];
      this.loadBranchDetails();
      this.loadInventory();
      this.loadAvailableBooks();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBranchDetails(): void {
    const sub = this.branchService.getBranch(this.branchId).subscribe({
      next: (data) => {
        this.branch = data;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load branch details');
      }
    });
    this.subscriptions.push(sub);
  }

  loadInventory(): void {
    this.isLoading = true;
    const sub = this.branchService.getBranchInventory(this.branchId).subscribe({
      next: (data) => {
        this.inventory = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load inventory');
      }
    });
    this.subscriptions.push(sub);
  }

  loadAvailableBooks(): void {
    const sub = this.bookService.getBooks(1, 1000).subscribe({
      next: (response) => {
        this.allBooks = response.data;
        this.filteredBooks = this.allBooks;
        this.filterBooks();
      },
      error: (error) => {
        // Don't show error for this
      }
    });
    this.subscriptions.push(sub);
  }

  filterBooks(): void {
    // Get book IDs that already have inventory in this branch
    const inventoryBookIds = this.inventory.map(item => item.bookId);
    
    // Filter books not in inventory
    this.filteredBooks = this.allBooks.filter(book => 
      !inventoryBookIds.includes(book.id) &&
      (this.searchTerm === '' ||
       book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       book.isbn.includes(this.searchTerm))
    );
  }

  onSearch(): void {
    this.filterBooks();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterBooks();
  }

  editInventory(item: BranchInventory): void {
    this.selectedBookId = item.bookId;
    this.isEditing = true;
    this.inventoryForm.patchValue({
      totalCopies: item.totalCopies,
      locationInBranch: item.locationInBranch || ''
    });
  }

  saveInventory(): void {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.get('totalCopies')?.markAsTouched();
      return;
    }

    const request = {
      branchId: this.branchId,
      bookId: this.selectedBookId,
      totalCopies: this.inventoryForm.value.totalCopies,
      locationInBranch: this.inventoryForm.value.locationInBranch
    };

    this.isLoading = true;
    const sub = this.branchService.updateInventory(request).subscribe({
      next: (data) => {
        this.notificationService.showSuccess('Inventory updated successfully');
        this.isEditing = false;
        this.selectedBookId = '';
        this.inventoryForm.reset();
        this.loadInventory();
        this.filterBooks();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError(error.message || 'Failed to update inventory');
      }
    });
    this.subscriptions.push(sub);
  }

  addNewInventory(): void {
    // Find a book not in inventory
    const availableBook = this.filteredBooks[0];
    if (availableBook) {
      this.selectedBookId = availableBook.id;
      this.isEditing = true;
      this.inventoryForm.patchValue({
        totalCopies: 1,
        locationInBranch: ''
      });
    } else {
      this.notificationService.showWarning('No more books available to add to inventory');
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedBookId = '';
    this.inventoryForm.reset();
  }

  goBack(): void {
    this.location.back();
  }

  getAvailabilityClass(availableCopies: number): string {
    return availableCopies > 0 ? 'text-success' : 'text-danger';
  }

  getAvailabilityText(availableCopies: number): string {
    return availableCopies > 0 ? 'Available' : 'Not Available';
  }

  getAvailabilityIcon(availableCopies: number): string {
    return availableCopies > 0 ? 'fas fa-check-circle' : 'fas fa-times-circle';
  }

  getTotalCopies(): number {
    return this.inventory.reduce((sum, item) => sum + item.totalCopies, 0);
  }

  getAvailableCopies(): number {
    return this.inventory.reduce((sum, item) => sum + item.availableCopies, 0);
  }

  getReservedCopies(): number {
    return this.inventory.reduce((sum, item) => sum + item.reservedCopies, 0);
  }

  getBorrowedCopies(): number {
    return this.inventory.reduce((sum, item) => sum + item.borrowedCopies, 0);
  }

  getBookTitle(bookId: string): string {
    const book = this.allBooks.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  }

  getBookAuthor(bookId: string): string {
    const book = this.allBooks.find(b => b.id === bookId);
    return book ? book.author : 'Unknown Author';
  }

  getBookISBN(bookId: string): string {
    const book = this.allBooks.find(b => b.id === bookId);
    return book ? book.isbn : 'N/A';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.inventoryForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  getFormControlErrors(controlName: string): string {
    const control = this.inventoryForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['min']) {
      return `Minimum value is ${errors['min'].min}`;
    }
    return 'Invalid value';
  }
}