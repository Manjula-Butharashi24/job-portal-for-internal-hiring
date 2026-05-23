import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Application, AppStatus, Notification, User } from '../models/models';

// ── Application Service ───────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly base = `${environment.apiUrl}/applications`;
  constructor(private http: HttpClient) {}

  getApplications(filters?: {
    employeeId?: string; jobId?: string; status?: AppStatus; page?: number; limit?: number;
  }): Observable<Application[]> {
    const url = filters?.employeeId ? `${this.base}/my` : this.base;
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.jobId)  params = params.set('jobId',  filters.jobId!);
    params = params.set('limit', String(filters?.limit || 100));
    if (filters?.page) params = params.set('page', String(filters.page));
    return this.http.get<any>(url, { params }).pipe(
      map(res => (res.data || []).map((a: any) => this.mapApp(a)))
    );
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.base}/stats`).pipe(map(r => r.data || {}));
  }

  apply(jobId: string, jobTitle: string, employeeId: string, employeeName: string, employeeEmail: string): Observable<Application> {
    const form = new FormData();
    form.append('jobId', jobId);
    // Placeholder PDF blob — backend requires a file in the 'resume' field
    const blob = new Blob(
      [`Resume for ${employeeName} – Application for ${jobTitle}`],
      { type: 'application/pdf' }
    );
    form.append('resume', blob, `${employeeName.replace(/\s+/g,'_')}_CV.pdf`);
    return this.http.post<any>(this.base, form).pipe(map(res => this.mapApp(res.data)));
  }

  updateStatus(id: string, status: AppStatus, note?: string): Observable<Application> {
    return this.http.patch<any>(`${this.base}/${id}/status`, { status, note }).pipe(
      map(res => this.mapApp(res.data))
    );
  }

  deleteApplication(id: string): Observable<void> {
    return this.http.delete<any>(`${this.base}/${id}`).pipe(map(() => void 0));
  }

  private mapApp(a: any): Application {
    return {
      id:            a._id || a.id,
      jobId:         a.jobId?._id   || a.jobId   || '',
      jobTitle:      a.jobId?.title  || a.jobTitle || '',
      employeeId:    a.applicantId?._id  || a.applicantId  || '',
      employeeName:  a.applicantId?.name  || a.employeeName  || '',
      employeeEmail: a.applicantId?.email || a.employeeEmail || '',
      resumePath:    a.resumePath || '',
      status:        a.status,
      appliedAt:     a.createdAt || a.appliedAt,
      updatedAt:     a.updatedAt,
      coverLetter:   a.coverLetter || ''
    };
  }
}

// ── Notification Service ──────────────────────────────────────
// Loads notifications only for the currently authenticated user.
// Registers a reload hook with AuthService so notifications refresh on login.
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly base = `${environment.apiUrl}/notifications`;
  private notifs = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifs.asObservable();

  constructor(private http: HttpClient) {
    // Do NOT auto-load in constructor — wait until user is authenticated.
    // AuthService calls reload() after successful login via the callback.
    // If user is already logged in (page refresh), load immediately.
    if (localStorage.getItem('accessToken')) {
      this.load();
    }
  }

  /** Called by AuthService after login — loads notifications for the new user */
  reload() {
    // Clear previous user's notifications first
    this.notifs.next([]);
    this.load();
  }

  /** Called by AuthService on logout — clear notifications */
  clear() { this.notifs.next([]); }

  private load() {
    if (!localStorage.getItem('accessToken')) return;
    this.http.get<any>(this.base).subscribe({
      next: res => this.notifs.next(
        (res.data || []).map((n: any) => ({
          id:        n._id || n.id,
          title:     n.title,
          message:   n.message,
          type:      n.type,
          read:      n.isRead,
          createdAt: n.createdAt
        }))
      ),
      error: () => {}  // silently ignore auth errors
    });
  }

  get unreadCount(): number { return this.notifs.value.filter(n => !n.read).length; }

  markRead(id: string) {
    this.http.patch<any>(`${this.base}/${id}/read`, {}).subscribe(() => {
      this.notifs.next(this.notifs.value.map(n => n.id === id ? { ...n, read: true } : n));
    });
  }

  markAllRead() {
    this.http.patch<any>(`${this.base}/read-all`, {}).subscribe(() => {
      this.notifs.next(this.notifs.value.map(n => ({ ...n, read: true })));
    });
  }

  delete(id: string) {
    this.http.delete<any>(`${this.base}/${id}`).subscribe(() => {
      this.notifs.next(this.notifs.value.filter(n => n.id !== id));
    });
  }
}

// ── Toast Service ─────────────────────────────────────────────
export interface Toast {
  id: string; message: string;
  type: 'success'|'error'|'info'|'warning'; duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toasts.asObservable();
  show(msg: string, type: Toast['type'] = 'info', duration = 3500) {
    const t: Toast = { id: `t${Date.now()}`, message: msg, type, duration };
    this.toasts.next([...this.toasts.value, t]);
    setTimeout(() => this.remove(t.id), duration);
  }
  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string)   { this.show(msg, 'error');   }
  warning(msg: string) { this.show(msg, 'warning'); }
  remove(id: string)   { this.toasts.next(this.toasts.value.filter(t => t.id !== id)); }
}

// ── User Service ──────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly base = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getUsers(filters?: { role?: string; status?: string; search?: string; page?: number }): Observable<User[]> {
    let params = new HttpParams();
    if (filters?.role)   params = params.set('role',   filters.role);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    params = params.set('limit', '100');
    if (filters?.page) params = params.set('page', String(filters.page));
    return this.http.get<any>(this.base, { params }).pipe(
      map(res => (res.data || []).map((u: any) => this.mapUser(u)))
    );
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.base}/stats`).pipe(map(r => r.data || {}));
  }

  getUser(id: string): Observable<User> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.mapUser(r.data)));
  }

  getProfile(): Observable<User> {
    return this.http.get<any>(`${this.base}/profile`).pipe(map(r => this.mapUser(r.data)));
  }

  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http.put<any>(`${this.base}/profile`, updates).pipe(map(r => this.mapUser(r.data)));
  }

  updateUser(id: string, updates: Partial<User>): Observable<User> {
    const url = id === 'self' ? `${this.base}/profile` : `${this.base}/${id}`;
    return this.http.put<any>(url, updates).pipe(map(r => this.mapUser(r.data)));
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<any>(`${this.base}/${id}`).pipe(map(() => void 0));
  }

  addSkill(skillName: string, level = 'intermediate', years = 0): Observable<any> {
    return this.http.post<any>(`${this.base}/skills`, { skillName, level, years }).pipe(map(r => r.data));
  }

  removeSkill(skillId: string): Observable<void> {
    return this.http.delete<any>(`${this.base}/skills/${skillId}`).pipe(map(() => void 0));
  }

  uploadResume(file: File): Observable<any> {
    const form = new FormData();
    form.append('resume', file);
    return this.http.post<any>(`${this.base}/profile/resume`, form).pipe(map(r => r.data));
  }

  private mapUser(u: any): User {
    return {
      id:         u._id || u.id,
      name:       u.name,
      email:      u.email,
      role:       u.role,
      department: u.department,
      phone:      u.phone,
      location:   u.location,
      status:     u.status,
      joinedOn:   u.joinedOn || u.createdAt,
      skills:     (u.skills || []).map((s: any) => s.skillName || s),
      resumePath: u.resumePath
    };
  }
}
