# Architecture Notes - CRUD Operations Validation

## Frontend Architecture Overview

### Technology Stack
- **Framework**: React with TypeScript
- **State Management**:
  - Redux (global state)
  - React Query (server state)
  - Context API (local/feature state)
  - Apollo Client (GraphQL)
- **Routing**: React Router v6
- **UI**: Tailwind CSS
- **Forms**: React Hook Form (assumed based on patterns)
- **API**: REST + GraphQL hybrid

### Project Structure
```
frontend/src/
├── components/          # Shared components
│   ├── features/       # Feature-specific components
│   ├── shared/         # Reusable components
│   └── ui/            # UI primitives
├── pages/              # Page components (20 domains identified)
│   ├── {domain}/
│   │   ├── components/  # Domain-specific components
│   │   ├── store/      # Domain-specific state
│   │   └── routes.tsx  # Domain routes
├── routes/             # Main routing configuration
├── stores/             # Redux stores
├── hooks/              # Custom hooks
├── services/           # API services
└── types/              # TypeScript types
```

## Domain Organization

### Identified Domains (20 Total)
1. Access Control - Security and permissions
2. Administration - System management
3. Appointments - Scheduling
4. Authentication - Login/auth
5. Budget - Financial tracking
6. Communication - Messaging
7. Compliance - Regulatory compliance
8. Configuration - System settings
9. Contacts - Emergency contacts
10. Dashboard - Overview
11. Documents - Document management
12. Health Records - Medical data (CRITICAL)
13. Incidents - Incident tracking (CRITICAL)
14. Integration - External systems
15. Inventory - Supply management
16. Medications - Medication management (CRITICAL)
17. Purchase Orders - Procurement
18. Reports - Reporting
19. Students - Student management (CRITICAL)
20. Vendors - Vendor management

## State Management Patterns

### Observed Patterns
1. **Redux Store per Domain** - Each domain has its own store slice
2. **React Query for API Calls** - Server state management
3. **Context for Feature State** - Feature-specific state (e.g., FollowUpActionContext, WitnessStatementContext)
4. **Apollo Client for GraphQL** - Some domains use GraphQL

### Concerns
- Multiple state management approaches could lead to inconsistency
- Need to verify which pattern is used for CRUD operations
- Potential for state duplication across layers

## CRUD Operation Patterns to Investigate

### Modal/Dialog Patterns
- Health Records: Multiple modals (AllergyModal, ConditionModal, VaccinationModal, etc.)
- Access Control: CreateRoleDialog, EditRoleDialog, AssignPermissionsDialog
- Admin: CreateUserForm, EditUserForm

### Form Submission Patterns
- Need to verify how forms are submitted
- Need to check error handling
- Need to verify success feedback

### API Integration Patterns
- REST endpoints via services
- GraphQL via Apollo Client
- Need to identify which is used for each domain

## Type Safety Considerations

### Type Definition Locations
- `/types/` directory for shared types
- Domain-specific types in page directories
- Need to verify CRUD operation type safety

### Concerns
- Ensure all CRUD operations have proper TypeScript types
- Verify API response types
- Check for `any` usage in CRUD code

## Error Handling Patterns

### Observed Components
- ErrorBoundary (global)
- RouteErrorBoundary
- HealthRecordsErrorBoundary
- Session management with SessionExpiredModal
- AccessDenied component

### Concerns
- Need to verify error handling in CRUD operations
- Check for user feedback on errors
- Verify recovery mechanisms

## Security Considerations

### Authentication & Authorization
- AuthGuard wrapper for protected routes
- Role-based access control (RBAC)
- Permission checking

### Concerns
- Ensure CRUD operations respect permissions
- Verify audit logging for sensitive operations
- Check for HIPAA compliance in health data CRUD

## Testing Considerations

### Test Files Observed
- Context tests (FollowUpActionContext.test.tsx, WitnessStatementContext.test.tsx)
- Navigation guards tests (navigationGuards.test.tsx)

### Gaps to Identify
- CRUD operation test coverage
- Integration test coverage
- E2E test coverage for critical workflows

## Integration Points

### Backend Integration
- REST API at `/api`
- GraphQL endpoint
- Health check at `/health`

### External Systems
- Integration domain suggests external system connections
- Need to verify impact on CRUD operations

## Performance Considerations

### Observed Patterns
- Query persistence (setupQueryPersistence)
- Optimistic updates (OptimisticUpdateIndicator component)
- Monitoring infrastructure

### Concerns
- Verify optimistic updates for CRUD operations
- Check for proper cache invalidation
- Ensure efficient re-rendering

## Compliance & Audit

### HIPAA Compliance
- Health records are PHI (Protected Health Information)
- Need to verify audit trails for all health data CRUD
- Check for proper data sanitization

### Audit Logging
- AuditLog component/domain exists
- Need to verify CRUD operations are logged
- Check retention and reporting

## Key Design Decisions Needed

1. **Standardize State Management for CRUD**
   - Choose primary pattern (Redux + React Query recommended)
   - Document when to use each pattern

2. **Create Reusable CRUD Components**
   - Standard modal/dialog component
   - Standard form component
   - Standard table/list component

3. **Implement Standard Error Handling**
   - Consistent error display
   - Recovery mechanisms
   - User-friendly messages

4. **Ensure Type Safety**
   - All CRUD operations fully typed
   - No `any` types in CRUD code
   - API response validation

5. **Implement Comprehensive Testing**
   - Unit tests for all CRUD operations
   - Integration tests for critical flows
   - E2E tests for user workflows

## Next Analysis Steps

1. Read actual page implementations to understand CRUD patterns
2. Analyze modal/dialog components for Create/Update operations
3. Check API service files for CRUD endpoints
4. Verify state management for each domain
5. Document missing/incomplete CRUD operations
6. Create recommendations for standardization
