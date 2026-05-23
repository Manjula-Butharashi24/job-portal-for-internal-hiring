import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService, ToastService } from '../../../core/services/services';
import { Application, User } from '../../../core/models/models';

@Component({
  selector: 'app-employee-applications',
  templateUrl: './employee-applications.component.html'
})
export class EmployeeApplicationsComponent implements OnInit {
  user!: User;
  applications: Application[] = [];
  filtered: Application[] = [];
  filterStatus = '';
  loading = true;
  confirmVisible = false;
  appToDelete: Application | null = null;

  statuses = ['applied','shortlisted','interview','rejected','hired'];

  constructor(private auth: AuthService, private appSvc: ApplicationService, private toast: ToastService) {}

  ngOnInit() {
    this.user = this.auth.currentUser!;
    this.appSvc.getApplications({ employeeId: this.user.id }).subscribe(apps => {
      this.applications = apps;
      this.applyFilter();
      this.loading = false;
    });
  }

  applyFilter() {
    this.filtered = this.filterStatus
      ? this.applications.filter(a => a.status === this.filterStatus)
      : [...this.applications];
  }

  confirmDelete(app: Application) { this.appToDelete = app; this.confirmVisible = true; }

  deleteApp() {
    if (!this.appToDelete) return;
    this.appSvc.deleteApplication(this.appToDelete.id).subscribe(() => {
      this.applications = this.applications.filter(a => a.id !== this.appToDelete!.id);
      this.applyFilter();
      this.toast.success('Application withdrawn.');
      this.confirmVisible = false;
    });
  }

  statusClass(s: string) {
    const m: any = { applied:'badge-applied', shortlisted:'badge-shortlisted', interview:'badge-interview', rejected:'badge-rejected', hired:'badge-hired' };
    return m[s] || '';
  }

  isPastStep(currentStatus: string, step: string): boolean {
    const order = ["applied","shortlisted","interview","hired"];
    const ci = order.indexOf(currentStatus);
    const si = order.indexOf(step);
    return ci > si;
  }

  statusIcon(s: string) {
    const m: any = { applied:'bi-send', shortlisted:'bi-bookmark-star', interview:'bi-camera-video', rejected:'bi-x-circle', hired:'bi-trophy' };
    return m[s] || 'bi-circle';
  }

  fmtDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }); }
}

// added missing method - needed by template
