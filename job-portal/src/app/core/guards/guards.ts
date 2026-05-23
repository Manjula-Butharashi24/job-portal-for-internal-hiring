import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    const roles = route.data['roles'] as string[] | undefined;
    if (roles && !this.auth.hasRole(...roles)) {
      this.router.navigate([`/${this.auth.currentUser?.role}/dashboard`]);
      return false;
    }
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      this.router.navigate([`/${this.auth.currentUser?.role}/dashboard`]);
      return false;
    }
    return true;
  }
}

// ── Theme Service (local only) ────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private dark = new BehaviorSubject<boolean>(false);
  isDark$ = this.dark.asObservable();

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') this.setDark(true);
  }

  toggle() { this.setDark(!this.dark.value); }
  get isDark() { return this.dark.value; }

  private setDark(val: boolean) {
    this.dark.next(val);
    document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light');
    localStorage.setItem('theme', val ? 'dark' : 'light');
  }
}
