import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
  <div class="modal-backdrop-custom" *ngIf="visible" (click)="onCancel()">
    <div class="confirm-box" (click)="$event.stopPropagation()">
      <div class="confirm-icon" [class]="type">
        <i class="bi"
           [class.bi-trash3]="type==='danger'"
           [class.bi-exclamation-triangle]="type==='warning'"
           [class.bi-question-circle]="type==='info'"></i>
      </div>
      <h5>{{ title }}</h5>
      <p>{{ message }}</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:20px">
        <button class="btn btn-ghost btn-md" (click)="onCancel()">Cancel</button>
        <button class="btn btn-md"
          [class.btn-danger]="type==='danger'"
          [class.btn-primary]="type!=='danger'"
          (click)="onConfirm()">{{ confirmLabel }}</button>
      </div>
    </div>
  </div>`,
  styles: [`
    .modal-backdrop-custom {
      position:fixed;inset:0;background:rgba(0,0,0,.5);
      display:flex;align-items:center;justify-content:center;
      z-index:9990;backdrop-filter:blur(4px);
    }
    .confirm-box {
      background:var(--bg-card);border-radius:var(--radius-xl);
      padding:36px 32px;max-width:400px;width:100%;
      text-align:center;box-shadow:var(--shadow-lg);animation:fadeIn .25s ease;
    }
    .confirm-icon {
      width:64px;height:64px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:26px;margin:0 auto 16px;
    }
    .confirm-icon.danger  { background:#fee2e2;color:var(--danger); }
    .confirm-icon.warning { background:#fef3c7;color:var(--warning); }
    .confirm-icon.info    { background:var(--primary-light);color:var(--primary); }
    h5 { font-size:18px;margin-bottom:8px; }
    p  { color:var(--text-secondary);font-size:14px;line-height:1.6; }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() type: 'danger'|'warning'|'info' = 'danger';
  @Input() confirmLabel = 'Confirm';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  onConfirm() { this.confirmed.emit(); this.visible = false; }
  onCancel()  { this.cancelled.emit(); this.visible = false; }
}
