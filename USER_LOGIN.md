# User Login — Nexa-Inv

## Purpose
Describe API endpoints and frontend behaviour for user authentication.

## API Endpoints (recommended)
- `POST /api/v1/login` — request: `{ email, password, remember }` — response: `{ success, message, data: { token, user } }`
- `POST /api/v1/logout` — invalidates token/session
- `GET /api/v1/me` — returns current user profile
- `POST /api/v1/auth/refresh` — refreshes access token (if using JWT)
- `POST /api/v1/auth/password/forgot` — request password reset
- `POST /api/v1/auth/password/reset` — reset password

## Default Seeded Admin Users
- `superadmin@nexa-mfg.com` / `superadmin123`
- `admin@nexa-mfg.com` / `password`

## Authentication Notes
- Use Laravel Sanctum or JWT for token-based APIs.
- Tokens must be sent as `Authorization: Bearer <token>`.
- Implement rate-limiting on login endpoint.
- Support `remember` via long-lived tokens or refresh tokens.
- Enforce strong password rules and optional 2FA.

## Frontend (React) — Login Flow
1. Login form fields: `email`, `password`, `remember`.
2. Client-side validation with React Hook Form + Zod.
3. Submit to `POST /api/v1/login` using API hook (TanStack Query).
4. On success: store token securely (memory/store + httpOnly cookie for refresh), redirect to dashboard.
5. On failure: show error messages from `errors` object.

## Error Handling
- Return structured errors: `{ success: false, message, errors }`.
- Map `errors` fields to form inputs.

## Security Best Practices
- Use HTTPS always.
- Store refresh tokens in httpOnly cookies where possible.
- Use CSRF protection for cookie-based auth.
- Log failed login attempts and lock account after configurable threshold.
- Require email verification for privileged roles.

## Session & Audit
- Create `user_sessions` record on login (device, IP, user_agent).
- Record logout and token revocation.
- Provide endpoint to list/terminate active sessions.
