import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  showSuccess(message: string, title?: string, duration: number = 5000): void {
    this.showNotification({ type: 'success', message, title, duration });
  }

  showError(message: string, title?: string, duration: number = 7000): void {
    this.showNotification({ type: 'error', message, title, duration });
  }

  showWarning(message: string, title?: string, duration: number = 5000): void {
    this.showNotification({ type: 'warning', message, title, duration });
  }

  showInfo(message: string, title?: string, duration: number = 5000): void {
    this.showNotification({ type: 'info', message, title, duration });
  }

  private showNotification(notification: Notification): void {
    this.notificationSubject.next(notification);
  }
}