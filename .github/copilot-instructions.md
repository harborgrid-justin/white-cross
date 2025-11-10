# White Cross Healthcare Platform - AI Coding Guidelines# White Cross Healthcare Platform - AI Coding Guidelines



## Project Overview## Project Overview



White Cross is an enterprise-grade healthcare platform for school nurses managing student health records, medications, and emergency communications. The platform prioritizes HIPAA compliance, data security, and healthcare regulatory standards.White Cross is an enterprise-grade healthcare platform for school nurses managing student health records, medications, and emergency communications. The platform prioritizes HIPAA compliance, data security, and healthcare regulatory standards.



## Architecture & Structure## Architecture & Structure



### Monorepo Organization### Monorepo Organization

- **Root**: Orchestration via npm workspaces with concurrently for dev workflow- **Root**: Orchestration via npm workspaces with concurrently for dev workflow

- **Backend**: NestJS API server with TypeScript, Sequelize ORM, PostgreSQL- **Backend**: Hapi.js API server with TypeScript, Sequelize ORM, PostgreSQL

- **Frontend**: Next.js 16 with App Router, React 19, TypeScript- **Frontend**: React 18 with Vite, Redux Toolkit, TanStack Query, Tailwind CSS



### Import Path Conventions### Import Path Conventions

- Frontend uses `@/` alias for all `src/` imports: `import { Button } from '@/components/ui/Button'`- Frontend uses `@/` alias for all `src/` imports: `import { Button } from '@/components/ui/Button'`

- Backend uses relative paths with clear module boundaries- Backend uses relative paths with clear module boundaries

- Domain-driven imports: services, stores, and routes are organized by business domain- Domain-driven imports: services, stores, and routes are organized by business domain



## Essential Development Commands## Essential Development Commands



### Development (from root)```bash

```bash# Development (from root)

npm run dev                    # Both frontend (3000) + backend (3001)npm run dev                    # Both frontend (5173) + backend (3001)

npm run dev:frontend           # Frontend onlynpm run dev:frontend           # Frontend only

npm run dev:backend           # Backend onlynpm run dev:backend           # Backend only

```

# Database (from backend/ directory)

### Database (from backend/ directory)npx sequelize-cli db:migrate   # Run migrations

```bashnpm run seed                   # Custom seed script (preferred)

npx sequelize-cli db:migrate   # Run migrationsnpx sequelize-cli db:seed:all  # Sequelize seeders

npm run seed                   # Custom seed script (preferred)

npx sequelize-cli db:seed:all  # Sequelize seeders# Testing

```npm test                       # All tests

npm run test:e2e              # Cypress E2E tests

### Testingnpm run test:api-integration  # Playwright API tests

```bash```

npm test                       # All tests

npm run test:e2e              # Cypress E2E tests## Critical Architecture Patterns

npm run test:api-integration  # Playwright API tests

```### Backend Route Structure

Routes are organized by business domain in `/backend/src/routes/v1/`:

## Critical Architecture Patterns- `core/` - Authentication, users, access control

- `healthcare/` - Medications, health records  

### Backend Architecture (NestJS)- `operations/` - Students, emergency contacts, appointments

Routes are organized by business domain in `/backend/src/`:- `communications/` - Messages, notifications

- `auth/` - Authentication, users, access control- All routes aggregate through `/routes/v1/index.ts`

- `health-record/` - Health records, medications

- `student/` - Student management### Frontend State Management

- `communication/` - Messages, notificationsRedux follows Domain-Driven Design with selective persistence:

- `emergency-contact/` - Emergency contacts and alerts- **Domains**: Core stores (auth, users) in `/stores/slices/`

- All routes aggregate through `/routes/v1/index.ts`- **Feature stores**: Co-located in `/pages/[feature]/store/`

- **HIPAA compliance**: PHI excluded from localStorage, audit logging enabled

### Frontend Architecture (Next.js 16 App Router)- **Cross-tab sync**: BroadcastChannel API for state synchronization



**App Router Structure:**### Service Layer Pattern

```Frontend services use resilient API patterns:

src/app/- **API modules**: Domain-organized in `/services/modules/`

├── (dashboard)/          # Protected routes with dashboard layout- **Error handling**: Centralized in `handleApiError()` utility

