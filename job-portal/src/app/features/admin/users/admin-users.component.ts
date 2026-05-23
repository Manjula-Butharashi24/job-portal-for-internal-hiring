import { Component, OnInit } from '@angular/core';
import { UserService, ToastService } from '../../../core/services/services';
import { User, Role } from '../../../core/models/models';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filtered: User[] = [];
  loading = true;
  search = '';
  filterRole: string = '';
  filterStatus: string = '';
  page = 1;
  pageSize = 8;

  showConfirm = false;
  userToDelete: User | null = null;

  showEditModal = false;
  editingUser: User | null = null;
  editRole: Role = 'employee';
  editStatus: string = 'active';

  roles: Role[] = ['admin', 'hr', 'employee'];

  constructor(private userSvc: UserService, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.userSvc.getUsers().subscribe(u => {
      this.users = u;
      this.applyFilters();
      this.loading = false;
    });
  }

  applyFilters() {
    let d = [...this.users];
    if (this.search)       d = d.filter(u => u.name.toLowerCase().includes(this.search.toLowerCase()) || u.email.toLowerCase().includes(this.search.toLowerCase()));
    if (this.filterRole)   d = d.filter(u => u.role === this.filterRole);
    if (this.filterStatus) d = d.filter(u => u.status === this.filterStatus);
    this.filtered = d;
    this.page = 1;
  }

  get paginated() { return this.filtered.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }
  get totalPages() { return Math.ceil(this.filtered.length / this.pageSize); }
  get pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  openEdit(u: User) {
    this.editingUser = u;
    this.editRole = u.role;
    this.editStatus = u.status;
    this.showEditModal = true;
  }

  saveEdit() {
    if (!this.editingUser) return;
    this.userSvc.updateUser(this.editingUser.id, { role: this.editRole, status: this.editStatus as any }).subscribe(() => {
      this.toast.success('User updated successfully.');
      this.showEditModal = false;
      this.load();
    });
  }

  confirmDelete(u: User) {
    if (u.role === 'admin') { this.toast.warning('Cannot delete admin accounts.'); return; }
    this.userToDelete = u;
    this.showConfirm = true;
  }

  deleteUser() {
    if (!this.userToDelete) return;
    this.userSvc.deleteUser(this.userToDelete.id).subscribe(() => {
      this.toast.success('User deactivated successfully.');
      this.showConfirm = false;
      this.load();
    });
  }

  roleClass(r: string) { return `badge-${r}`; }
  statusClass(s: string) { return s === 'active' ? 'badge-active' : 'badge-closed'; }
  fmtDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  get initials() { return (n: string) => n.split(' ').map(x => x[0]).join('').toUpperCase(); }
}
