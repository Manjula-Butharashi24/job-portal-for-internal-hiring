import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SidebarComponent }       from './components/sidebar/sidebar.component';
import { NavbarComponent }         from './components/navbar/navbar.component';
import { ToastComponent }          from './components/toast/toast.component';
import { SpinnerComponent }        from './components/spinner/spinner.component';
import { ConfirmDialogComponent }  from './components/confirm-dialog/confirm-dialog.component';
import { MinPipe, FilterByStatusPipe } from './pipes/shared.pipes';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    ToastComponent,
    SpinnerComponent,
    ConfirmDialogComponent,
    MinPipe,
    FilterByStatusPipe
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SidebarComponent,
    NavbarComponent,
    ToastComponent,
    SpinnerComponent,
    ConfirmDialogComponent,
    MinPipe,
    FilterByStatusPipe
  ]
})
export class SharedModule {}
