import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  countdown = 5;
  private countdownInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.performLogout();
  }

  performLogout(): void {
    // Start countdown
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);
        this.authService.logout();
        this.notificationService.showSuccess('You have been logged out successfully');
        this.router.navigate(['/auth/login']);
      }
    }, 1000);

    // Also allow immediate logout if user clicks the button
  }

  immediateLogout(): void {
    clearInterval(this.countdownInterval);
    this.authService.logout();
    this.notificationService.showSuccess('You have been logged out successfully');
    this.router.navigate(['/auth/login']);
  }

  cancelLogout(): void {
    clearInterval(this.countdownInterval);
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}