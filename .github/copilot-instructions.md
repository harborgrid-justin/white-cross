# White Cross Healthcare Platform - AI Coding Guidelines

## Project Overview

White Cross is an enterprise-grade healthcare platform for school nurses managing student health records, medications, and emergency communications. The platform prioritizes HIPAA compliance, data security, and healthcare regulatory standards.

## Architecture & Structure

### Monorepo Organization
- **Root**: Orchestration via npm workspaces with concurrently for dev workflow
- **Backend**: Hapi.js API server with TypeScript, Sequelize ORM, PostgreSQL
- **Frontend**: React 18 with Vite, Redux Toolkit, TanStack Query, Tailwind CSS

### Import Path Conventions
- Frontend uses `@/` alias for all `src/` imports: `import { Button } from '@/components/ui/Button'`
- Backend uses relative paths with clear module boundaries
- Domain-driven imports: services, stores, and routes are organized by business domain

## Essential Development Commands

```bash
# Development (from root)
npm run dev                    # Both frontend (5173) + backend (3001)
npm run dev:frontend           # Frontend only
npm run dev:backend           # Backend only

# Database (from backend/ directory)
npx sequelize-cli db:migrate   # Run migrations
npm run seed                   # Custom seed script (preferred)
npx sequelize-cli db:seed:all  # Sequelize seeders

# Testing
npm test                       # All tests
npm run test:e2e              # Cypress E2E tests
npm run test:api-integration  # Playwright API tests
```

## Critical Architecture Patterns

### Backend Route Structure
Routes are organized by business domain in `/backend/src/routes/v1/`:
- `core/` - Authentication, users, access control
- `healthcare/` - Medications, health records  
- `operations/` - Students, emergency contacts, appointments
- `communications/` - Messages, notifications
- All routes aggregate through `/routes/v1/index.ts`

### Frontend State Management
Redux follows Domain-Driven Design with selective persistence:
- **Domains**: Core stores (auth, users) in `/stores/slices/`
- **Feature stores**: Co-located in `/pages/[feature]/store/`
- **HIPAA compliance**: PHI excluded from localStorage, audit logging enabled
- **Cross-tab sync**: BroadcastChannel API for state synchronization

### Service Layer Pattern
Frontend services use resilient API patterns:
- **API modules**: Domain-organized in `/services/modules/`
- **Error handling**: Centralized in `handleApiError()` utility
- **Retry logic**: Built-in with exponential backoff
- **Caching**: Query-level with TanStack Query

## HIPAA & Security Requirements

### Data Handling
- All PHI operations require audit logging
- JWT tokens with proper expiration (see `tokenUtils`)
- Input validation mandatory (Joi backend, Zod frontend)
- Rate limiting on all API endpoints

### Development Guidelines
- Never log PHI data in development
- Use data sanitization utilities in `/shared/utils/`
- Implement proper access control via middleware chain

## Testing Strategy

### Test Organization
- **Backend**: Jest with coverage thresholds (95% lines/functions)
- **Frontend**: Vitest + React Testing Library (95% coverage)
- **E2E**: Cypress for user workflows
- **API Integration**: Playwright for cross-service validation

### Testing Commands by Scope
```bash
# Focused testing
npm run cypress:run:students   # Student-specific E2E tests
cd frontend && npm run test:ui # Vitest UI mode
npm run test:coverage          # Coverage reports
```

## Key File Patterns

### Component Architecture
- Pages are route-level components in `/frontend/src/pages/`
- Shared components in `/frontend/src/components/ui/`
- Feature-specific components co-located with pages
- Custom hooks in `/frontend/src/hooks/` for cross-component logic

### Database Patterns
- Models define relationships and validations in `/backend/src/database/models/`
- Migrations use Sequelize CLI: `npx sequelize-cli migration:generate --name`
- Seeders for test data in `/backend/src/database/seeders/`

### API Integration Points
- GraphQL endpoint available alongside REST at `/graphql`
- WebSocket connections via Socket.io for real-time features  
- External integrations in `/backend/src/services/integrations/`

## Development Workflow

1. **Feature Development**: Start with domain model, then API routes, then frontend services/stores
2. **Database Changes**: Generate migration → Update model → Update seeders → Test
3. **Testing**: Write tests during development, not after (TDD encouraged)
4. **Documentation**: JSDoc required for all public APIs (see `/docs/` for patterns)

## GraphQL Integration Patterns

### Hybrid REST + GraphQL Architecture
- **GraphQL Endpoint**: Available at `/graphql` alongside REST APIs
- **Apollo Server**: Backend uses Apollo Server with Hapi.js integration
- **Apollo Client**: Frontend configured with authentication, retry logic, and caching
- **Schema Organization**: Domain-driven with Contact, Student, and healthcare entities

