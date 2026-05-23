import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { ToastService } from '../../../core/services/services';
import { Job } from '../../../core/models/models';

@Component({
  selector:    'app-hr-jobs',
  templateUrl: './hr-jobs.component.html',
  styleUrls:   ['./hr-jobs.component.css']
})
export class HrJobsComponent implements OnInit {
  jobs:         Job[] = [];
  filteredJobs: Job[] = [];
  loading  = true;
  deleting = false;

  // Filters
  search       = '';
  filterStatus = '';
  filterDept   = '';
  departments: string[] = [];

  // Pagination
  page     = 1;
  pageSize = 6;

  // Modal
  showModal   = false;
  editingJob: Job | null = null;
  form!: FormGroup;
  saving     = false;
  skillInput = '';
  skills: string[] = [];

  // Confirm delete
  showConfirm = false;
  jobToDelete: Job | null = null;

  // Sort
  sortField = 'createdAt';
  sortDir   = 'desc';

  constructor(private jobSvc: JobService, private toast: ToastService, private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.jobSvc.getJobs().subscribe({
      next: jobs => {
        this.jobs        = jobs;
        this.departments = [...new Set(jobs.map(j => j.department))].filter(Boolean);
        this.applyFilters();
        this.loading = false;
      },
      error: err => {
        this.toast.error('Failed to load jobs');
        this.loading = false;
      }
    });
  }

  initForm(job?: Job) {
    this.form = this.fb.group({
      title:        [job?.title       || '', Validators.required],
      department:   [job?.department  || '', Validators.required],
      location:     [job?.location    || '', Validators.required],
      type:         [job?.type        || 'full-time'],
      salary:       [job?.salary      || ''],
      status:       [job?.status      || 'active'],
      description:  [job?.description || '', [Validators.required, Validators.minLength(50)]],
      requirements: [job?.requirements|| '',  Validators.required]
    });
    this.skills = job?.skills ? [...job.skills] : [];
  }

  applyFilters() {
    let d = [...this.jobs];
    if (this.search)       d = d.filter(j => j.title.toLowerCase().includes(this.search.toLowerCase()) ||
                                             (j.department||'').toLowerCase().includes(this.search.toLowerCase()));
    if (this.filterStatus) d = d.filter(j => j.status === this.filterStatus);
    if (this.filterDept)   d = d.filter(j => j.department === this.filterDept);

    // Sort
    d.sort((a, b) => {
      const va = (a as any)[this.sortField] || '';
      const vb = (b as any)[this.sortField] || '';
      return this.sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

    this.filteredJobs = d;
    this.page = 1;
  }

  get paginatedJobs() {
    return this.filteredJobs.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }
  get totalPages() { return Math.ceil(this.filteredJobs.length / this.pageSize); }
  get pages()      { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  openCreate() { this.editingJob = null; this.initForm(); this.showModal = true; }
  openEdit(job: Job) { this.editingJob = job; this.initForm(job); this.showModal = true; }

  addSkill() {
    const s = this.skillInput.trim();
    if (s && !this.skills.includes(s)) this.skills.push(s);
    this.skillInput = '';
  }
  removeSkill(i: number) { this.skills.splice(i, 1); }
  onSkillKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); this.addSkill(); }
  }

  saveJob() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = { ...this.form.value, skills: this.skills };

    const op$ = this.editingJob
      ? this.jobSvc.updateJob(this.editingJob.id, payload)
      : this.jobSvc.createJob(payload);

    op$.subscribe({
      next: () => {
        this.toast.success(this.editingJob ? 'Job updated!' : 'Job posted successfully!');
        this.showModal = false;
        this.saving    = false;
        this.loadJobs();
      },
      error: err => {
        this.toast.error(err?.error?.message || 'Failed to save job');
        this.saving = false;
      }
    });
  }

  confirmDelete(job: Job) { this.jobToDelete = job; this.showConfirm = true; }

  deleteJob() {
    if (!this.jobToDelete) return;
    this.deleting = true;
    const id   = this.jobToDelete.id;
    const name = this.jobToDelete.title;

    this.jobSvc.deleteJob(id).subscribe({
      next: () => {
        this.toast.success(`"${name}" removed successfully`);
        this.showConfirm = false;
        this.deleting    = false;
        this.jobToDelete = null;
        // Remove from local array immediately — no full reload needed
        this.jobs        = this.jobs.filter(j => j.id !== id);
        this.applyFilters();
      },
      error: err => {
        this.toast.error(err?.error?.message || 'Failed to delete job');
        this.showConfirm = false;
        this.deleting    = false;
      }
    });
  }

  sort(field: string) {
    if (this.sortField === field) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    else { this.sortField = field; this.sortDir = 'asc'; }
    this.applyFilters();
  }

  sortIcon(field: string) {
    if (this.sortField !== field) return 'bi-chevron-expand';
    return this.sortDir === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down';
  }

  statusClass(s: string) {
    return s === 'active' ? 'badge-active' : s === 'draft' ? 'badge-draft' : 'badge-closed';
  }

  fmtDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  }
}
