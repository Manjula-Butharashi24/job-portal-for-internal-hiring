import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/services';
import { JobService }  from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/services';
import { User } from '../../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  userStats: any = { total:0, active:0, admins:0, hrs:0, employees:0 };
  jobStats:  any = { total:0, active:0, closed:0, draft:0 };
  appStats:  any = { total:0, hired:0 };
  recentUsers: User[] = [];
  loading = true;

  systemHealth = [
    { label:'API Response',    value:'< 200ms', status:'good', icon:'bi-lightning'   },
    { label:'DB Uptime',       value:'99.9%',   status:'good', icon:'bi-database'    },
    { label:'Active Sessions', value:'—',       status:'good', icon:'bi-people'      },
    { label:'Error Rate',      value:'0.1%',    status:'good', icon:'bi-bug'         }
  ];

  growthData = [
    { month:'Aug', users:45 },{ month:'Sep', users:52 },
    { month:'Oct', users:61 },{ month:'Nov', users:58 },
    { month:'Dec', users:74 },{ month:'Jan', users:89 }
  ];
  maxUsers = 89;

  constructor(
    private userSvc: UserService,
    private jobSvc:  JobService,
    private appSvc:  ApplicationService
  ) {}

  ngOnInit() {
    this.userSvc.getStats().subscribe({ next: s => this.userStats = s, error: () => {} });
    this.jobSvc.getStats().subscribe({  next: s => this.jobStats  = s, error: () => {} });
    this.appSvc.getStats().subscribe({  next: s => this.appStats  = s, error: () => {} });

    this.userSvc.getUsers().subscribe(users => {
      this.recentUsers = users.slice(0, 6);
      this.loading     = false;
    });
  }

  roleClass(r: string)   { return `badge-${r}`; }
  statusClass(s: string) { return s === 'active' ? 'badge-active' : 'badge-closed'; }
  fmtDate(d: string)     {
    return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  }
}
