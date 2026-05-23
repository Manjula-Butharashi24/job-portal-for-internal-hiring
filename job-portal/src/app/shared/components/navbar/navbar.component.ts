import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/guards/guards';
import { NotificationService } from '../../../core/services/services';
import { User, Notification } from '../../../core/models/models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  user: User | null = null;
  notifications: Notification[] = [];
  unreadCount = 0;
  showNotifDropdown = false;
  isDark = false;

  constructor(
    private auth:        AuthService,
    public  theme:       ThemeService,
    private notifService:NotificationService
  ) {}

  ngOnInit() {
    this.user = this.auth.currentUser;
    this.notifService.notifications$.subscribe(n => {
      this.notifications = n.slice(0, 6);
      this.unreadCount   = n.filter(x => !x.read).length;
    });
    this.theme.isDark$.subscribe(d => this.isDark = d);
  }

  toggleTheme() { this.theme.toggle(); }

  markRead(id: string)  { this.notifService.markRead(id); }
  markAllRead()         { this.notifService.markAllRead(); }

  timeAgo(date: string): string {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60)    return 'just now';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  get initials(): string {
    return (this.user?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();
  }

  get pageTitle(): string {
    const url = window.location.pathname;
    if (url.includes('dashboard'))    return 'Dashboard';
    if (url.includes('jobs'))         return 'Jobs';
    if (url.includes('applications')) return 'Applications';
    if (url.includes('users'))        return 'User Management';
    if (url.includes('profile'))      return 'Profile';
    if (url.includes('audit'))        return 'Audit Logs';
    if (url.includes('reports'))      return 'Reports';
    return 'NextHire';
  }
}
