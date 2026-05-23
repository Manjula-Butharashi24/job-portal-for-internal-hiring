import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService, ToastService } from '../../../core/services/services';
import { User } from '../../../core/models/models';

@Component({ selector: 'app-hr-profile', templateUrl: './hr-profile.component.html' })
export class HrProfileComponent implements OnInit {
  user: User = {} as User;
  form!: FormGroup;
  saving = false;

  stats = [
    { label: 'Jobs Posted',           value: '24',  icon: 'bi-briefcase',   color: 'var(--primary)' },
    { label: 'Applications Reviewed', value: '138', icon: 'bi-file-person', color: 'var(--success)' },
    { label: 'Candidates Hired',      value: '12',  icon: 'bi-trophy',      color: 'var(--warning)' },
    { label: 'Avg. Time to Hire',     value: '18d', icon: 'bi-clock',       color: 'var(--info)'    }
  ];

  constructor(private auth: AuthService, private userSvc: UserService,
              private toast: ToastService, private fb: FormBuilder) {}

  ngOnInit() {
    this.user = this.auth.currentUser!;
    this.form = this.fb.group({
      name:       [this.user.name,        Validators.required],
      email:      [this.user.email,       [Validators.required, Validators.email]],
      phone:      [this.user.phone       || ''],
      location:   [this.user.location    || ''],
      department: [this.user.department  || '']
    });
  }

  saveProfile() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.userSvc.updateProfile(this.form.value).subscribe({
      next: () => { this.toast.success('Profile updated!'); this.saving = false; },
      error: err => { this.toast.error(err?.error?.message || 'Update failed'); this.saving = false; }
    });
  }

  get initials(): string {
    return (this.user?.name || 'H').split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }
}
