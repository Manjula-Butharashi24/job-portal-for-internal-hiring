import { Component } from '@angular/core';

@Component({
  selector: 'app-hr-layout',
  template: `
  <div class="app-layout">
    <app-sidebar [collapsed]="sidebarCollapsed"></app-sidebar>
    <div class="app-content" [class.sidebar-collapsed]="sidebarCollapsed">
      <app-navbar (toggleSidebar)="sidebarCollapsed=!sidebarCollapsed"></app-navbar>
      <main class="page-wrapper fade-in">
        <router-outlet></router-outlet>
      </main>
    </div>
  </div>`
})
export class HrLayoutComponent {
  sidebarCollapsed = false;
}
