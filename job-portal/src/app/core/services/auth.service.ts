import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginPayload } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  // Callback that NotificationService registers so we can reload it after login
  private onLoginCallback: (() => void) | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  /** NotificationService calls this to register a reload hook */
  registerLoginCallback(fn: () => void) { this.onLoginCallback = fn; }

  // POST /api/auth/login
  login(payload: LoginPayload): Observable<any> {
    return this.http.post<any>(`${this.base}/login`, payload).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem('accessToken',  res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          localStorage.setItem('currentUser',  JSON.stringify(res.data.user));
          this.currentUserSubject.next(res.data.user);
          // Reload notifications for the newly logged-in user
          if (this.onLoginCallback) this.onLoginCallback();
        }
      })
    );
  }

  // POST /api/auth/logout
  logout(): void {
    this.http.post(`${this.base}/logout`, {
      refreshToken: localStorage.getItem('refreshToken')
    }).subscribe();
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // GET /api/auth/me
  getMe(): Observable<any> {
    return this.http.get<any>(`${this.base}/me`).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem('currentUser', JSON.stringify(res.data));
          this.currentUserSubject.next(res.data);
        }
      })
    );
  }

  // PUT /api/auth/change-password
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.base}/change-password`, { currentPassword, newPassword });
  }

  get currentUser(): User | null { return this.currentUserSubject.value; }
  isAuthenticated(): boolean     { return !!localStorage.getItem('accessToken'); }
  hasRole(...roles: string[]): boolean { return roles.includes(this.currentUser?.role || ''); }
  getToken(): string | null      { return localStorage.getItem('accessToken'); }

  private loadUser(): User | null {
    try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); }
    catch { return null; }
  }
}

// Note: NotificationService.clear() is called via the currentUser$ BehaviorSubject
// in AppComponent (when user becomes null on logout).
