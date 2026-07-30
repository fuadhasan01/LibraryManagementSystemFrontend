import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MemberService } from 'src/app/core/services/member.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Member } from 'src/app/models/member.model';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss']
})
export class MemberFormComponent implements OnInit, OnDestroy {
  memberForm: FormGroup;
  isEditMode = false;
  memberId: string = '';
  isLoading = false;
  isSubmitting = false;
  currentMember: Member | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService,
    private notificationService: NotificationService
  ) {
    this.memberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]{10,20}$/)]],
      address: ['', Validators.maxLength(500)],
      maxBooksAllowed: [5, [Validators.required, Validators.min(1), Validators.max(20)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.memberId = id;
        this.loadMember(id);
        
        // Remove password validation in edit mode
        this.memberForm.get('password')?.clearValidators();
        this.memberForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadMember(id: string): void {
    this.isLoading = true;
    const sub = this.memberService.getMember(id).subscribe({
      next: (member) => {
        this.currentMember = member;
        this.memberForm.patchValue({
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          phone: member.phone,
          address: member.address || '',
          maxBooksAllowed: member.maxBooksAllowed
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Failed to load member details');
        this.router.navigate(['/members']);
      }
    });
    this.subscriptions.push(sub);
  }

  onSubmit(): void {
    if (this.memberForm.invalid) {
      Object.keys(this.memberForm.controls).forEach(key => {
        this.memberForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formData = this.memberForm.value;

    if (this.isEditMode) {
      // Update existing member
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        isActive: this.currentMember?.isActive ?? true,
        maxBooksAllowed: formData.maxBooksAllowed
      };

      const sub = this.memberService.updateMember(this.memberId, updateData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('Member updated successfully');
          this.router.navigate(['/members', this.memberId]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notificationService.showError(error.message || 'Failed to update member');
        }
      });
      this.subscriptions.push(sub);
    } else {
      // Create new member
      const sub = this.memberService.createMember(formData).subscribe({
        next: (member) => {
          this.isSubmitting = false;
          this.notificationService.showSuccess('Member created successfully');
          this.router.navigate(['/members', member.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.notificationService.showError(error.message || 'Failed to create member');
        }
      });
      this.subscriptions.push(sub);
    }
  }

  cancel(): void {
    this.router.navigate(['/members']);
  }

  getFormControlErrors(controlName: string): string {
    const control = this.memberForm.get(controlName);
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
    if (errors['minlength']) {
      return `Minimum ${errors['minlength'].requiredLength} characters required`;
    }
    if (errors['maxlength']) {
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    }
    if (errors['pattern']) {
      if (controlName === 'phone') {
        return 'Please enter a valid phone number (e.g., +1234567890)';
      }
      return 'Invalid format';
    }
    if (errors['min']) {
      return `Minimum value is ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `Maximum value is ${errors['max'].max}`;
    }

    return 'Invalid value';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.memberForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  getPasswordRequirements(): string[] {
    return [
      'At least 8 characters long',
      'Contains at least one uppercase letter',
      'Contains at least one lowercase letter',
      'Contains at least one number'
    ];
  }
}