import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeLayoutComponent }     from './employee-layout.component';
import { EmployeeDashboardComponent }  from './dashboard/employee-dashboard.component';
import { EmployeeJobsComponent }       from './jobs/employee-jobs.component';
import { EmployeeApplicationsComponent } from './applications/employee-applications.component';
import { EmployeeProfileComponent }    from './profile/employee-profile.component';

const routes: Routes = [
  {
    path: '', component: EmployeeLayoutComponent,
    children: [
      { path: 'dashboard',    component: EmployeeDashboardComponent },
      { path: 'jobs',         component: EmployeeJobsComponent },
      { path: 'applications', component: EmployeeApplicationsComponent },
      { path: 'profile',      component: EmployeeProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [
    EmployeeLayoutComponent,
    EmployeeDashboardComponent,
    EmployeeJobsComponent,
    EmployeeApplicationsComponent,
    EmployeeProfileComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class EmployeeModule {}
