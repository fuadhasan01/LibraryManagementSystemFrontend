import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BranchService } from 'src/app/core/services/branch.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Branch } from 'src/app/models/branch.model';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss']
})
export class BranchFormComponent implements OnInit, OnDestroy {
  branchForm: FormGroup;
  isEditMode = false;
  branchId: string = '';
  isLoading = false;
  isSubmitting = false;
  currentBranch: Branch | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private branchService: BranchService,
    private notificationService: NotificationService
  ) {
    this.branchForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      code: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Z0-9-]+$/)]],
      address: ['', [Validators.required, Validators.maxLength(500)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{10,20}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      openingTime: ['09:00', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      closingTime: ['18:00', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      description: ['', Validators.maxLength(1000)],
      latitude: ['', Validators.maxLength(50)],
      longitude: ['', Validators.maxLength(50)]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.branchId = id;
        this.loadBranch(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBranch(id: string): void {
    this.isLoading = true;
    const sub = this.branchService.getBranch(id).subscribe({
      next: (branch) => {
        this.currentBranch = branch;
        this.branchForm.patchValue({
          name: branch.name,
          code: branch.code,
          address: branch.address,
          phone: branch.phone,
          email: branch.email,
          openingTime: branch.openingTime,
          closingTime: branch.closingTime,
          description: branch.description || '',
          latitude: branch.latitude || '',
          longitude: branch.longitude || ''
        });
        
        // Disable code field in edit mode
        this.branchForm.get('code')?.disable();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load branch details');
        this.router.navigate(['/branches']);
      }
    });
    this.subscriptions.push(sub);
  }

  onSubmit(): void {
    if (this.branchForm.invalid) {
      Object.keys(this.branchForm.controls).forEach(key => {
        this.branchForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formData = this.branchForm.value;

    if (this.isEditMode) {
      // Update existing branch
      const sub = this.branchService.updateBranch(this.branchId, formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('Branch updated successfully');
          this.router.navigate(['/branches']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notificationService.showError(error.message || 'Failed to update branch');
        }
      });
      this.subscriptions.push(sub);
    } else {
      // Create new branch
      const sub = this.branchService.createBranch(formData).subscribe({
        next: (branch) => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('Branch created successfully');
          this.router.navigate(['/branches']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notificationService.showError(error.message || 'Failed to create branch');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  cancel(): void {
    this.router.navigate(['/branches']);
  }

  getFormControlErrors(controlName: string): string {
    const control = this.branchForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    if (errors['maxlength']) {
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    }
    if (errors['pattern']) {
      if (controlName === 'code') {
        return 'Code can only contain uppercase letters, numbers, and hyphens';
      }
      if (controlName === 'phone') {
        return 'Please enter a valid phone number (e.g., +1234567890)';
      }
      if (controlName === 'openingTime' || controlName === 'closingTime') {
        return 'Please enter a valid time (HH:MM)';
      }
      return 'Invalid format';
    }
    return 'Invalid value';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.branchForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  validateTimeRange(): boolean {
    const opening = this.branchForm.get('openingTime')?.value;
    const closing = this.branchForm.get('closingTime')?.value;
    
    if (opening && closing) {
      return opening < closing;
    }
    return true;
  }

  getTimeValidationMessage(): string {
    if (!this.validateTimeRange()) {
      return 'Closing time must be after opening time';
    }
    return '';
  }
}