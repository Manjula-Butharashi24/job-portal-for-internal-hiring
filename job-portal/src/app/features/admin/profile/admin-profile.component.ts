import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService, ToastService } from '../../../core/services/services';
import { User } from '../../../core/models/models';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html'
})
export class AdminProfileComponent implements OnInit {
  user: User = {} as User;
  form!: FormGroup;
  saving    = false;
  activeTab = 'profile';

  systemInfo = [
    { label: 'Last Login',       value: 'Today, 09:42 AM' },
    { label: 'Sessions Active',  value: '1'               },
    { label: 'Account Created',  value: 'Jan 15, 2022'    },
    { label: 'Password Changed', value: '30 days ago'     },
    { label: 'MFA Status',       value: 'Enabled'         },
    { label: 'API Access',       value: 'Full Access'      }
  ];

  recentActivity = [
    { action: 'Updated HR user Sarah Chen role',       time: '2h ago', icon: 'bi-pencil'      },
    { action: 'Deactivated user Marcus Lee',            time: '1d ago', icon: 'bi-person-x'    },
    { action: 'Reviewed system audit log',              time: '2d ago', icon: 'bi-shield-check' },
    { action: 'Reset password for user Emily Davis',    time: '3d ago', icon: 'bi-key'          }
  ];

  constructor(
    private auth:    AuthService,
    private userSvc: UserService,
    private toast:   ToastService,
    private fb:      FormBuilder
  ) {}

  ngOnInit() {
    this.user = this.auth.currentUser!;
    this.form = this.fb.group({
      name:     [this.user.name,     Validators.required],
      email:    [this.user.email,    [Validators.required, Validators.email]],
      phone:    [this.user.phone    || ''],
      location: [this.user.location || '']
    });
  }

  saveProfile() {
    if (this.form.invalid) return;
    this.saving = true;
    this.userSvc.updateUser(this.user.id, this.form.value)
      .subscribe(() => { this.toast.success('Profile updated!'); this.saving = false; });
  }

  get initials(): string {
    return (this.user?.name || 'A').split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }
}
