# Nexa-Inv — System Architecture

Nexa-Inv is built using a modern decoupled architecture, separating the backend API and the frontend client. This approach ensures high performance, scalability, and ease of maintenance.

## High-Level Stack
- **Backend:** Laravel 12 (PHP 8.2) — RESTful API.
- **Frontend:** React 18 (TypeScript) + Vite — Single Page Application (SPA).
- **Database:** PostgreSQL 17 — Relational Database.
- **Caching & Queues:** Redis.
- **Styling:** Tailwind CSS + Shadcn UI.

---

## Backend Architecture (Modular Monolith)

The backend follows a **Modular Monolith** architecture based on Domain-Driven Design (DDD) principles. Rather than lumping all logic into standard Laravel folders, code is grouped by business domain inside the `app/Modules` directory.

### Modules Breakdown
1. **Core:** Handles Users, Roles, Permissions, Authentication, and generic manufacturing data (Production Orders, BOMs).
2. **Inventory:** Handles Warehouses, Stock Transfers, Adjustments, and Stock Ledger tracking.
3. **Purchasing:** Handles Suppliers, Purchase Orders, and Goods Receipts.

### Layered Architecture within Modules
Each module is divided into three layers:
- **Presentation Layer:** Controllers and API Routes. Handles HTTP requests, input validation, and formatting JSON responses.
- **Domain Layer:** Eloquent Models, Value Objects, and core business rules. Models reside here.
- **Services/Application Layer:** Encapsulates complex business logic (e.g., `StockOperationService` handles the complex transactional logic of moving stock and creating ledger entries).

### Data Integrity & Audit
- **Soft Deletes:** Used across all major models to prevent accidental data loss.
- **Transactions:** `DB::transaction` is strictly enforced for multi-step database writes (like stock adjustments).
- **Stock Ledger:** An immutable `stock_ledger` table serves as the single source of truth for inventory valuation and quantities.

---

## Frontend Architecture

The frontend is a React Single Page Application (SPA) built with Vite and TypeScript, favoring a feature-based folder structure.

### Feature-Based Structure
Code is located in `src/features`, grouped by domain (e.g., `inventory`, `production`, `master-data`). Each feature folder contains:
- `/routes` - Page components.
- `/components` - Feature-specific UI components.
- `/api` or `/hooks` - Data fetching logic.

### State & API Management
- **Axios:** Used as the HTTP client (`src/lib/api.ts`), configured to automatically attach authentication tokens to every request.
- **Routing:** Handled via `react-router-dom`. Routes are lazily loaded (`React.lazy`) in `App.tsx` to optimize bundle size and speed up the initial page load.

### UI & Styling
- **Tailwind CSS:** Utility-first styling for rapid, responsive UI development.
- **Shadcn UI:** Unstyled, accessible components (like Dialogs, Inputs, Buttons) installed locally into `src/components/ui`. This provides maximum customization without bloated dependencies.
- **Lucide React:** Used for consistent, lightweight SVG iconography across the application.

---

## Security
- **Authentication:** Token-based API authentication. The token is stored locally on the client and sent as a Bearer token.
- **Authorization:** Handled at both levels:
  - Backend API endpoints are protected by Middleware and Policies.
  - Frontend UI components and routes adapt conditionally based on the user's fetched roles/permissions.
