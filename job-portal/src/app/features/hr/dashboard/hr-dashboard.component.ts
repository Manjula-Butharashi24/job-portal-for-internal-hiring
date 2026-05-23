import { Component, OnInit } from '@angular/core';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/services';
import { Job, Application } from '../../../core/models/models';

@Component({
  selector: 'app-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {
  jobStats: any = { total:0, active:0, closed:0, draft:0, totalApps:0 };
  appStats: any = { total:0, applied:0, shortlisted:0, interview:0, hired:0, rejected:0 };
  recentJobs: Job[] = [];
  recentApps: Application[] = [];
  loading = true;

  trendLabels = ['Aug','Sep','Oct','Nov','Dec','Jan'];
  appsTrend   = [12, 18, 14, 26, 22, 30];
  hiredTrend  = [3,  4,  5,  8,  7,  10];
  deptData    = [
    { dept:'Engineering', count:14, pct:47 },
    { dept:'Design',      count:6,  pct:20 },
    { dept:'Analytics',   count:5,  pct:17 },
    { dept:'HR',          count:3,  pct:10 },
    { dept:'Other',       count:2,  pct:6  }
  ];

  constructor(private jobSvc: JobService, private appSvc: ApplicationService) {}

  ngOnInit() {
    // Load real stats from API
    this.jobSvc.getStats().subscribe({
      next: s => this.jobStats = s,
      error: () => {}
    });

    this.appSvc.getStats().subscribe({
      next: s => this.appStats = s,
      error: () => {}
    });

    this.jobSvc.getJobs().subscribe(jobs => {
      this.recentJobs = jobs.slice(0, 4);
      this.loading    = false;
    });

    this.appSvc.getApplications().subscribe(apps => {
      this.recentApps = apps.slice(0, 5);
    });
  }

  statusClass(s: string) {
    const m: Record<string,string> = {
      applied:'badge-applied', shortlisted:'badge-shortlisted',
      interview:'badge-interview', rejected:'badge-rejected', hired:'badge-hired'
    };
    return m[s] || '';
  }

  jobStatusClass(s: string) {
    return s === 'active' ? 'badge-active' : s === 'draft' ? 'badge-draft' : 'badge-closed';
  }

  fmtDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  }
}
