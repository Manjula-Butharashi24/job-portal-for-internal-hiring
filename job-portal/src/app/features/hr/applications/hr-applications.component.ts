import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../../core/services/services';
import { JobService } from '../../../core/services/job.service';
import { ToastService } from '../../../core/services/services';
import { Application, AppStatus, Job } from '../../../core/models/models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hr-applications',
  templateUrl: './hr-applications.component.html'
})
export class HrApplicationsComponent implements OnInit {
  applications: Application[] = [];
  filtered:     Application[] = [];
  jobs:         Job[]         = [];
  loading = true;

  search       = '';
  filterStatus = '';
  filterJob    = '';
  page         = 1;
  pageSize     = 8;

  statuses: AppStatus[] = ['applied', 'shortlisted', 'interview', 'rejected', 'hired'];
  stats: any = { applied:0, shortlisted:0, interview:0, hired:0 };

  constructor(
    private appSvc: ApplicationService,
    private jobSvc: JobService,
    private toast:  ToastService
  ) {}

  ngOnInit() {
    // Load stats
    this.appSvc.getStats().subscribe({ next: s => this.stats = s, error: () => {} });

    // Load all applications (HR sees all)
    this.appSvc.getApplications().subscribe(apps => {
      this.applications = apps;
      this.applyFilters();
      this.loading = false;
    });

    // Load jobs for filter dropdown
    this.jobSvc.getJobs().subscribe(j => this.jobs = j);
  }

  applyFilters() {
    let d = [...this.applications];
    if (this.search) {
      const kw = this.search.toLowerCase();
      d = d.filter(a =>
        (a.employeeName || '').toLowerCase().includes(kw) ||
        (a.jobTitle     || '').toLowerCase().includes(kw)
      );
    }
    if (this.filterStatus) d = d.filter(a => a.status === this.filterStatus);
    if (this.filterJob)    d = d.filter(a => a.jobId  === this.filterJob);
    this.filtered = d;
    this.page = 1;
  }

  get paginated() {
    return this.filtered.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }
  get totalPages() { return Math.ceil(this.filtered.length / this.pageSize); }
  get pages()      { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  updateStatus(app: Application, status: AppStatus) {
    this.appSvc.updateStatus(app.id, status).subscribe({
      next: () => {
        app.status = status;
        this.toast.success(`Status updated to "${status}"`);
        this.appSvc.getStats().subscribe(s => this.stats = s);
      },
      error: err => this.toast.error(err?.error?.message || 'Failed to update status')
    });
  }

  // Build the full URL to view/download the resume
  getResumeUrl(resumePath: string): string {
    if (!resumePath) return '#';
    // If it's already a full URL, return as-is
    if (resumePath.startsWith('http')) return resumePath;
    // Strip leading src/ if present and build backend URL
    const clean = resumePath.replace(/^src\//, '');
    return `${environment.apiUrl.replace('/api', '')}/${clean}`;
  }

  statusClass(s: string): string {
    const m: Record<string, string> = {
      applied: 'badge-applied', shortlisted: 'badge-shortlisted',
      interview: 'badge-interview', rejected: 'badge-rejected', hired: 'badge-hired'
    };
    return m[s] || '';
  }

  fmtDate(d: string): string {
    return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  }
}
