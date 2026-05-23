import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HrLayoutComponent } from './hr-layout.component';
import { HrDashboardComponent } from './dashboard/hr-dashboard.component';
import { HrJobsComponent } from './jobs/hr-jobs.component';
import { HrApplicationsComponent } from './applications/hr-applications.component';
import { HrProfileComponent } from './profile/hr-profile.component';

const routes: Routes = [
  {
    path: '', component: HrLayoutComponent,
    children: [
      { path: 'dashboard',    component: HrDashboardComponent },
      { path: 'jobs',         component: HrJobsComponent },
      { path: 'applications', component: HrApplicationsComponent },
      { path: 'profile',      component: HrProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    HrLayoutComponent,
    HrDashboardComponent,
    HrJobsComponent,
    HrApplicationsComponent,
    HrProfileComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class HrModule {}
