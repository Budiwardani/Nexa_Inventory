# Installation Guide — Nexa-Inv (Dev Environment)

This guide covers a minimal local development setup for backend (Laravel) and frontend (React).

## Prerequisites
- PHP 8.2+ (compatible with Laravel 12)
- Composer
- Node.js 20+ and npm or pnpm
- PostgreSQL 17+
- Redis
- Git

## Repository
Clone the repository (example):

```bash
git clone <repo-url> nexa-inv
cd nexa-inv
```

## Backend (Laravel)
1. Copy env file and edit values:

```bash
cp .env.example .env
```

Update `.env` with database settings (example):

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=inv
DB_USERNAME=postgres
DB_PASSWORD=postgres

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
```

2. Install PHP dependencies:

```bash
composer install
php artisan key:generate
```

3. Run migrations and seeders:

```bash
php artisan migrate --seed
```

By default, seeding creates a Super Administrator account:
- Email: `superadmin@nexa-mfg.com`
- Password: `superadmin123`

4. Start the backend dev server:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

## Frontend (React)
1. Change to frontend folder (example `frontend`):

```bash
cd frontend
npm install
npm run dev
```

2. Configure API base URL in frontend env (example `.env.local`):

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Running Tests
- Backend PHPUnit:

```bash
php artisan test
```

- Frontend tests (if configured):

```bash
npm run test
```

## Common Tasks
- Clear cache:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

- Queue worker (development):

```bash
php artisan queue:work
```

## Notes
- Keep migrations atomic and do not modify historical migrations after release.
- Use `.env` for local credentials; secure production secrets using a vault.
- For production, use proper process supervisors (supervisord/systemd), SSL, and load balancers.
