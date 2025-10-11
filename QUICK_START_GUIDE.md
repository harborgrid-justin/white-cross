# White Cross Healthcare Platform - Quick Start Guide

Welcome to the White Cross healthcare platform! This guide will help you get up and running quickly.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Running the Application](#running-the-application)
4. [Running Tests](#running-tests)
5. [Database Management](#database-management)
6. [Common Commands](#common-commands)
7. [Troubleshooting](#troubleshooting)
8. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.x or higher ([Download](https://nodejs.org/))
- **npm** v9.x or higher (comes with Node.js)
- **PostgreSQL** 15.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Code Editor** (VS Code recommended)

### Verify Installations

```bash
node --version    # Should be v18.x or higher
npm --version     # Should be v9.x or higher
psql --version    # Should be PostgreSQL 15.x or higher
git --version     # Any recent version
```

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd white-cross
```

### 2. Install Dependencies

Install all dependencies for both frontend and backend:

```bash
npm run setup
```

This command will:
- Install root dependencies
- Install backend dependencies
- Install frontend dependencies
- Generate Prisma client

### 3. Configure Environment Variables

#### Backend Environment (.env)

Create `backend/.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/whitecross"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"

# Server
PORT=3001
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"

# File Upload
MAX_FILE_SIZE="10485760"  # 10MB in bytes
UPLOAD_DIR="./uploads"

# Email (Optional - for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@whitecross.com"

# Redis (Optional - for caching)
REDIS_URL="redis://localhost:6379"
```

#### Frontend Environment (.env)

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME="White Cross Healthcare"
VITE_ENV=development
```

### 4. Set Up Database

#### Create Database

```bash
# Log into PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE whitecross;

# Exit psql
\q
```

#### Run Migrations

```bash
cd backend
npx prisma migrate dev
```

This will:
- Apply all database migrations
- Generate Prisma client
- Create all tables and indexes

#### Seed Database (Optional)

```bash
npm run seed
```

This will populate the database with:
- Sample students (503 records)
- Sample medications (12 records)
- Sample health records (12,435 records)
- Sample allergies (1,238 records)
- Sample chronic conditions (593 records)

---

## Running the Application

### Option 1: Run Everything Together (Recommended)

From the root directory:

```bash
npm run dev
```

This starts:
- **Backend API** on http://localhost:3001
- **Frontend App** on http://localhost:5173

### Option 2: Run Separately

#### Backend Only

```bash
npm run dev:backend
# OR
cd backend
npm run dev
```

Backend will run on: http://localhost:3001

#### Frontend Only

```bash
npm run dev:frontend
# OR
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

### Default Login Credentials

After seeding the database, use these credentials:

```
Email: admin@whitecross.com
Password: Admin123!
```

---

## Running Tests

### Frontend Unit Tests (Vitest)

```bash
# Run all frontend unit tests
npm run test:frontend

# OR from frontend directory
cd frontend
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Backend Tests (Jest)

```bash
# Run all backend tests
npm run test:backend

# OR from backend directory
cd backend
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests (Cypress)

```bash
# Open Cypress Test Runner (interactive)
cd frontend
npm run cypress:open

# Run all E2E tests (headless)
npm run test:e2e

# Run specific test file
npm run cypress:run -- --spec "cypress/e2e/01-authentication/01-login.cy.ts"
```

### Run All Tests

```bash
npm test
```

---

## Database Management

### View Database in Prisma Studio

Prisma Studio provides a visual interface for your database:

```bash
cd backend
npx prisma studio
```

Open your browser to: http://localhost:5555

### Common Database Commands

#### Apply New Migration

```bash
cd backend
npx prisma migrate dev --name descriptive-migration-name
```

#### Reset Database

```bash
cd backend
npx prisma migrate reset
```

Warning: This will delete all data!

#### Check Migration Status

```bash
cd backend
npx prisma migrate status
```

#### Generate Prisma Client

After schema changes:

```bash
cd backend
npx prisma generate
```

#### Database Backup

```bash
# Create backup
pg_dump -U postgres whitecross > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U postgres whitecross < backup_20251010.sql
```

---

## Common Commands

### Development

```bash
# Start both frontend and backend
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Install dependencies
npm run setup
```

### Building

```bash
# Build both frontend and backend
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

### Linting & Formatting

```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code (if Prettier is configured)
npm run format
```

### Database

```bash
# Run migrations
cd backend && npx prisma migrate dev

# Seed database
cd backend && npm run seed

# Open Prisma Studio
cd backend && npx prisma studio

# Reset database
cd backend && npx prisma migrate reset
```

### Testing

```bash
# Run all tests
npm test

# Frontend unit tests
npm run test:frontend

# Backend tests
npm run test:backend

# E2E tests (Cypress)
cd frontend && npm run test:e2e
```

---

## Troubleshooting

### Problem: "Cannot connect to database"

**Solution:**

1. Verify PostgreSQL is running:
   ```bash
   # On macOS/Linux
   sudo systemctl status postgresql

   # On Windows (check services)
   services.msc
   ```

2. Check DATABASE_URL in `backend/.env`
3. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

### Problem: "Port 3001 already in use"

**Solution:**

1. Find and kill the process:
   ```bash
   # On macOS/Linux
   lsof -ti:3001 | xargs kill -9

   # On Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

2. Or change the port in `backend/.env`:
   ```env
   PORT=3002
   ```

### Problem: "Prisma Client not generated"

**Solution:**

```bash
cd backend
npx prisma generate
```

### Problem: "Module not found" errors

**Solution:**

1. Delete node_modules and reinstall:
   ```bash
   # Root
   rm -rf node_modules package-lock.json
   npm install

   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install

   # Frontend
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear build caches:
   ```bash
   # Frontend
   cd frontend
   rm -rf .vite dist

   # Backend
   cd backend
   rm -rf dist
   ```

### Problem: "Cypress tests failing"

**Solution:**

1. Ensure backend is running:
   ```bash
   npm run dev:backend
   ```

2. Clear Cypress cache:
   ```bash
   cd frontend
   npx cypress cache clear
   npm run cypress:install
   ```

3. Check test database configuration

### Problem: Migration fails

**Solution:**

1. Check migration files in `backend/prisma/migrations/`
2. Reset database if needed:
   ```bash
   cd backend
   npx prisma migrate reset
   ```

3. Manually fix conflicts, then:
   ```bash
   npx prisma migrate resolve --applied <migration-name>
   ```

### Problem: "Out of memory" during tests

**Solution:**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or in package.json script
"test:e2e": "NODE_OPTIONS='--max-old-space-size=4096' cypress run"
```

### Problem: Frontend build errors

**Solution:**

1. Clear Vite cache:
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   ```

2. Check for TypeScript errors:
   ```bash
   npm run type-check
   ```

3. Verify all dependencies are installed:
   ```bash
   npm install
   ```

---

## Next Steps

### For Developers

1. **Read the Architecture Documentation**
   - `docs/MEDICATION_RESILIENCE_ARCHITECTURE.md`
   - `docs/api/medication-api-specification.md`
   - `frontend/src/services/modules/medication/ARCHITECTURE.md`

2. **Review the Codebase**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
   - Database Schema: `backend/prisma/schema.prisma`

3. **Understand the Testing Strategy**
   - `docs/MEDICATION_RESILIENCE_TESTING.md`
   - `MEDICATION_TEST_SUITE_SUMMARY.md`

4. **Explore the API**
   - Open Prisma Studio: `cd backend && npx prisma studio`
   - Review API endpoints in Postman/Insomnia
   - Read API documentation

### For Administrators

1. **Configure Production Environment**
   - Set up production database
   - Configure environment variables
   - Set up SSL certificates
   - Configure email service

2. **Deploy the Application**
   - Follow deployment checklist in `IMPLEMENTATION_COMPLETE_SUMMARY.md`
   - Set up monitoring and alerts
   - Configure backups

3. **Train Users**
   - Create user documentation
   - Schedule training sessions
   - Provide support resources

### For QA/Testers

1. **Run Test Suite**
   - Execute all 151 Cypress E2E tests
   - Document any failures
   - Report bugs with reproduction steps

2. **Manual Testing**
   - Test critical user workflows
   - Verify HIPAA compliance
   - Check accessibility standards

3. **Performance Testing**
   - Run load tests on medication endpoints
   - Monitor database performance
   - Check frontend load times

---

## Additional Resources

### Documentation

- **API Documentation**: `docs/api/medication-api-specification.md`
- **Architecture Guide**: `docs/MEDICATION_RESILIENCE_ARCHITECTURE.md`
- **Implementation Guide**: `docs/MEDICATION_RESILIENCE_IMPLEMENTATION_GUIDE.md`
- **Testing Guide**: `docs/MEDICATION_RESILIENCE_TESTING.md`
- **Complete Summary**: `IMPLEMENTATION_COMPLETE_SUMMARY.md`

### Project Structure

```
white-cross/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, etc.
│   │   ├── jobs/            # Background jobs
│   │   └── utils/           # Utility functions
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   └── tests/               # Backend tests
│
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API clients
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript types
│   ├── cypress/             # E2E tests
│   │   ├── e2e/             # Test specifications
│   │   └── support/         # Test utilities
│   └── tests/               # Unit tests
│
└── docs/                    # Documentation
    ├── api/                 # API documentation
    └── architecture/        # Architecture docs
```

### Key Technologies

- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Frontend**: React 18, TypeScript, Vite, TanStack Query
- **Database**: PostgreSQL 15
- **Testing**: Cypress, Jest, Vitest
- **Styling**: Tailwind CSS
- **Validation**: Zod, Joi

### Support

- **Technical Issues**: Create an issue in the repository
- **Questions**: Check documentation first, then ask the team
- **Feature Requests**: Submit via project management tool

---

## Quick Reference

### Most Common Commands

```bash
# Start development environment
npm run dev

# Run all tests
npm test

# Open database viewer
cd backend && npx prisma studio

# Run E2E tests
cd frontend && npm run cypress:open

# Seed database
cd backend && npm run seed

# Check code quality
npm run lint

# Build for production
npm run build
```

### Environment Health Check

```bash
# Check if everything is working
node --version              # ✓ v18+
npm --version               # ✓ v9+
psql --version              # ✓ PostgreSQL 15+
cd backend && npx prisma db pull --print  # ✓ Database connected
curl http://localhost:3001/health         # ✓ Backend running
curl http://localhost:5173                # ✓ Frontend running
```

---

**Happy Coding!**

For detailed information, see `IMPLEMENTATION_COMPLETE_SUMMARY.md`

**Last Updated:** October 10, 2025
**Version:** 1.0.0
