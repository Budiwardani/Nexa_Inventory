# Installation Guide — Nexa-Inv

This guide covers setting up the Nexa-Inv environment. The project is split into a Laravel 12 backend and a React + Vite frontend.

## Prerequisites
- **PHP** 8.2+
- **Composer** (latest)
- **Node.js** 20+ and npm
- **PostgreSQL** 17+
- **Redis** (for caching and queues)
- **Git**

## 1. Backend Setup (Laravel)
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Copy the environment file and generate an app key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Configure Database and Redis in `.env`:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=nexa_inv
   DB_USERNAME=postgres
   DB_PASSWORD=yourpassword

   CACHE_STORE=redis
   QUEUE_CONNECTION=redis
   ```
5. Run migrations and seeders to populate initial data and roles:
   ```bash
   php artisan migrate --seed
   ```
   *Note: Seeding creates a default superadmin (`superadmin@nexa-mfg.com` / `superadmin123`).*
6. Start the API server:
   ```bash
   php artisan serve --host=127.0.0.1 --port=8000
   ```

## 2. Frontend Setup (React / Vite)
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Ensure your API URL is correctly pointed in the environment configuration (usually `.env` or `.env.local`):
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Access the app in your browser (usually `http://localhost:5173`).

## 3. Production Deployment
When deploying to production:
1. **Frontend:** Run `npm run build` to generate static files in the `dist/` directory. Serve these files via Nginx or Apache.
2. **Backend:** Ensure `APP_ENV=production` and `APP_DEBUG=false`. Use a robust web server (Nginx + PHP-FPM).
3. **Queues:** Use `Supervisor` or `systemd` to keep `php artisan queue:work` running continuously in the background for notifications and async processing.
4. **Permissions:** Ensure the `storage/` and `bootstrap/cache/` directories in the backend are writable by the web server process.
