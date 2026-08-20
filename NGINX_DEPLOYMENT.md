# Nginx Deployment

Nexa-Inv uses one Nginx virtual host for the decoupled architecture:

- React/Vite static files are served from `frontend/dist`.
- `/api/*` and `/sanctum/*` are forwarded to Laravel through `backend/public/index.php` and PHP-FPM.
- Client-side React routes fall back to `index.html`.
- Hashed Vite assets are cached for 30 days, and route modules remain lazy-loaded.

For Laragon on Windows, use [nginx/laragon-nexa-inv.conf](nginx/laragon-nexa-inv.conf). It serves the Vite build directly and sends Laravel API requests to the PHP-FPM process managed by Laragon. The optional [nginx/laragon-nginx.conf](nginx/laragon-nginx.conf) is a complete standalone wrapper for syntax checks or isolated Nginx use.

## Build and paths

Build the frontend before deployment:

```bash
cd frontend
npm ci
npm run build
```

The supplied configuration assumes this server layout:

```text
/var/www/nexa-inv/frontend/dist
/var/www/nexa-inv/backend/public
```

Update the paths, `server_name`, and PHP-FPM socket in [nginx/nexa-inv.conf](nginx/nexa-inv.conf) when the installation differs.

## Enable the site

```bash
sudo cp nginx/nexa-inv.conf /etc/nginx/sites-available/nexa-inv
sudo ln -s /etc/nginx/sites-available/nexa-inv /etc/nginx/sites-enabled/nexa-inv
sudo nginx -t
sudo systemctl reload nginx
```

Run Laravel workers separately when queues are enabled:

```bash
cd backend
php artisan queue:work --tries=3
```

## Laravel requirements

```bash
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan db:seed --class=UserSeeder --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

The user seeder is idempotent and synchronizes the documented development accounts. Do not keep those default passwords in a production environment; change them before exposing the server publicly.

## Local development

The Nginx configuration is intended for a Linux deployment with PHP-FPM. On Windows, continue using `php artisan serve` for Laravel and `npm run dev` for Vite, or run Nginx/PHP-FPM inside WSL/Docker.

The frontend defaults to relative API requests (`/api/v1`), so the same-origin Nginx setup does not require a separate CORS configuration.

## Loading optimization

The frontend build keeps route modules behind dynamic imports and avoids forcing every route dependency into the initial vendor preload. The generated entry now preloads only the small runtime dependency; login and feature pages load on demand. The build also disables the unnecessary module-preload polyfill and compressed-size reporting overhead.

The build output reduced the initial module-preload list from six vendor files to one runtime file in the current verification. A claimed percentage reduction in transferred bytes still needs a Lighthouse or browser Network comparison on the Laragon host because compression, cache state, and browser behavior affect the result.

## Laragon Windows

1. Put the project at `C:/laragon/www/Nexa-inv`.
2. Build the frontend with `cd frontend` then `npm run build`.
3. Copy `nginx/laragon-nexa-inv.conf` into the Laragon Nginx configuration directory or include it from Laragon's active `nginx.conf` inside the `http` block.
4. Confirm Laragon PHP is running through PHP-FPM on `127.0.0.1:9000`. Change `fastcgi_pass` if the selected Laragon PHP version uses another port.
5. Add `127.0.0.1 nexa-inv.test` to the Windows hosts file if the `.test` hostname is not created automatically.
6. Restart Nginx from the Laragon menu and open `http://nexa-inv.test`.

Do not run `php artisan serve` or `npm run dev` for this production-style local setup. Nginx serves `frontend/dist`, while PHP-FPM executes Laravel through `backend/public/index.php`.
