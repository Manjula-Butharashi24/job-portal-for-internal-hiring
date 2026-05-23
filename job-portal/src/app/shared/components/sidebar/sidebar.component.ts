import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/models';

interface NavItem { label: string; icon: string; route: string; badge?: number; }

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input()  collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  user: User | null = null;
  navItems: NavItem[] = [];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.auth.currentUser;
    this.buildNavItems();
  }

  buildNavItems() {
    const role = this.user?.role;
    if (role === 'admin') {
      this.navItems = [
        { label: 'Dashboard',  icon: 'bi-grid-1x2',       route: '/admin/dashboard' },
        { label: 'Users',      icon: 'bi-people',          route: '/admin/users'     },
        { label: 'Profile',    icon: 'bi-person-circle',   route: '/admin/profile'   }
      ];
    } else if (role === 'hr') {
      this.navItems = [
        { label: 'Dashboard',    icon: 'bi-grid-1x2',     route: '/hr/dashboard'    },
        { label: 'Jobs',         icon: 'bi-briefcase',    route: '/hr/jobs'         },
        { label: 'Applications', icon: 'bi-file-person',  route: '/hr/applications' },
        { label: 'Profile',      icon: 'bi-person-circle',route: '/hr/profile'      }
      ];
    } else {
      this.navItems = [
        { label: 'Dashboard',     icon: 'bi-grid-1x2',          route: '/employee/dashboard'    },
        { label: 'Browse Jobs',   icon: 'bi-search',             route: '/employee/jobs'         },
        { label: 'Applications',  icon: 'bi-file-earmark-text',  route: '/employee/applications' },
        { label: 'Profile',       icon: 'bi-person-circle',      route: '/employee/profile'      }
      ];
    }
  }

  isActive(route: string): boolean { return this.router.url.startsWith(route); }
  logout() { this.auth.logout(); }

  get initials(): string {
    return (this.user?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();
  }

  get roleLabel(): string {
    return this.user?.role === 'hr' ? 'HR Manager'
         : this.user?.role === 'admin' ? 'Administrator'
         : 'Employee';
  }

  get roleClass(): string { return `badge-${this.user?.role || 'employee'}`; }
}
