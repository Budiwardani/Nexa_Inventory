# Nexa_Inventory — Nexa-MFG Enterprise Platform

> **Production-Grade Enterprise Manufacturing Platform (MRP + MES Lite)**  
> Built with Laravel 12 (Backend) + React 19 (Frontend) + PostgreSQL 17

---

## 🏗 Architecture

```
Nexa-inv/
├── backend/          # Laravel 12 — Modular Monolith, Clean Architecture (DDD-lite)
│   ├── app/
│   │   └── Modules/
│   │       └── Core/
│   │           ├── Actions/           # Single-purpose business actions
│   │           ├── Domain/Models/     # Eloquent domain models
│   │           ├── DTO/               # Data Transfer Objects
│   │           ├── Presentation/Controllers/  # API controllers
│   │           ├── Providers/         # ServiceProvider bindings
│   │           ├── Repositories/      # Contracts + Eloquent implementations
│   │           ├── Requests/          # FormRequest validation
│   │           ├── Resources/         # API Resource transformers
│   │           ├── Services/          # Business logic orchestration
│   │           └── Tests/             # Module-specific tests
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
│
├── frontend/         # React 19 + Vite + TypeScript
│   └── src/
│       ├── components/
│       │   ├── layouts/MainLayout.tsx
│       │   └── ui/                   # Shadcn UI components
│       ├── features/
│       │   ├── auth/                  # Login / Auth
│       │   ├── dashboard/             # Dashboard overview
│       │   ├── users/                 # User management CRUD
│       │   └── roles/                 # Roles & Permissions matrix
│       ├── lib/
│       │   ├── api.ts                 # Axios client with interceptors
│       │   └── utils.ts
│       └── providers/AppProvider.tsx  # QueryClient + Router provider
│
├── README.md
├── Nexa-Inv AI Development Rules.md
├── Nexa-Inv Database Blueprint.md
└── Nexa-Inv Manufacturing Database Blueprint.md
```

---

## ⚙️ Tech Stack

| Layer        | Technology                                           |
|--------------|-----------------------------------------------------|
| Backend      | Laravel 12, PHP 8.3+, Laravel Sanctum (API tokens) |
| Database     | PostgreSQL 17+                                       |
| Frontend     | React 19, Vite, TypeScript                          |
| UI           | Tailwind CSS v4, Shadcn UI (New York style)         |
| State        | TanStack Query v5                                   |
| Forms        | React Hook Form + Zod                               |
| HTTP Client  | Axios with auth interceptors                        |
| Testing      | PHPUnit (Feature + Module test suites)              |

---

## 🚀 Getting Started

### Backend

```bash
cd backend
cp .env.example .env
# Configure DB_CONNECTION=pgsql, DB_DATABASE=inv in .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ✅ Implemented Modules (Core)

### Backend
- [x] **Companies** — Multi-company support
- [x] **Branches** — Multi-branch per company
- [x] **Users** — Full CRUD with role assignment
- [x] **Roles** — Role management with permission sync
- [x] **Permissions** — Granular module-level permissions (RBAC)
- [x] **Audit Logs** — System-wide audit trail
- [x] **Activity Logs** — User activity tracking
- [x] **Auth API** — JWT-style Sanctum token auth (login/logout/me)
- [x] **Repository Pattern** — Interface-driven repositories for testability
- [x] **Service Layer** — Orchestration services with DB transaction wrapping
- [x] **Actions** — Single-responsibility action classes

### Frontend
- [x] **Login Page** — Validated form with Zod, React Hook Form
- [x] **Protected Routes** — Token-based route guarding
- [x] **Dashboard** — Operational overview with KPI stat cards
- [x] **User Management** — Paginated table with search, role badges, delete
- [x] **Roles & Permissions** — Role table with full permission matrix dialog

---

## 🗺 Module Roadmap

| Module            | Status        |
|-------------------|---------------|
| Core (Auth/Users/Roles) | ✅ Complete |
| Inventory         | 🔜 Planned   |
| Production / MES  | 🔜 Planned   |
| Quality Control   | 🔜 Planned   |
| Purchasing        | 🔜 Planned   |
| Sales / CRM       | 🔜 Planned   |
| Finance           | 🔜 Planned   |
| HR                | 🔜 Planned   |
| Maintenance       | 🔜 Planned   |
| Analytics         | 🔜 Planned   |

---

## 📐 Coding Standards

All code follows the standards defined in [`Nexa-Inv AI Development Rules.md`](./Nexa-Inv%20AI%20Development%20Rules.md):

- **SOLID Principles** — Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **Clean Architecture** — Domain, Application, Infrastructure, Presentation layers are strictly separated
- **Repository Pattern** — All data access via repository interfaces; Eloquent implementations are swappable
- **DDD-lite** — Modules are self-contained domain units
- **API-First** — All features exposed via versioned REST API (`/api/v1/`)
- **No Prototype Code** — All generated code is production-ready

---

## 🔐 API Endpoints (v1)

```
POST   /api/v1/login                 — Authenticate user
POST   /api/v1/logout                — Revoke token
GET    /api/v1/me                    — Current user profile

GET    /api/v1/users                 — List users (paginated)
POST   /api/v1/users                 — Create user
GET    /api/v1/users/{id}            — Get user
PUT    /api/v1/users/{id}            — Update user
DELETE /api/v1/users/{id}            — Delete user

GET    /api/v1/roles                 — List roles (paginated)
POST   /api/v1/roles                 — Create role
GET    /api/v1/roles/{id}            — Get role
PUT    /api/v1/roles/{id}            — Update role
DELETE /api/v1/roles/{id}            — Delete role

GET    /api/v1/permissions           — List all permissions
```

---

## 📄 License

Proprietary — Budiwardani / Nexa Inventory. All rights reserved.
