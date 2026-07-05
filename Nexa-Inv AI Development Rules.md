# Nexa-Inv AI Development Rules (VS Code)

## Purpose
This document is the mandatory AI coding guideline for all contributors and AI coding assistants working on Nexa-Inv.

## Project Goal
Build a production-grade Enterprise Inventory Platform using:
- Laravel 12
- React 19
- PostgreSQL
- Redis
- Flutter (future)

## Architecture Rules
- Modular Monolith
- Clean Architecture
- SOLID
- DRY
- KISS
- YAGNI
- API First
- Domain-oriented modules

## AI Guardrails
### Never
- Generate fat controllers.
- Put business logic inside controllers.
- Put business logic inside React components.
- Use inline SQL when Eloquent/Query Builder is appropriate.
- Duplicate existing code.
- Break existing architecture.
- Rename existing tables without migration.
- Delete existing code without explicit instruction.
- Hardcode configuration values.
- Skip validation.
- Skip authorization.
- Skip audit logging for business-critical actions.

### Always
- Use Repository Pattern.
- Use Service + Action classes.
- Use DTOs.
- Use FormRequest validation.
- Use API Resources.
- Use Policies/Gates.
- Use dependency injection.
- Generate migrations with foreign keys.
- Generate seeders when introducing master data.
- Add unit and feature tests.
- Update API documentation.
- Update README/module documentation when features change.

## Module Generation Checklist
For every new module generate:
1. Migration
2. Seeder
3. Model
4. DTO
5. Repository Interface
6. Repository
7. Service
8. Action(s)
9. Controller
10. Form Requests
11. API Resource
12. Policy
13. Routes
14. React Pages
15. React Components
16. API Hooks
17. State Management
18. Unit Tests
19. Feature Tests
20. Documentation

## Database Rules
- PostgreSQL only.
- snake_case naming.
- bigint identity primary keys.
- Foreign keys required.
- Composite indexes where appropriate.
- created_at / updated_at / deleted_at.
- created_by / updated_by where applicable.
- Use transactions for stock and finance.

## API Rules
- Prefix: `/api/v1`
- JSON responses only.
- Standard response:
  - success
  - message
  - data
  - meta
  - errors
- Support pagination, filtering, sorting and search.

## Frontend Rules
- React 19 + TypeScript.
- Tailwind CSS + Shadcn UI.
- TanStack Query for server state.
- React Hook Form + Zod.
- Feature-first folder structure.
- Responsive by default.
- Dark/Light mode support.

## Git Rules
- Small, focused commits.
- Never mix refactor with new features.
- Keep migrations atomic.
- Do not modify historical migrations after release.

## Code Review Checklist
- Architecture preserved?
- SOLID followed?
- Tests added?
- Permissions checked?
- Validation complete?
- Audit log implemented?
- Performance acceptable?
- Documentation updated?

## AI Response Rules
When asked to build a feature:
1. Analyze existing architecture.
2. Reuse existing components.
3. Explain assumptions.
4. Generate production-ready code only.
5. Never generate placeholder code unless requested.
6. Preserve backward compatibility whenever possible.

## Definition of Done
A feature is complete only if:
- Backend implemented.
- Frontend implemented.
- Database updated.
- Tests pass.
- Documentation updated.
- API documented.
- Security validated.
- No lint or build errors.

## Database Credentials
- Database: `inv`
- User: `postgres`
- Password: `postgres`
