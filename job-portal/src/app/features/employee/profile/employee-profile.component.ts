import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService, ToastService } from '../../../core/services/services';
import { User } from '../../../core/models/models';

@Component({ selector: 'app-employee-profile', templateUrl: './employee-profile.component.html' })
export class EmployeeProfileComponent implements OnInit {
  user: User   = {} as User;
  form!: FormGroup;
  saving       = false;
  skillInput   = '';
  skills: string[] = [];
  activeTab    = 'profile';

  appTimeline = [
    { role: 'Senior Frontend Engineer',  status: 'shortlisted', date: 'Nov 5, 2024' },
    { role: 'Backend Node.js Developer', status: 'applied',     date: 'Nov 6, 2024' }
  ];

  constructor(private auth: AuthService, private userSvc: UserService,
              private toast: ToastService, private fb: FormBuilder) {}

  ngOnInit() {
    this.user   = this.auth.currentUser!;
    this.skills = [...(this.user.skills || [])];
    this.form   = this.fb.group({
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

  saveSkills() {
    this.saving = true;
    const existing = this.user.skills || [];
    const toAdd    = this.skills.filter(s => !existing.includes(s));
    const ops      = toAdd.map(s => this.userSvc.addSkill(s).toPromise().catch(() => null));
    Promise.all(ops).then(() => {
      // Persist updated skills list in localStorage so sidebar & avatar reflect changes
      this.user = { ...this.user, skills: this.skills };
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        localStorage.setItem('currentUser', JSON.stringify({ ...JSON.parse(stored), skills: this.skills }));
      }
      this.toast.success('Skills saved successfully!');
      this.saving = false;
    });
  }

  addSkill()    { const s = this.skillInput.trim(); if (s && !this.skills.includes(s)) this.skills.push(s); this.skillInput = ''; }
  removeSkill(i: number) { this.skills.splice(i, 1); }
  onSkillKey(e: KeyboardEvent) { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); this.addSkill(); } }

  statusClass(s: string): string {
    const m: Record<string,string> = { applied:'badge-applied', shortlisted:'badge-shortlisted', interview:'badge-interview' };
    return m[s] || '';
  }

  get initials(): string {
    return (this.user?.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }
}
