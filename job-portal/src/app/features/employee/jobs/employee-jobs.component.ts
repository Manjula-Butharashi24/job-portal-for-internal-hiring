import { Component, OnInit } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService, ToastService } from '../../../core/services/services';
import { AuthService } from '../../../core/services/auth.service';
import { Job, Application, User } from '../../../core/models/models';

@Component({
  selector: 'app-employee-jobs',
  templateUrl: './employee-jobs.component.html',
  styleUrls:   ['./employee-jobs.component.css']
})
export class EmployeeJobsComponent implements OnInit {
  jobs:         Job[]          = [];
  filtered:     Job[]          = [];
  myAppJobIds:  Set<string>    = new Set();
  selectedJob:  Job | null     = null;
  user!:        User;
  loading       = false;
  applying      = false;

  search       = '';
  filterDept   = '';
  filterLoc    = '';
  filterType   = '';

  departments: string[] = [];
  locations:   string[] = [];

  page     = 1;
  pageSize = 9;

  constructor(
    private jobSvc: JobService,
    private appSvc: ApplicationService,
    private auth:   AuthService,
    private toast:  ToastService
  ) {}

  ngOnInit() {
    this.user = this.auth.currentUser!;
    this.loading = true;

    // Load active jobs
    this.jobSvc.getJobs({ status: 'active' }).subscribe({
      next: jobs => {
        this.jobs  = jobs;
        this.departments = [...new Set(jobs.map(j => j.department))].filter(Boolean);
        this.locations   = [...new Set(jobs.map(j => j.location))].filter(Boolean);
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    // Load which jobs this employee has already applied to
    this.appSvc.getApplications({ employeeId: this.user.id }).subscribe(apps => {
      this.myAppJobIds = new Set(apps.map(a => a.jobId));
    });
  }

  applyFilters() {
    let d = [...this.jobs];
    if (this.search) {
      const kw = this.search.toLowerCase();
      d = d.filter(j =>
        j.title.toLowerCase().includes(kw) ||
        (j.department || '').toLowerCase().includes(kw) ||
        j.skills.some(s => s.toLowerCase().includes(kw))
      );
    }
    if (this.filterDept) d = d.filter(j => j.department === this.filterDept);
    if (this.filterLoc)  d = d.filter(j => j.location   === this.filterLoc);
    if (this.filterType) d = d.filter(j => j.type        === this.filterType);
    this.filtered = d;
    this.page = 1;
  }

  get paginated() {
    return this.filtered.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }
  get totalPages() { return Math.ceil(this.filtered.length / this.pageSize); }
  get pages()      { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  openDetail(job: Job) { this.selectedJob = job; }
  closeDetail()        { this.selectedJob = null; }

  hasApplied(jobId: string): boolean { return this.myAppJobIds.has(jobId); }

  applyJob(job: Job) {
    if (this.hasApplied(job.id) || this.applying) return;
    this.applying = true;

    this.appSvc.apply(job.id, job.title, this.user.id, this.user.name, this.user.email).subscribe({
      next: () => {
        this.myAppJobIds.add(job.id);
        this.applying = false;
        this.toast.success(`Applied for "${job.title}" successfully!`);
        this.closeDetail();
      },
      error: err => {
        this.applying = false;
        const msg = err?.message || err?.error?.message || 'Application failed. Please try again.';
        this.toast.error(msg);
      }
    });
  }

  resetFilters() {
    this.search = ''; this.filterDept = ''; this.filterLoc = ''; this.filterType = '';
    this.applyFilters();
  }

  fmtDate(d: string): string {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