│   ├── students/         # Student management- **Retry logic**: Built-in with exponential backoff

│   ├── medications/      # Medication administration- **Caching**: Query-level with TanStack Query

│   ├── health-records/   # Health records (PHI)

│   ├── appointments/     # Appointment scheduling## HIPAA & Security Requirements

│   ├── incidents/        # Incident reporting

│   ├── communications/   # Messaging & broadcasts### Data Handling

│   ├── documents/        # Document management- All PHI operations require audit logging

│   ├── analytics/        # Reporting & analytics- JWT tokens with proper expiration (see `tokenUtils`)

│   └── admin/           # System administration- Input validation mandatory (Joi backend, Zod frontend)

├── api/                 # Next.js API routes (proxies to backend)- Rate limiting on all API endpoints

└── providers.tsx        # Client-side providers wrapper

```### Development Guidelines

- Never log PHI data in development

**Three-layer State Management:**- Use data sanitization utilities in `/shared/utils/`

- Implement proper access control via middleware chain

1. **Server State (TanStack Query)** - Primary data fetching

   - Located in `src/hooks/domains/*/queries/`## Testing Strategy

   - Used for all backend data (students, medications, health records)

   - Configured with HIPAA-compliant caching in `src/config/queryClient.ts`### Test Organization

   - PHI data marked with `containsPHI: true` metadata (never persisted)- **Backend**: Jest with coverage thresholds (95% lines/functions)

- **Frontend**: Vitest + React Testing Library (95% coverage)

2. **Client State (Redux Toolkit)** - UI state and offline support- **E2E**: Cypress for user workflows

   - Store: `src/stores/store.ts`- **API Integration**: Playwright for cross-service validation

   - Slices: `src/stores/slices/`

   - Domain-organized: auth, students, healthRecords, medications, etc.### Testing Commands by Scope

   - **Critical:** PHI excluded from localStorage persistence (HIPAA)```bash

   - Uses custom persistence middleware (non-PHI only)# Focused testing

npm run cypress:run:students   # Student-specific E2E tests

3. **Local State (React useState/Context)** - Component and feature-scoped statecd frontend && npm run test:ui # Vitest UI mode

   - Form state: React Hook Form + Zod (`src/lib/validations/`)npm run test:coverage          # Coverage reports

   - Component state: useState, useReducer```

   - Feature contexts: `src/contexts/` (e.g., FollowUpActionContext)

   - Schemas: `src/lib/validations/`## Key File Patterns



### Service Layer Pattern### Component Architecture

Frontend services use resilient API patterns:- Pages are route-level components in `/frontend/src/pages/`

- **API modules**: Domain-organized in `/services/modules/`- Shared components in `/frontend/src/components/ui/`

- **Error handling**: Centralized in `handleApiError()` utility- Feature-specific components co-located with pages

- **Retry logic**: Built-in with exponential backoff- Custom hooks in `/frontend/src/hooks/` for cross-component logic

- **Caching**: Query-level with TanStack Query

### Database Patterns

## HIPAA & Security Requirements- Models define relationships and validations in `/backend/src/database/models/`

- Migrations use Sequelize CLI: `npx sequelize-cli migration:generate --name`

### Data Handling- Seeders for test data in `/backend/src/database/seeders/`

- All PHI operations require audit logging

- JWT tokens with proper expiration (see `tokenUtils`)### API Integration Points

- Input validation mandatory (Joi backend, Zod frontend)- GraphQL endpoint available alongside REST at `/graphql`

- Rate limiting on all API endpoints- WebSocket connections via Socket.io for real-time features  

- External integrations in `/backend/src/services/integrations/`

### Development Guidelines

- Never log PHI data in development## Development Workflow

- Use data sanitization utilities in `/shared/utils/`

- Implement proper access control via middleware chain1. **Feature Development**: Start with domain model, then API routes, then frontend services/stores

2. **Database Changes**: Generate migration → Update model → Update seeders → Test

## Testing Strategy3. **Testing**: Write tests during development, not after (TDD encouraged)

4. **Documentation**: JSDoc required for all public APIs (see `/docs/` for patterns)

### Test Organization

- **Backend**: Jest with coverage thresholds (95% lines/functions)## GraphQL Integration Patterns

- **Frontend**: Vitest + React Testing Library (95% coverage)

- **E2E**: Cypress for user workflows### Hybrid REST + GraphQL Architecture

- **API Integration**: Playwright for cross-service validation- **GraphQL Endpoint**: Available at `/graphql` alongside REST APIs

- **Apollo Server**: Backend uses Apollo Server with Hapi.js integration

### Testing Commands by Scope- **Apollo Client**: Frontend configured with authentication, retry logic, and caching

```bash- **Schema Organization**: Domain-driven with Contact, Student, and healthcare entities

# Focused testing

npm run cypress:run:students   # Student-specific E2E tests### GraphQL Implementation Details

cd frontend && npm run test:ui # Vitest UI mode- **Resolvers**: Located in `/backend/src/api/graphql/resolvers/` with permission checking

npm run test:coverage          # Coverage reports- **Schema**: Type definitions in `/backend/src/api/graphql/schema/` with healthcare-specific scalars

```- **Frontend Services**: GraphQL operations in `/frontend/src/services/graphql/` with fragments

- **Cache Policies**: Pagination handling, computed fields, and PHI-aware caching

## Key File Patterns

### GraphQL Usage Patterns

### Component Architecture```typescript

- Pages are route-level components in `/frontend/src/pages/`// Frontend query with fragments

- Shared components in `/frontend/src/components/ui/`export const GET_CONTACTS = gql`

- Feature-specific components co-located with pages  ${CONTACT_FRAGMENT}

- Custom hooks in `/frontend/src/hooks/` for cross-component logic  query GetContacts($page: Int, $limit: Int) {

    contacts(page: $page, limit: $limit) {

### Database Patterns      contacts { ...ContactFields }

- Models define relationships and validations in `/backend/src/database/models/`      pagination { ...PaginationFields }

- Migrations use Sequelize CLI: `npx sequelize-cli migration:generate --name`    }

- Seeders for test data in `/backend/src/database/seeders/`  }

`;

### API Integration Points

- GraphQL endpoint available alongside REST at `/graphql`// Backend resolver with permissions

- WebSocket connections via Socket.io for real-time featurescontact: async (_parent, args, context) => {

- External integrations in `/backend/src/services/integrations/`  checkUserPermission(context, Resource.Contact, Action.Read);

  return await ContactService.getById(args.id);

## Development Workflow}

```

1. **Feature Development**: Start with domain model, then API routes, then frontend services/stores

2. **Database Changes**: Generate migration → Update model → Update seeders → Test## Middleware Chain Implementation

3. **Testing**: Write tests during development, not after (TDD encouraged)

4. **Documentation**: JSDoc required for all public APIs (see `/docs/` for patterns)### Healthcare-Specific Middleware Stack

- **Authentication**: JWT middleware with healthcare session management

## GraphQL Integration Patterns- **Authorization**: RBAC middleware with role hierarchy and permission checking  

- **Validation**: Healthcare validation (NPI, ICD-10, PHI detection)

### Hybrid REST + GraphQL Architecture- **Security Headers**: HIPAA-compliant security configurations

- **GraphQL Endpoint**: Available at `/graphql` alongside REST APIs- **Audit Logging**: Comprehensive audit trail for PHI access

- **Apollo Server**: Backend uses Apollo Server with Hapi.js integration- **Rate Limiting**: Configurable limits with Redis/memory backing

- **Apollo Client**: Frontend configured with authentication, retry logic, and caching

- **Schema Organization**: Domain-driven with Contact, Student, and healthcare entities### Middleware Factory Pattern

```typescript

### GraphQL Implementation Details// Healthcare workflow creation

- **Resolvers**: Located in `/backend/src/api/graphql/resolvers/` with permission checkingconst middleware = createHealthcareMiddleware(userLoader, {

- **Schema**: Type definitions in `/backend/src/api/graphql/schema/` with healthcare-specific scalars  environment: 'production',

- **Frontend Services**: GraphQL operations in `/frontend/src/services/graphql/` with fragments  redisClient: redisInstance

- **Cache Policies**: Pagination handling, computed fields, and PHI-aware caching});



### GraphQL Usage Patterns// Usage in routes

```typescriptserver.ext('onPreAuth', middleware.authentication.execute);

// Frontend query with fragmentsserver.ext('onPostAuth', middleware.authorization.execute);

export const GET_CONTACTS = gql````

  ${CONTACT_FRAGMENT}

  query GetContacts($page: Int, $limit: Int) {### Key Middleware Components

    contacts(page: $page, limit: $limit) {- **ValidationErrorMiddleware**: Detects XSS, SQL injection, unmasked PHI

      contacts { ...ContactFields }- **SecurityHeadersMiddleware**: CORS, CSP, and healthcare-specific headers

      pagination { ...PaginationFields }- **AuditMiddleware**: HIPAA-compliant logging with field redaction

    }- **ErrorHandlerMiddleware**: Centralized error handling with severity classification

  }

`;## Domain-Driven Testing Patterns



// Backend resolver with permissions### Healthcare Testing Strategy

contact: async (_parent, args, context) => {- **Coverage Requirements**: 95% lines/functions, 90% branches

  checkUserPermission(context, Resource.Contact, Action.Read);- **PHI Protection**: No real patient data, synthetic test fixtures

  return await ContactService.getById(args.id);- **RBAC Testing**: Role-based access verification across all domains

}- **Audit Verification**: PHI access logging validation

```

### Testing by Domain

## Middleware Chain Implementation

#### Healthcare Domain Tests

### Healthcare-Specific Middleware Stack```typescript

- **Authentication**: JWT middleware with healthcare session management// Health records with HIPAA compliance

- **Authorization**: RBAC middleware with role hierarchy and permission checkingdescribe('HealthRecordService', () => {

- **Validation**: Healthcare validation (NPI, ICD-10, PHI detection)  it('should audit PHI access', async () => {

- **Security Headers**: HIPAA-compliant security configurations    await service.createRecord(validDto);

- **Audit Logging**: Comprehensive audit trail for PHI access    expect(auditLogger.logPHIAccess).toHaveBeenCalled();

- **Rate Limiting**: Configurable limits with Redis/memory backing  });

});

### Middleware Factory Pattern```

```typescript

// Healthcare workflow creation#### Operations Domain Tests  

const middleware = createHealthcareMiddleware(userLoader, {```typescript

  environment: 'production',// Student management with RBAC

  redisClient: redisInstancedescribe('StudentAPI', () => {

});  it('should restrict counselor access to medical data', async () => {

    const response = await request.get('/students/123')

// Usage in routes      .set('Authorization', counselorToken);

server.ext('onPreAuth', middleware.authentication.execute);    expect(response.body.medicalInfo).toBe('[RESTRICTED]');

server.ext('onPostAuth', middleware.authorization.execute);  });

```});

```

### Key Middleware Components

- **ValidationErrorMiddleware**: Detects XSS, SQL injection, unmasked PHI#### Communications Domain Tests

- **SecurityHeadersMiddleware**: CORS, CSP, and healthcare-specific headers```typescript

- **AuditMiddleware**: HIPAA-compliant logging with field redaction// Message system with emergency protocols

- **ErrorHandlerMiddleware**: Centralized error handling with severity classificationdescribe('CommunicationService', () => {

  it('should prioritize emergency notifications', async () => {

## Domain-Driven Testing Patterns    await service.sendEmergencyAlert(alertData);

    expect(mockNotificationService.sendImmediate).toHaveBeenCalled();

### Healthcare Testing Strategy  });

- **Coverage Requirements**: 95% lines/functions, 90% branches});

- **PHI Protection**: No real patient data, synthetic test fixtures```

- **RBAC Testing**: Role-based access verification across all domains

- **Audit Verification**: PHI access logging validation### E2E Testing Patterns

- **API Mocking**: Comprehensive intercepts with `cy.setupHealthRecordsIntercepts()`

### Testing by Domain- **No Mock Data Verification**: Ensure UI doesn't display hardcoded test data

- **Role-Based Flows**: Test workflows for nurse, counselor, admin roles

#### Healthcare Domain Tests- **Error Scenarios**: Validate error handling and user feedback

```typescript- **Audit Logging**: Verify PHI access is properly logged and tracked

// Health records with HIPAA compliance

describe('HealthRecordService', () => {### Test Data Management

  it('should audit PHI access', async () => {```typescript

    await service.createRecord(validDto);// HIPAA-compliant test fixtures

    expect(auditLogger.logPHIAccess).toHaveBeenCalled();export const TEST_STUDENT = {

  });  id: 'test-student-001',

});  firstName: 'Test',

```  lastName: 'Student',

  // No real PHI - synthetic data only

#### Operations Domain Tests};

```typescript

// Student management with RBAC// Cleanup after tests

describe('StudentAPI', () => {afterEach(() => {

  it('should restrict counselor access to medical data', async () => {  cy.cleanupHealthRecords('test-student-id');

    const response = await request.get('/students/123')  cy.clearLocalStorage();

      .set('Authorization', counselorToken);});

    expect(response.body.medicalInfo).toBe('[RESTRICTED]');```

  });

});## Common Integration Patterns

```

- **Authentication**: JWT with refresh tokens, OAuth providers supported

#### Communications Domain Tests- **File Uploads**: Multipart handling in backend, progress tracking in frontend

```typescript- **Real-time Updates**: Socket.io events for appointment notifications, emergency alerts

// Message system with emergency protocols- **Monitoring**: Built-in Sentry, DataDog, and New Relic integrations
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

## Next.js 16 Specific Patterns

### React Compiler Configuration
- **Location**: Top-level `reactCompiler: true` in `next.config.ts` (moved from experimental in Next.js 16)
- **Dependency**: Requires `babel-plugin-react-compiler` package
- **Usage**: Automatic optimization of React components for better performance

### Bundle Splitting Strategy
```typescript
// next.config.ts - Aggressive bundle splitting for performance
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.optimization.splitChunks.cacheGroups = {
      calendar: { test: /@fullcalendar/, name: 'calendar', priority: 40 },
      pdfGeneration: { test: /(jspdf|html2pdf)/, name: 'pdf-generation', priority: 39 },
      charts: { test: /(recharts|d3-)/, name: 'charts', priority: 38 },
      // ... additional chunks
    };
  }
  return config;
};
```

### App Router Parallel Routes
- **Modal Routes**: `@modal/(...)` for overlay modals
- **Sidebar Routes**: `@sidebar/(...)` for collapsible sidebars
- **Intercepting Routes**: `(...)` for route interception

### Server Components vs Client Components
- **Server Components**: Default for App Router (data fetching, no interactivity)
- **Client Components**: `'use client'` directive required for React hooks, event handlers
- **Server Actions**: Async functions for form submissions and mutations

## Domain Hook Architecture

### Hook Organization Pattern
```
src/hooks/domains/
├── students/
│   ├── queries/          # TanStack Query hooks
│   │   ├── useStudents.ts
│   │   └── useStudentById.ts
│   ├── mutations/        # Data modification hooks
│   │   ├── useCreateStudent.ts
│   │   └── useUpdateStudent.ts
│   ├── composites/       # Complex multi-step operations
│   │   └── useStudentWorkflow.ts
│   └── index.ts         # Barrel exports
```

### Query Hook Pattern
```typescript
// src/hooks/domains/students/queries/useStudents.ts
export const useStudents = (filters?: StudentFilters) => {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentApi.getStudents(filters),
    meta: {
      containsPHI: true,  // CRITICAL: Mark PHI data
      errorMessage: 'Failed to load students'
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Mutation Hook Pattern
```typescript
// src/hooks/domains/students/mutations/useCreateStudent.ts
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentApi.createStudent,
    onSuccess: (newStudent) => {
      // Invalidate and refetch student lists
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      // Optimistically update cache
      queryClient.setQueryData(
        studentKeys.detail(newStudent.id),
        newStudent
      );
    },
    meta: {
      successMessage: 'Student created successfully',
      errorMessage: 'Failed to create student'
    }
  });
};
```

## Redux State Management Patterns

### Slice Organization
```typescript
// src/stores/slices/studentsSlice.ts
const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    // UI state reducers (filters, selections, etc.)
    setSelectedStudent: (state, action) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle async actions from RTK Query
    builder.addMatcher(
      studentApi.endpoints.getStudents.matchFulfilled,
      (state, action) => {
        // Update local state based on API responses
      }
    );
  },
});
```

### PHI-Aware Persistence
```typescript
// src/stores/store.ts - Custom persistence middleware
const persistConfig = {
  key: 'white-cross',
  storage: localStorage,
  whitelist: ['auth', 'ui', 'settings'], // EXCLUDE PHI slices
  blacklist: ['students', 'healthRecords', 'medications'], // PHI data
};
```

## API Client Architecture

### Dual API Client Pattern
```typescript
// Client-side (browser) - src/lib/api/client.ts
export const clientGet = (url: string) => {
  return apiClient.get(url, {
    headers: { 'X-CSRF-Token': getCsrfToken() }
  });
};

// Server-side (SSR) - src/lib/server/api-client.ts
export const serverGet = (url: string) => {
  return apiClient.get(`${process.env.BACKEND_URL}${url}`);
};
```

### Error Handling Chain
```typescript
// src/lib/api/errorHandler.ts
export const handleApiError = (error: ApiError) => {
  // 1. Log HIPAA-compliant audit trail
  auditLogger.logApiError(error);

  // 2. Transform error for user display
  const userMessage = getUserFriendlyMessage(error);

  // 3. Handle specific error types
  if (error.status === 401) {
    redirectToLogin();
  } else if (error.status === 403) {
    showAccessDenied();
  }

  return userMessage;
};
```

## Validation Patterns

### Zod Schema Pattern
```typescript
// src/lib/validations/student.schema.ts
export const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.date().max(new Date(), 'Date of birth cannot be in the future'),
  allergies: z.array(z.string()).optional(),
});

// With React Hook Form
const form = useForm<StudentFormData>({
  resolver: zodResolver(studentSchema),
});
```

### Backend Validation Pattern
```typescript
// src/student/dto/create-student.dto.ts
export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @MaxDate(new Date())
  dateOfBirth: string;
}
```

## Performance Optimization Patterns

### Query Optimization
```typescript
// src/config/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000,   // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.status >= 400 && error?.status < 500) {
          return error.status === 408 || error.status === 429;
        }
        return failureCount < 3;
      },
    },
  },
});
```

### Image Optimization
```typescript
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
}
```

## Security Implementation Patterns

### CSRF Protection
```typescript
// All mutations include CSRF token
const csrfToken = getCsrfToken(); // From http-only cookie
headers: {
  'X-CSRF-Token': csrfToken,
}
```

### PHI Audit Logging
```typescript
// src/hooks/usePHIAudit.ts
export const usePHIAudit = () => {
  const auditPHI = useCallback((action: string, resourceId: string) => {
    auditLogger.log({
      action,
      resourceId,
      timestamp: new Date(),
      userId: currentUser.id,
      ipAddress: getClientIP(),
      userAgent: navigator.userAgent,
    });
  }, [currentUser]);

  return { auditPHI };
};
```

## Testing Implementation Patterns

### Component Testing with RTL
```typescript
// src/components/students/StudentCard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('StudentCard', () => {
  it('displays student information', async () => {
    render(<StudentCard studentId="123" />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### E2E Testing with Cypress
```typescript
// cypress/e2e/students.cy.ts
describe('Student Management', () => {
  beforeEach(() => {
    cy.login('nurse@test.com', 'password');
    cy.setupHealthRecordsIntercepts(); // Mock PHI data
  });

  it('should create new student', () => {
    cy.visit('/students');
    cy.get('[data-cy="add-student"]').click();
    cy.get('[data-cy="first-name"]').type('Test Student');
    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="success-message"]').should('be.visible');
  });
});
```

## Deployment Patterns

### Docker Configuration
```dockerfile
# Multi-stage build for Next.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
EXPOSE 3000
CMD ["node", "server.js"]
```

### Environment Configuration
```env
# Production environment
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.whitecross.com
NEXT_PUBLIC_SENTRY_DSN=https://...
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

This comprehensive guide covers the essential patterns and conventions that make White Cross a maintainable, secure, and performant healthcare platform. Always prioritize HIPAA compliance and data security in all implementations.