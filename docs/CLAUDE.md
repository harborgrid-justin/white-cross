# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

White Cross is an enterprise-grade healthcare platform for school nurses to manage student health records, medications, emergency communications, and compliance tracking. The platform prioritizes HIPAA compliance, data security, and healthcare regulatory standards.

## Architecture

### Monorepo Structure
- **Root**: npm workspaces with concurrently for orchestrated development
- **Backend**: Hapi.js REST API with GraphQL support, Sequelize ORM, PostgreSQL database
- **Frontend**: React 19 with Vite, Redux Toolkit (domain-driven slices), TanStack Query, Tailwind CSS

### Technology Stack
**Backend:**
- Framework: Hapi.js v21 with TypeScript
- Database: PostgreSQL with Sequelize 6.37.7
- Authentication: JWT with hapi-auth-jwt2
- API Documentation: Swagger/OpenAPI via hapi-swagger
- GraphQL: Apollo Server with healthcare-specific resolvers
- Caching: Redis
- Real-time: Socket.io for notifications

**Frontend:**
- Framework: React 19 with TypeScript
- Build Tool: Vite 7
- State: Redux Toolkit with selective persistence, TanStack Query for server state
- Routing: React Router 7
- Styling: Tailwind CSS
- Testing: Vitest + React Testing Library, Playwright for E2E

## Essential Commands

### Development
```bash
# From root - start both frontend and backend
npm run dev                    # Frontend: http://localhost:5173, Backend: http://localhost:3001

# Start services individually
npm run dev:frontend           # Frontend only (port 5173)
npm run dev:backend           # Backend only (port 3001)

# Backend-specific (from backend/ directory)
npm run dev                   # Start backend with nodemon hot reload
npm run dev:debug            # Start with Node.js debugger
```

### Database Management
```bash
# From root
npm run db:migrate           # Run pending migrations
npm run db:migrate:undo      # Rollback last migration
npm run db:migrate:status    # Check migration status
npm run db:seed             # Run custom seed script (preferred)
npm run db:seed:all         # Run Sequelize seeders
npm run db:reset            # Reset DB: undo → migrate → seed

# From backend/ directory
npx sequelize-cli db:migrate
npm run seed                # Custom TypeScript seeder (src/database/seeders/seed.ts)
npx sequelize-cli migration:generate --name <name>
```

### Testing
```bash
# All tests
npm test                     # Run all backend + frontend tests
npm run test:coverage       # Generate coverage reports

# Backend tests (from backend/)
npm test                    # Jest unit tests
npm run test:watch         # Jest in watch mode
npm run test:coverage      # Generate coverage report

# Frontend tests (from frontend/)
npm test                   # Vitest unit tests
npm run test:ui            # Vitest UI mode
npm run test:coverage      # Generate coverage report

# E2E tests
npm run test:e2e           # Cypress E2E tests (from root)
npm run test:e2e:headed    # Cypress headed mode
npm run test:api-integration  # Playwright API integration tests
npm run test:api-integration:ui  # Playwright UI mode

# Single test file
cd backend && npx jest path/to/test.test.ts
cd frontend && npx vitest path/to/test.test.tsx
```

### Build & Deployment
```bash
npm run build              # Build both backend and frontend
npm run build:backend     # TypeScript compilation to dist/
npm run build:frontend    # Vite production build

# Type checking (without building)
npm run type-check        # Check types in both projects
npm run type-check:backend   # Backend only (via tsc)
npm run type-check:frontend  # Frontend only

# Linting
npm run lint              # Lint both projects
npm run lint:fix          # Auto-fix linting issues
```

### Docker
```bash
docker-compose up         # Start all services (PostgreSQL, Redis, backend, frontend)
docker-compose up -d      # Start in detached mode
docker-compose down       # Stop all services
docker ps                 # View running containers
docker logs white-cross-backend  # View backend logs
```

## Code Architecture Patterns

### Backend Route Organization
Routes are modular and domain-driven in `/backend/src/routes/v1/`:

