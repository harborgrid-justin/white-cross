# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

White Cross is an enterprise-grade healthcare platform designed specifically for school nurses to manage student health records, medications, and emergency communications. The platform prioritizes HIPAA compliance, data security, and meets healthcare regulatory standards.

## Architecture

### Monorepo Structure
- **Root**: Orchestration scripts via npm workspaces
- **Backend**: Node.js/Express API server with TypeScript and Sequelize ORM
- **Frontend**: React 18 application with TypeScript, Vite, and Tailwind CSS

### Technology Stack

**Backend:**
- Express.js with TypeScript
- PostgreSQL 15 with Sequelize ORM
- JWT authentication with bcryptjs
- Redis for caching
- Socket.io for real-time features
- Winston for logging
- Joi and express-validator for validation

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- TanStack Query (React Query) for server state
- React Hook Form with Zod validation
- Cypress for E2E testing
- Vitest for unit testing

## Essential Commands

### Development
```bash
npm run setup              # Install all dependencies
npm run dev                # Start both frontend and backend
npm run dev:frontend       # Frontend only (http://localhost:5173)
npm run dev:backend        # Backend only (http://localhost:3001)
```

### Database (from backend directory)
```bash
npx sequelize-cli db:migrate         # Run migrations
npx sequelize-cli db:migrate:undo    # Undo last migration
npx sequelize-cli db:seed:all        # Run all seeders
npm run seed                         # Run custom seed script
npx sequelize-cli model:generate     # Generate new model
npx sequelize-cli migration:generate # Generate new migration
```

### Testing
```bash
npm test                   # Run all tests
npm run test:frontend      # Frontend unit tests (Vitest)
npm run test:backend       # Backend tests (Jest)
cd frontend && npm run test:e2e  # Cypress E2E tests
```

### Build & Lint
```bash
npm run build              # Build both applications
npm run lint               # Lint both codebases
npm run lint:fix           # Auto-fix linting issues
```

## Key Architecture Patterns

### Backend Structure
- **Controllers**: Handle HTTP requests/responses only
- **Services**: Business logic and data operations
- **Models**: Sequelize ORM models defining database schema
- **Middleware**: Authentication, validation, error handling
- **Routes**: Express route definitions
- **Migrations**: Version-controlled database schema changes
- **Seeders**: Initial and test data population

### Frontend Structure
- **Pages**: Route-level components in `src/pages/`
- **Components**: Reusable UI components in `src/components/`
- **Hooks**: Custom React hooks for shared logic
- **Services**: API layer using Axios with TanStack Query
- **Types**: Shared TypeScript interfaces

### Import Paths
- Use `@/` alias for imports from `src/` directory (configured in vite.config.ts)
- Example: `import { Button } from '@/components/ui/Button'`

## Healthcare Compliance Requirements

### Security Standards
- All health data must follow HIPAA compliance
- JWT tokens for authentication with proper expiration
- Rate limiting on all API endpoints
- Input validation and sanitization required
- Audit logging for all protected health information (PHI) access
- Encryption at rest and in transit

### Data Handling
- Never commit sensitive data (API keys, health records, passwords)
- Use parameterized queries to prevent SQL injection
- Implement role-based access control (RBAC)
- Log all data access and modifications
- Validate all user inputs with Joi/Zod schemas

## Development Workflow

### Adding Database Changes
1. Generate a new migration: `npx sequelize-cli migration:generate --name descriptive-name`
2. Edit the migration file in `backend/migrations/` with up/down methods
3. Define model in `backend/src/models/` or update existing model
4. Run migration: `npx sequelize-cli db:migrate`
5. Update TypeScript types if needed
6. Test migration rollback: `npx sequelize-cli db:migrate:undo`

### Adding API Endpoints
1. Create route in `backend/src/routes/`
2. Implement controller in `backend/src/controllers/`
3. Add business logic in `backend/src/services/`
4. Add validation schema with Joi
5. Include authentication middleware
6. Write tests

### Adding Frontend Features
1. Use TypeScript interfaces for all props and state
2. Implement loading and error states
3. Use TanStack Query for server state management
4. Follow Tailwind CSS utility-first approach
5. Write component tests where applicable

## Important Notes

- This is a healthcare application - prioritize data security and privacy
- Student and patient data must be protected at all times
- Follow the principle of least privilege for access control
- When handling PHI, ensure proper audit logging
- Use existing authentication patterns and middleware
- Test thoroughly, especially security-sensitive features

## 15 Core Platform Modules

The platform implements these key healthcare management modules:
1. Student Management System
2. Medication Management
3. Health Records Management
4. Emergency Contact System
5. Appointment Scheduling
6. Incident Reporting
7. Compliance & Regulatory
8. Communication Center
9. Reporting & Analytics
10. Inventory Management
11. Access Control & Security
12. Document Management
13. Integration Hub
14. Mobile Application
15. Administration Panel

When implementing features, consider the healthcare context and multi-school district requirements.