# Hospital Management System (HMS) — Enterprise Healthcare Platform
> Green Hospital of Bangladesh • Smart Hospital Enterprise Architecture

An enterprise-grade, modular Hospital Management System (HMS) developed with **Domain-Driven Design (DDD)** and **Clean Architecture** on Laravel 13 & PHP 8.4, with a modern **React 19 + TypeScript + Vite + Tailwind CSS** frontend.

---

## 🏗️ Architecture & Technology Stack

### Backend (`apps/provider-api`)
- **Framework**: Laravel 13.x on PHP 8.4
- **Database**: PostgreSQL 16 (with connection pooling & migrations)
- **Cache & Queue**: Redis 7
- **Architecture**: Domain-Driven Design (DDD) & Clean Architecture
  - `Domain`: Pure business entities, value objects, domain exceptions, domain events
  - `Application`: Use-cases, repository ports, service interfaces
  - `Infrastructure`: Eloquent persistence models, database repositories, external adapters
  - `Interfaces`: HTTP Controllers, API resources, requests
  - `Providers`: Laravel Module Service Providers
- **Quality Gates & Governance**:
  - **Deptrac**: Enforces zero architectural layer violations
  - **PHPStan (Level 8)**: Strict static analysis
  - **Laravel Pint**: PSR-12 coding standard enforcement
  - **PHPUnit**: Automated module health & endpoint testing

### Frontend (`apps/provider-web`)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Features**:
  - **Institutional Landing Page**: Two-level header with segmented utility bar, clean white main navigation, 4-column cyan mega-menu, stats ribbon, clinical specialties, and high-tech surgical banner.
  - **Floating Quick Access Tabs**: Golden yellow vertical side tabs (`Hotline: 10678` & `Online Appointment`).
  - **12-Role Login Drawer**: Superadmin, Admin, Doctor, Nurse, Pharmacist, Pathologist, Radiologist, Accountant, Receptionist, Patient, Front Website, Mobile App.
  - **Superadmin Command Center**: Full Smart Hospital dashboard with 5-section operational sidebar, live menu filter search, and topbar quick-add.

---

## 📦 Hospital Modules (`app/Modules/`)

1. **`Identity`**: Authentication, JWT tokens, RBAC roles & permissions.
2. **`Staff`**: Doctor registries, nursing shift rosters, medical consultants.
3. **`Patient`**: Patient profiles, medical records (EMR), case histories.
4. **`Appointment`**: Online & OPD booking, doctor chambers, live queue tracking.
5. **`Opd`**: Outpatient department consultations, prescriptions, vitals.
6. **`Ipd`**: Inpatient department admissions, deluxe cabins, general ward bed matrix.
7. **`Pharmacy`**: Medicine inventory, batch tracking, prescriptions & billing.
8. **`Pathology`**: Diagnostic tests, automated lab result entry, pathology reports.
9. **`Radiology`**: Imaging orders (X-Ray, CT, 3T MRI, Ultrasound) & reports.
10. **`Billing`**: Hospital invoices, payments, cashless insurance TPA, revenue cycle.
11. **`Notification`**: SMS, email, and emergency broadcast alerts.
12. **`FrontWebsite`**: Institutional CMS, notices, news, doctor profiles.
13. **`Foundation`**: Shared domain primitives, Clock, UUID v7, Money value objects.

---

## 🚀 Getting Started

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 20+ & npm
- PHP 8.4+ & Composer (for local development)

### 2. Running with Docker Compose
```bash
# Clone the repository
git clone https://github.com/almamon-dev/HMS.git
cd HMS

# Launch all services (API, Web, PostgreSQL 16, Redis 7)
docker compose up -d --build
```
Services will be available at:
- **Frontend Web**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **PostgreSQL**: `localhost:5432` (`hospital_db` / `hospital_user` / `hospital_secret`)
- **Redis**: `localhost:6379`

### 3. Local Development (Makefile)
```bash
# Run verification (Pint + Deptrac + PHPStan Level 8 + PHPUnit + Vite build)
make verify

# Start backend dev server
make dev

# Start frontend dev server
make dev-web
```

---

## 🛡️ License
Private & Proprietary. All rights reserved by the development team.
