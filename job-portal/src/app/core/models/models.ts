// ── user.model.ts ────────────────────────────────────────────
export type Role = 'admin' | 'hr' | 'employee';
export type UserStatus = 'active' | 'inactive' | 'locked';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  avatar?: string;
  joinedOn: string;
  status: UserStatus;
  skills?: string[];
  resumePath?: string;
  phone?: string;
  location?: string;
}

// ── job.model.ts ─────────────────────────────────────────────
export type JobStatus = 'active' | 'closed' | 'draft';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  description: string;
  requirements: string;
  skills: string[];
  salary?: string;
  status: JobStatus;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
  applicationsCount?: number;
}

// ── application.model.ts ─────────────────────────────────────
export type AppStatus = 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  resumePath: string;
  status: AppStatus;
  appliedAt: string;
  updatedAt: string;
  coverLetter?: string;
}

// ── notification.model.ts ────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: string;
}

// ── auth.model.ts ────────────────────────────────────────────
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}
