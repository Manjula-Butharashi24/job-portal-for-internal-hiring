import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/services';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet><app-toast></app-toast><app-spinner></app-spinner>'
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private notifSvc: NotificationService) {}

  ngOnInit() {
    // Register reload hook: after login → reload notifications for the new user
    this.auth.registerLoginCallback(() => this.notifSvc.reload());

    // Clear notifications when user logs out
    this.auth.currentUser$.subscribe(user => {
      if (!user) this.notifSvc.clear();
    });
  }
}
