import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/services';
import { Job, Application, User } from '../../../core/models/models';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  user: User = {} as User;
  recommendedJobs: Job[] = [];
  myApps: Application[] = [];
  appStats: any = { total:0, shortlisted:0, interview:0, hired:0 };
  loading = true;

  constructor(
    private auth:   AuthService,
    private jobSvc: JobService,
    private appSvc: ApplicationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.auth.currentUser!;

    // Real API: recommended jobs
    this.jobSvc.getRecommendations(4).subscribe({
      next: jobs => { this.recommendedJobs = jobs; this.loading = false; },
      error: () => {
        // Fallback: load active jobs if recommendations fail
        this.jobSvc.getJobs({ status: 'active' }).subscribe(jobs => {
          this.recommendedJobs = jobs.slice(0, 4);
          this.loading = false;
        });
      }
    });

    // Real API: my applications
    this.appSvc.getApplications({ employeeId: this.user.id }).subscribe(apps => {
      this.myApps = apps.slice(0, 4);
      this.appStats = {
        total:       apps.length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        interview:   apps.filter(a => a.status === 'interview').length,
        hired:       apps.filter(a => a.status === 'hired').length
      };
    });
  }

  statusClass(s: string): string {
    const m: Record<string,string> = {
      applied:'badge-applied', shortlisted:'badge-shortlisted',
      interview:'badge-interview', rejected:'badge-rejected', hired:'badge-hired'
    };
    return m[s] || '';
  }

  fmtDate(d: string): string {
    return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  }

  get initials(): string {
    return (this.user?.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }
  get greeting(): string {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }
  get department(): string { return this.user?.department || 'Your Department'; }
  get location():   string { return this.user?.location   || 'Remote'; }
}
