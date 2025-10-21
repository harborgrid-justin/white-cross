# GitHub Copilot Instructions for White Cross

## Project Overview

White Cross is an enterprise-grade healthcare platform designed specifically for school nurses to manage student health records, medications, and emergency communications. The platform is built with modern web technologies and designed to meet healthcare compliance standards including HIPAA, FERPA, and various state regulations.

## Architecture

### Monorepo Structure
- **Root**: Orchestration scripts and shared configuration
- **Backend**: Node.js/Express API server with TypeScript
- **Frontend**: React 18 application with TypeScript and Vite

### Technology Stack

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 15 with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **Caching**: Redis 7
- **Real-time**: Socket.io
- **Validation**: Joi and express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Testing**: Vitest with Testing Library

## Coding Standards

### General Guidelines
- Write clean, readable, and maintainable code
- Follow existing code style and conventions
- Add comments for complex logic only
- Write meaningful commit messages
- Prioritize security and data protection in all implementations

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Prefer `const`/`let` over `var`
- Use proper type annotations, avoid `any` types
- Implement proper error handling with try-catch blocks

### React
- Use functional components with hooks
- Follow React best practices and patterns
- Use TypeScript for props and state
- Write reusable, composable components
- Keep components focused and single-purpose
- Use proper prop validation with TypeScript interfaces

### Database
- Use Prisma for all database operations
- Write database migrations for schema changes
- Follow naming conventions: camelCase for fields, PascalCase for models
- Include proper indexes for performance
- Document complex queries

### API Design
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement consistent error response formats
- Include input validation on all endpoints
- Use middleware for authentication and authorization
- Document API endpoints with clear descriptions

## Security & Compliance

### Critical Requirements
- **Never** commit sensitive data (passwords, API keys, tokens)
- **Always** validate and sanitize user input
- **Always** implement proper authentication/authorization checks
- **Always** use parameterized queries to prevent SQL injection
- Follow HIPAA compliance guidelines for health data
- Maintain audit logs for all data access and modifications
- Implement rate limiting on all public endpoints
- Use HTTPS for all API communications

### Data Handling
- Encrypt sensitive data at rest and in transit
- Implement proper access control (RBAC)
- Log all access to protected health information (PHI)
- Ensure proper session management and timeout controls

## Development Workflow

### Project Setup
```bash
# Install dependencies for all packages
npm run setup

# Database setup
cd backend
npx prisma migrate dev
npx prisma generate
npm run seed
```

### Running the Application
```bash
# Start both frontend and backend
npm run dev

# Start individually
npm run dev:frontend  # Runs on http://localhost:5173
npm run dev:backend   # Runs on http://localhost:3001
```

### Testing
```bash
# Run all tests
npm test

# Run specific tests
npm run test:frontend
npm run test:backend
```

### Linting
```bash
# Lint all code
npm run lint

# Lint specific parts
npm run lint:frontend
npm run lint:backend
```

### Building
```bash
# Build both frontend and backend
npm run build

# Build individually
npm run build:frontend
npm run build:backend
```

## Code Patterns

### Backend Controllers
- Place business logic in services, not controllers
- Controllers should handle request/response only
- Use async/await for asynchronous operations
- Return consistent response formats

### Frontend Components
- Use the `@/` path alias for imports (configured in vite.config.ts)
- Colocate related components in feature directories
- Use custom hooks for shared logic
- Implement proper loading and error states
- Use TanStack Query for server state management

### Styling
- Use Tailwind CSS utility classes
- Follow the existing color palette (primary, secondary)
- Use the `card` class for container elements
- Use the `btn-primary` class for primary action buttons
- Maintain consistent spacing using Tailwind's spacing scale

## Key Features & Modules

The platform includes 15 primary modules:
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

When implementing features, consider the healthcare context and compliance requirements.

## Common Tasks

### Adding a New API Endpoint
1. Create route handler in `backend/src/routes/`
2. Implement controller in `backend/src/controllers/`
3. Add business logic in `backend/src/services/`
4. Add validation schema with Joi or express-validator
5. Add proper authentication/authorization middleware
6. Write unit tests
7. Document the endpoint

### Adding a New React Component
1. Create component in `frontend/src/components/` or `frontend/src/pages/`
2. Use TypeScript for props interface
3. Implement proper error boundaries
4. Add loading states where appropriate
5. Use Tailwind CSS for styling
6. Write component tests if applicable

### Adding a Database Model
1. Update Prisma schema in `backend/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive-name`
3. Run `npx prisma generate` to update the client
4. Add corresponding TypeScript types if needed

## Testing Guidelines

- Write unit tests for business logic and services
- Add integration tests for API endpoints
- Test error scenarios and edge cases
- Ensure test coverage remains high
- Test accessibility features in frontend components
- Mock external dependencies appropriately

## Important Notes

- This is a healthcare application - data security and privacy are paramount
- Always consider HIPAA compliance when handling health data
- Student and patient data must be protected at all times
- Follow the principle of least privilege for access control
- Document any security-sensitive code thoroughly
- When in doubt about security implications, ask for review

## Resources

- [README.md](../README.md) - Project overview and setup instructions
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
