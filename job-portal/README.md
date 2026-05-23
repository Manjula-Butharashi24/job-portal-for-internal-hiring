# TalentBridge – Internal Job Portal (Frontend)

A production-ready Angular 17 internal HR job portal with role-based dashboards for **Admin**, **HR**, and **Employee**.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # TypeScript interfaces (User, Job, Application…)
│   │   ├── services/        # auth.service, job.service, services.ts (app/notif/toast/user)
│   │   └── guards/          # AuthGuard, GuestGuard, ThemeService
│   ├── shared/
│   │   ├── components/
│   │   │   ├── sidebar/     # Role-aware collapsible sidebar
│   │   │   ├── navbar/      # Top bar with notifications + dark mode
│   │   │   ├── toast/       # Toast notification system
│   │   │   ├── spinner/     # Global loading overlay
│   │   │   └── confirm-dialog/ # Reusable confirm modal
│   │   ├── pipes/           # MinPipe, FilterByStatusPipe
│   │   └── shared.module.ts
│   └── features/
│       ├── auth/            # Login page
│       ├── admin/           # Dashboard, Users, Profile
│       ├── hr/              # Dashboard, Jobs (CRUD), Applications, Profile
│       └── employee/        # Dashboard, Browse Jobs, Applications, Profile
├── environments/
└── styles.css               # Global design system (CSS variables, tokens)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ — https://nodejs.org
- **npm** v9+
- **Angular CLI** v17

### Step 1 — Install Angular CLI globally
```bash
npm install -g @angular/cli@17
```

### Step 2 — Navigate to project
```bash
cd job-portal
```

### Step 3 — Install dependencies
```bash
npm install
```

### Step 4 — Start the development server
```bash
ng serve
```

### Step 5 — Open in browser
```
http://localhost:4200
```

---

## 🔑 Demo Login Credentials

| Role     | Email                         | Password    |
|----------|-------------------------------|-------------|
| Admin    | admin@talentbridge.com        | Admin@123   |
| HR       | hr@talentbridge.com           | Hr@12345    |
| Employee | employee@talentbridge.com     | Emp@1234    |

---

## ✨ Features by Role

### 👤 Admin
- System overview dashboard (users, jobs, apps, uptime)
- User management table — edit role/status, deactivate users
- Role distribution charts
- Admin profile with security settings tab

### 👩‍💼 HR Manager
- Hiring analytics dashboard with bar charts
- Full Job CRUD — create/edit in slide-over panel with skill tags
- Applications table with inline status update dropdown
- Profile with resume upload

### 👨‍💻 Employee
- Personalized welcome banner + stat cards
- Skill-based job recommendations
- Job browsing — grid layout with filter sidebar + debounced search
- Job detail drawer with one-click apply
- Application tracker with visual pipeline (Applied → Shortlisted → Interview → Hired)
- Profile with skill manager + drag-and-drop resume upload

---

## 🎨 Design System
- **Font:** DM Sans + DM Serif Display (Google Fonts)
- **Color:** Deep Navy `#0f172a` + Electric Blue `#1a56db` accent
- **Dark Mode:** Full CSS variable swap, persisted to localStorage
- **Responsive:** Mobile-first grid breakpoints

---

## 🏗️ Build for Production
```bash
ng build --configuration production
# Output: dist/job-portal/
```

---

## 📡 Connecting to Backend (MEAN Stack)
Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```
Replace mock `Observable.of()` calls in services with `HttpClient` calls.
JWT token is stored in localStorage under key `accessToken`.
