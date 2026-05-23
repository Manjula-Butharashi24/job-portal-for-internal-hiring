import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const spinnerState = new BehaviorSubject<boolean>(false);

@Component({
  selector: 'app-spinner',
  template: `
  <div class="spinner-overlay" *ngIf="loading">
    <div class="spinner"></div>
  </div>`
})
export class SpinnerComponent implements OnInit {
  loading = false;
  ngOnInit() { spinnerState.subscribe(s => this.loading = s); }
}
