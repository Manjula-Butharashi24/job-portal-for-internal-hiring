// toast.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastService, Toast } from '../../../core/services/services';

@Component({
  selector: 'app-toast',
  template: `
  <div class="toast-container">
    <div *ngFor="let t of toasts" class="toast-item" [class]="t.type">
      <i class="bi" [class.bi-check-circle-fill]="t.type==='success'"
         [class.bi-x-circle-fill]="t.type==='error'"
         [class.bi-info-circle-fill]="t.type==='info'"
         [class.bi-exclamation-triangle-fill]="t.type==='warning'"></i>
      <span style="flex:1; font-size:13px; color:var(--text-primary)">{{ t.message }}</span>
      <button style="background:none;border:none;cursor:pointer;color:var(--text-muted)" (click)="remove(t.id)">
        <i class="bi bi-x"></i>
      </button>
    </div>
  </div>`
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];
  constructor(private svc: ToastService) {}
  ngOnInit() { this.svc.toasts$.subscribe(t => this.toasts = t); }
  remove(id: string) { this.svc.remove(id); }
}

// spinner.component.ts
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const spinnerState = new BehaviorSubject<boolean>(false);

@Component({
  selector: 'app-spinner',
  template: `
  <div class="spinner-overlay" *ngIf="loading">
    <div>
      <div class="spinner"></div>
    </div>
  </div>`
})
export class SpinnerComponent {
  loading = false;
  ngOnInit() { spinnerState.subscribe(s => this.loading = s); }
}

// confirm-dialog.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
  <div class="modal-backdrop-custom" *ngIf="visible" (click)="onCancel()">
    <div class="confirm-box" (click)="$event.stopPropagation()">
      <div class="confirm-icon" [class]="type">
        <i class="bi" [class.bi-trash3]="type==='danger'" [class.bi-exclamation-triangle]="type==='warning'" [class.bi-question-circle]="type==='info'"></i>
      </div>
      <h5>{{ title }}</h5>
      <p>{{ message }}</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:20px">
        <button class="btn btn-ghost btn-md" (click)="onCancel()">Cancel</button>
        <button class="btn btn-md" [class.btn-danger]="type==='danger'" [class.btn-primary]="type!=='danger'" (click)="onConfirm()">{{ confirmLabel }}</button>
      </div>
    </div>
  </div>`,
  styles: [`
    .modal-backdrop-custom {
      position: fixed; inset:0;
      background: rgba(0,0,0,.5);
      display:flex; align-items:center; justify-content:center;
      z-index: 9990; backdrop-filter: blur(4px);
    }
    .confirm-box {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 36px 32px;
      max-width: 400px; width:100%;
      text-align:center;
      box-shadow: var(--shadow-lg);
      animation: fadeIn 0.25s ease;
    }
    .confirm-icon {
      width:64px; height:64px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      font-size:26px; margin:0 auto 16px;
    }
    .confirm-icon.danger  { background:#fee2e2; color:var(--danger); }
    .confirm-icon.warning { background:#fef3c7; color:var(--warning); }
    .confirm-icon.info    { background:var(--primary-light); color:var(--primary); }
    h5 { font-size:18px; margin-bottom:8px; }
    p  { color:var(--text-secondary); font-size:14px; }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() type: 'danger' | 'warning' | 'info' = 'danger';
  @Input() confirmLabel = 'Confirm';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() { this.confirmed.emit(); this.visible = false; }
  onCancel()  { this.cancelled.emit(); this.visible = false; }
}
