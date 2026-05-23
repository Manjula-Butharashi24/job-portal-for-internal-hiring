import { Component, OnInit } from '@angular/core';
import { ToastService, Toast } from '../../../core/services/services';

@Component({
  selector: 'app-toast',
  template: `
  <div class="toast-container">
    <div *ngFor="let t of toasts" class="toast-item" [class]="t.type">
      <i class="bi"
         [class.bi-check-circle-fill]="t.type==='success'"
         [class.bi-x-circle-fill]="t.type==='error'"
         [class.bi-info-circle-fill]="t.type==='info'"
         [class.bi-exclamation-triangle-fill]="t.type==='warning'"
         style="font-size:18px;flex-shrink:0"></i>
      <span style="flex:1;font-size:13px;font-weight:500;color:var(--text-primary)">{{ t.message }}</span>
      <button style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:0;font-size:16px;display:flex;align-items:center" (click)="remove(t.id)">
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
