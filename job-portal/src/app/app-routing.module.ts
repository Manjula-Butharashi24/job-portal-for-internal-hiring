import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from './core/guards/guards';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [GuestGuard],
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'hr',
    canActivate: [AuthGuard],
    data: { roles: ['hr'] },
    loadChildren: () => import('./features/hr/hr.module').then(m => m.HrModule)
  },
  {
    path: 'employee',
    canActivate: [AuthGuard],
    data: { roles: ['employee'] },
    loadChildren: () => import('./features/employee/employee.module').then(m => m.EmployeeModule)
  },
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