```
routes/v1/
├── core/           # Authentication, users, access control (auth.ts, users.ts, rbac.ts)
├── healthcare/     # Medications, health records (medications.ts, health-records.ts)
├── operations/     # Students, contacts, appointments (students.ts, appointments.ts, emergency-contacts.ts)
├── documents/      # Document management (documents.ts, signatures.ts)
├── compliance/     # Audit logs, compliance reports (audit.ts, policies.ts)
├── communications/ # Messages, notifications, broadcasts
├── incidents/      # Incident reporting, witnesses, follow-ups
├── analytics/      # Health metrics and analytics
└── system/         # System admin, integrations, configuration
```

All routes aggregate through `/routes/v1/index.ts` and are registered in the main `src/index.ts` server file.

### Frontend State Management
Redux with Domain-Driven Design and **selective persistence**:

**Core stores** (global, persisted):
- `/stores/slices/authSlice.ts` - Authentication state
- `/stores/slices/usersSlice.ts` - User management

**Feature stores** (co-located with pages):
- `/pages/students/store/studentsSlice.ts`
- `/pages/medications/store/medicationsSlice.ts`
- `/pages/appointments/store/appointmentsSlice.ts`
- `/pages/incidents/store/incidentReportsSlice.ts`
- `/pages/students/store/healthRecordsSlice.ts`

**HIPAA compliance**:
- PHI data excluded from localStorage persistence
- Audit logging enabled for PHI access
- BroadcastChannel API for cross-tab state sync

### Import Path Aliases
**Frontend**: Uses `@/` for all `src/` imports
```typescript
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { studentsApi } from '@/services/api'
```

**Backend**: Can use `@/` alias (configured in tsconfig.json paths) or relative paths
```typescript
import { User } from '@/database/models/core/User'
import { logger } from '@/utils/logger'
```

### Service Layer Pattern
Frontend services are domain-organized in `/services/modules/`:
- `appointmentsApi.ts`, `studentsApi.ts`, `medicationsApi.ts`, etc.
- Centralized error handling via `handleApiError()` utility
- Built-in retry logic with exponential backoff
- TanStack Query for caching and server state

Backend services in `/backend/src/services/` follow repository pattern with:
- Service classes for business logic
- Repository classes for data access
- DTOs for data transfer objects

### Middleware Chain (Backend)
Healthcare-specific middleware stack:
1. **Authentication**: JWT validation with user loading
2. **Authorization**: RBAC with role hierarchy
3. **Validation**: Healthcare-specific (NPI, ICD-10, PHI detection)
4. **Security Headers**: HIPAA-compliant CORS, CSP
5. **Audit Logging**: PHI access tracking
6. **Rate Limiting**: Redis-backed or in-memory

Middleware factory pattern in `/backend/src/middleware/`:
```typescript
const middleware = createHealthcareMiddleware(userLoader, {
  environment: 'production',
  redisClient: redisInstance
});
```

## Database Patterns

### Models
Models define relationships and validations in `/backend/src/database/models/`:
```
models/
├── core/          # User, Role, Permission
├── healthcare/    # HealthRecord, Medication, Immunization
├── administration/# Student, EmergencyContact, Appointment
├── documents/     # Document, DocumentTemplate
└── index.ts       # Sequelize instance and model associations
```

### Migrations
- Location: `/backend/src/database/migrations/`
- Naming: `00001-description.ts` (sequential numbering)
- Generate: `npx sequelize-cli migration:generate --name <name>`
- Always update corresponding model after migration

### Seeders
Two seeding systems:
1. **Custom TypeScript seeder** (preferred): `npm run seed` → `src/database/seeders/seed.ts`
2. **Sequelize seeders**: `npx sequelize-cli db:seed:all` → `src/database/seeders/*.js`

## Testing Strategy

### Coverage Requirements
- Backend: 95% lines/functions, 90% branches
- Frontend: 95% lines/functions, 90% branches
- No real PHI data - synthetic test fixtures only