### GraphQL Implementation Details
- **Resolvers**: Located in `/backend/src/api/graphql/resolvers/` with permission checking
- **Schema**: Type definitions in `/backend/src/api/graphql/schema/` with healthcare-specific scalars
- **Frontend Services**: GraphQL operations in `/frontend/src/services/graphql/` with fragments
- **Cache Policies**: Pagination handling, computed fields, and PHI-aware caching

### GraphQL Usage Patterns
```typescript
// Frontend query with fragments
export const GET_CONTACTS = gql`
  ${CONTACT_FRAGMENT}
  query GetContacts($page: Int, $limit: Int) {
    contacts(page: $page, limit: $limit) {
      contacts { ...ContactFields }
      pagination { ...PaginationFields }
    }
  }
`;

// Backend resolver with permissions
contact: async (_parent, args, context) => {
  checkUserPermission(context, Resource.Contact, Action.Read);
  return await ContactService.getById(args.id);
}
```

## Middleware Chain Implementation

### Healthcare-Specific Middleware Stack
- **Authentication**: JWT middleware with healthcare session management
- **Authorization**: RBAC middleware with role hierarchy and permission checking  
- **Validation**: Healthcare validation (NPI, ICD-10, PHI detection)
- **Security Headers**: HIPAA-compliant security configurations
- **Audit Logging**: Comprehensive audit trail for PHI access
- **Rate Limiting**: Configurable limits with Redis/memory backing

### Middleware Factory Pattern
```typescript
// Healthcare workflow creation
const middleware = createHealthcareMiddleware(userLoader, {
  environment: 'production',
  redisClient: redisInstance
});

// Usage in routes
server.ext('onPreAuth', middleware.authentication.execute);
server.ext('onPostAuth', middleware.authorization.execute);
```

### Key Middleware Components
- **ValidationErrorMiddleware**: Detects XSS, SQL injection, unmasked PHI
- **SecurityHeadersMiddleware**: CORS, CSP, and healthcare-specific headers
- **AuditMiddleware**: HIPAA-compliant logging with field redaction
- **ErrorHandlerMiddleware**: Centralized error handling with severity classification

## Domain-Driven Testing Patterns

### Healthcare Testing Strategy
- **Coverage Requirements**: 95% lines/functions, 90% branches
- **PHI Protection**: No real patient data, synthetic test fixtures
- **RBAC Testing**: Role-based access verification across all domains
- **Audit Verification**: PHI access logging validation

### Testing by Domain

#### Healthcare Domain Tests
```typescript
// Health records with HIPAA compliance
describe('HealthRecordService', () => {
  it('should audit PHI access', async () => {
    await service.createRecord(validDto);
    expect(auditLogger.logPHIAccess).toHaveBeenCalled();
  });
});
```

#### Operations Domain Tests  
```typescript
// Student management with RBAC
describe('StudentAPI', () => {
  it('should restrict counselor access to medical data', async () => {
    const response = await request.get('/students/123')
      .set('Authorization', counselorToken);
    expect(response.body.medicalInfo).toBe('[RESTRICTED]');
  });
});
```

#### Communications Domain Tests
```typescript
// Message system with emergency protocols
describe('CommunicationService', () => {
  it('should prioritize emergency notifications', async () => {
    await service.sendEmergencyAlert(alertData);
    expect(mockNotificationService.sendImmediate).toHaveBeenCalled();
  });
});
```

### E2E Testing Patterns
- **API Mocking**: Comprehensive intercepts with `cy.setupHealthRecordsIntercepts()`
- **No Mock Data Verification**: Ensure UI doesn't display hardcoded test data
- **Role-Based Flows**: Test workflows for nurse, counselor, admin roles
- **Error Scenarios**: Validate error handling and user feedback
- **Audit Logging**: Verify PHI access is properly logged and tracked

### Test Data Management
```typescript
// HIPAA-compliant test fixtures
export const TEST_STUDENT = {
  id: 'test-student-001',
  firstName: 'Test',
  lastName: 'Student',
  // No real PHI - synthetic data only
};

// Cleanup after tests
afterEach(() => {
  cy.cleanupHealthRecords('test-student-id');
  cy.clearLocalStorage();
});
```

## Common Integration Patterns

- **Authentication**: JWT with refresh tokens, OAuth providers supported
- **File Uploads**: Multipart handling in backend, progress tracking in frontend
- **Real-time Updates**: Socket.io events for appointment notifications, emergency alerts
- **Monitoring**: Built-in Sentry, DataDog, and New Relic integrations