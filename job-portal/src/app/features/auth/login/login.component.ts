import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  loading      = false;
  error        = '';
  showPassword = false;

  // Features shown on the left panel
  features = [
    { icon: 'bi-briefcase', text: 'Discover internal openings tailored for you'  },
    { icon: 'bi-shield-check', text: 'Role-based access for Admin, HR & Employees' },
    { icon: 'bi-graph-up-arrow', text: 'Track every application in real-time'      }
  ];

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error   = '';

    this.auth.login(this.form.value).subscribe({
      next: res => {
        this.loading = false;
        const user = res.data?.user || res.user;
        if (user?.role) {
          this.router.navigate([`/${user.role}/dashboard`]);
        }
      },
      error: err => {
        this.loading = false;
        this.error = err?.message || err?.error?.message || 'Invalid email or password. Please try again.';
      }
    });
  }

  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
}