### Test Organization
- Backend tests: `/backend/src/__tests__/`
- Frontend tests: Co-located with components or in `/frontend/src/__tests__/`
- E2E tests: `/frontend/tests/e2e/`
- API integration tests: `/tests/api/` (Playwright)

### Key Testing Patterns
- **HIPAA compliance**: Verify audit logging for PHI access
- **RBAC testing**: Validate role-based access across all domains
- **E2E API mocking**: Use comprehensive intercepts, verify no hardcoded data in UI
- **Error scenarios**: Test error handling and user feedback

## GraphQL Integration

### Hybrid REST + GraphQL
- **GraphQL Endpoint**: `/graphql` (alongside REST API)
- **Backend**: Apollo Server with Hapi.js integration
- **Frontend**: Apollo Client with auth, retry logic, caching

### Implementation
- **Schema**: `/backend/src/api/graphql/schema/` with healthcare scalars
- **Resolvers**: `/backend/src/api/graphql/resolvers/` with permission checks
- **Frontend Queries**: `/frontend/src/services/graphql/` with fragments

## Security & HIPAA Compliance

### Critical Requirements
- All PHI operations require audit logging
- JWT tokens with proper expiration (see `/backend/src/utils/tokenUtils.ts`)
- Input validation mandatory: Joi (backend), Zod (frontend)
- Rate limiting on all API endpoints
- Never log PHI data in development or production

### Data Sanitization
- Use sanitization utilities in `/backend/src/shared/utils/`
- Implement proper access control via middleware chain
- PHI excluded from localStorage - use sessionStorage or memory only

## API Documentation

- **Swagger UI**: Available at `http://localhost:3001/docs` when backend is running
- **OpenAPI Spec**: Generated via hapi-swagger plugin
- Routes use Joi schemas for validation and auto-documentation

## Key Configuration Files

- **Environment**: `.env` (root and backend) - see `.env.example` for required variables
- **Backend Config**: `/backend/src/config/` - server, database, swagger
- **Frontend Config**: `/frontend/src/config/` - API endpoints, monitoring
- **Docker**: `docker-compose.yml` (PostgreSQL, Redis, backend, frontend)
- **TypeScript**: `tsconfig.json` in root, backend, and frontend

## Monitoring & Logging

- **Backend Logging**: Winston logger in `/backend/src/utils/logger.ts`
- **Frontend Monitoring**: Sentry, DataDog, New Relic integrations in `/frontend/src/services/monitoring/`
- **Health Check**: `GET /health` endpoint (no auth required)

## Common Development Workflows

### Adding a New Feature
1. Design domain model and relationships
2. Create migration: `npx sequelize-cli migration:generate --name add-feature`
3. Update Sequelize model in `/backend/src/database/models/`
4. Create/update backend route in `/backend/src/routes/v1/`
5. Implement service layer with business logic
6. Create frontend API module in `/frontend/src/services/modules/`
7. Implement Redux slice if needed (feature store in `/pages/[feature]/store/`)
8. Build React components and pages
9. Write tests (TDD encouraged)
10. Update API documentation (Swagger/JSDoc)

### Database Changes
1. Generate migration with descriptive name
2. Write up/down methods in migration file
3. Update corresponding Sequelize model
4. Update seeders if needed
5. Run `npm run db:migrate` to apply
6. Test with `npm run db:reset` to verify full cycle

### Running Single Test
```bash
# Backend
cd backend && npx jest src/services/__tests__/UserService.test.ts

# Frontend
cd frontend && npx vitest src/components/Button.test.tsx

# E2E specific test
cd frontend && npx playwright test tests/e2e/02-student-management/01-student-list.spec.ts
```

## Important Notes

- **Node Version**: Requires Node >=20.0.0, npm >=8.0.0
- **Database**: PostgreSQL must be running (via Docker or local install)
- **Redis**: Optional but recommended for caching and rate limiting
- **Port Conflicts**: Frontend (5173), Backend (3001), PostgreSQL (5432), Redis (6379)
- **First Time Setup**: Run `npm run setup` to install all dependencies
- **Type Errors**: Backend build uses `|| (exit 0)` to continue on type errors during development
