# Data Fetching Strategy - Implementation Summary

## Overview

This document summarizes the comprehensive data fetching strategy designed for the White Cross healthcare platform to replace all mock data with proper API integration using TanStack Query.

## Key Documents

1. **[DATA_FETCHING_STRATEGY.md](./DATA_FETCHING_STRATEGY.md)** - Complete strategy guide (78,000+ words)
   - Architecture overview
   - Module-by-module implementation details
   - Security and HIPAA compliance
   - Migration plan (12-week timeline)
   - Testing strategies
   - Best practices

2. **[DATA_FETCHING_QUICK_REFERENCE.md](./DATA_FETCHING_QUICK_REFERENCE.md)** - Developer quick reference
   - Common patterns and code snippets
   - Hook usage examples
   - Cache configuration reference
   - Testing patterns
   - Troubleshooting guide

## Architecture Highlights

### Three-Layer Architecture

```
Components → Domain Hooks → API Services → Backend
```

- **Components**: Use domain-specific hooks (e.g., `useStudents()`)
- **Hooks Layer**: TanStack Query integration with business logic
- **API Services**: Type-safe HTTP client (BaseApiService pattern)
- **Backend**: Express.js + Prisma ORM + PostgreSQL

### Core Infrastructure (Already Implemented)

The platform already has robust foundational infrastructure in place:

1. **BaseApiService** (`frontend/src/services/core/BaseApiService.ts`)
   - CRUD operations base class
   - Zod validation integration
   - Type-safe HTTP methods
   - Export/import functionality

2. **QueryHooksFactory** (`frontend/src/services/core/QueryHooksFactory.ts`)
   - Generates type-safe TanStack Query hooks
   - Optimistic updates support
   - Automatic cache invalidation
   - Error handling

3. **ApiClient** (`frontend/src/services/core/ApiClient.ts`)
   - Axios wrapper with interceptors
   - Authentication handling
   - Request/response transformation

4. **Medication Module** (Reference Implementation)
   - `frontend/src/services/modules/medication/`
   - Complete implementation of safety-critical workflows
   - Five Rights verification
   - Offline queue support
   - Barcode scanning integration

## Module Status

### Completed Modules

| Module | Status | Location |
|--------|--------|----------|
| **Medication Formulary** | ✅ Complete | `frontend/src/services/modules/medication/hooks/useMedicationFormulary.ts` |
| **Medication Administration** | ✅ Complete | `frontend/src/services/modules/medication/hooks/useMedicationAdministration.ts` |
| **Offline Queue** | ✅ Complete | `frontend/src/services/modules/medication/hooks/useOfflineQueue.ts` |

### Modules to Implement (Priority Order)

Based on the 12-week migration plan:

#### Phase 1: Foundation (Weeks 1-2)
- Audit logging middleware
- Error classification system
- RBAC hooks
- Type library standardization

#### Phase 2: High-Priority Modules (Weeks 3-4)
- ☐ Student Management
- ☐ Appointments
- ☐ Medication inventory integration

#### Phase 3: Health Data Modules (Weeks 5-6)
- ☐ Health Records
- ☐ Emergency Contacts
- ☐ Incident Reports

#### Phase 4: Administrative Modules (Weeks 7-8)
- ☐ Inventory Management
- ☐ Compliance & Audit
- ☐ Communications
- ☐ Documents

#### Phase 5: Reports & Analytics (Weeks 9-10)
- ☐ Dashboard Analytics
- ☐ Custom Reports
- ☐ Medication Reports

#### Phase 6: Testing & Optimization (Weeks 11-12)
- ☐ Integration testing
- ☐ Performance optimization
- ☐ Security audit
- ☐ Documentation

## Key Patterns

### 1. Query Hook Pattern

```typescript
export function useStudents(filters?: StudentFilters) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}
```

### 2. Mutation Hook Pattern

```typescript
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentDto) => studentsApi.create(data),
    onSuccess: (newStudent) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.setQueryData(studentKeys.detail(newStudent.id), newStudent);
    },
  });
}
```

### 3. Query Key Factory Pattern

```typescript
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters?: StudentFilters) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
};
```

## Healthcare-Critical Safety Features

### 1. No Caching for Safety-Critical Data

```typescript
// Medication administration - ALWAYS fresh data
const { data } = useMedicationReminders({
  staleTime: 0, // No cache
  refetchInterval: 60 * 1000, // Refresh every minute
});
```

### 2. No Optimistic Updates for Healthcare Operations

```typescript
// ❌ NEVER for medication administration
const recordAdmin = useRecordMedicationAdministration({
  // NO optimistic updates - wait for server confirmation
  retry: false, // Never retry automatically
});
```

### 3. Automatic Audit Logging

```typescript
export function useHealthRecords(studentId: string) {
  return useQuery({
    queryKey: healthRecordKeys.list(studentId),
    queryFn: async () => {
      const records = await healthRecordsApi.getAll(studentId);

      // Audit log PHI access
      await auditApi.logAccess({
        resource: 'health_records',
        resourceId: studentId,
        action: 'view',
      });

      return records;
    },
  });
}
```

## Cache Strategy Summary

| Data Type | staleTime | gcTime | Example |
|-----------|-----------|--------|---------|
| **Static** | 24 hours | 7 days | Drug formulary, medication categories |
| **Semi-static** | 10 minutes | 30 minutes | Student roster, emergency contacts |
| **Dynamic** | 2-5 minutes | 10 minutes | Appointment schedules, medication logs |
| **Real-time** | 0-30 seconds | 2 minutes | Medication reminders, nurse availability |
| **Safety-critical** | 0 (no cache) | 0 | Medication administration, Five Rights |

## Naming Conventions

### Hooks
- List queries: `use[ModuleName]()`
- Detail queries: `use[ModuleName]Detail(id)`
- Search queries: `use[ModuleName]Search(query)`
- Create mutations: `useCreate[ModuleName]()`
- Update mutations: `useUpdate[ModuleName]()`
- Delete mutations: `useDelete[ModuleName]()`

### Query Keys
- Module keys: `[moduleName]Keys`
- Operation keys: lowercase with underscores
- Example: `studentKeys.list(filters)`, `studentKeys.detail(id)`

### API Services
- Class names: `[ModuleName]Api`
- Instance names: `[moduleName]Api`
- Example: `StudentsApi`, `studentsApi`

## Directory Structure

```
frontend/src/
├── services/
│   ├── core/                       # Reusable core services
│   │   ├── ApiClient.ts            # ✅ Implemented
│   │   ├── BaseApiService.ts       # ✅ Implemented
│   │   └── QueryHooksFactory.ts    # ✅ Implemented
│   │
│   └── modules/                    # Domain modules
│       ├── medication/             # ✅ Reference implementation
│       │   ├── api/
│       │   │   ├── MedicationFormularyApi.ts
│       │   │   ├── AdministrationApi.ts
│       │   │   └── PrescriptionApi.ts
│       │   └── hooks/
│       │       ├── useMedicationFormulary.ts
│       │       ├── useMedicationAdministration.ts
│       │       └── useOfflineQueue.ts
│       │
│       ├── students/               # ☐ To implement
│       ├── appointments/           # ☐ To implement
│       ├── health-records/         # ☐ To implement
│       └── [other modules...]
```

## Testing Strategy

### 1. Unit Tests - API Services
```typescript
describe('StudentsApi', () => {
  it('should fetch all students with filters', async () => {
    const result = await studentsApi.getAll({ grade: '5' });
    expect(result.data).toBeDefined();
  });
});
```

### 2. Integration Tests - Hooks
```typescript
describe('useStudents', () => {
  it('should fetch students successfully', async () => {
    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.students).toBeDefined();
    });
  });
});
```

### 3. E2E Tests - Cypress
```typescript
describe('Student Management', () => {
  it('should create new student', () => {
    cy.get('[data-testid="add-student-btn"]').click();
    // Fill form...
    cy.get('[data-testid="submit-btn"]').click();
    cy.get('[data-testid="toast-success"]').should('contain', 'Student created');
  });
});
```

## Migration Checklist Template

For each module, follow this checklist:

### API Layer
- [ ] Create API service class (extends BaseApiService)
- [ ] Define TypeScript interfaces
- [ ] Create Zod validation schemas
- [ ] Implement CRUD operations
- [ ] Add specialized endpoints
- [ ] Write API unit tests

### Hook Layer
- [ ] Define query key factory
- [ ] Create list hook
- [ ] Create detail hook
- [ ] Create search hook (if applicable)
- [ ] Create mutation hooks (create, update, delete)
- [ ] Add error handling
- [ ] Configure cache strategy
- [ ] Write hook integration tests

### Component Integration
- [ ] Update components to use new hooks
- [ ] Remove mock data imports
- [ ] Add loading states
- [ ] Add error states
- [ ] Update prop types
- [ ] Test user flows

### Testing
- [ ] Unit tests for API service
- [ ] Integration tests for hooks
- [ ] E2E tests for critical flows
- [ ] Performance testing
- [ ] Security testing

### Documentation
- [ ] API documentation
- [ ] Hook documentation
- [ ] Usage examples
- [ ] Migration notes

## Next Steps

### Immediate Actions (Week 1)

1. **Review Reference Implementation**
   - Study the medication module implementation
   - Understand the patterns and conventions
   - Review audit logging and security measures

2. **Set Up Core Infrastructure**
   - Implement audit logging middleware
   - Create error classification system
   - Set up RBAC hooks
   - Standardize type definitions

3. **Begin Student Module Implementation**
   - Create `StudentsApi` service
   - Implement query key factory
   - Create basic hooks (useStudents, useStudentDetail)
   - Write tests

### Week 2-4: Student Management Module

Focus on completing the student management module as it's foundational for other modules:
- Student CRUD operations
- Search and filtering
- Bulk import
- Integration with health records
- Integration with appointments

### Week 5-12: Follow Migration Plan

Systematically implement remaining modules following the phased approach outlined in the strategy document.

## Performance Targets

- **Initial Load**: < 2 seconds
- **Query Response**: < 500ms (with cache)
- **API Response**: < 1 second (without cache)
- **Mutation Response**: < 2 seconds
- **Bundle Size**: < 500KB (gzipped)

## Security Compliance

### HIPAA Requirements
- ✅ Audit logging for all PHI access
- ✅ Encrypted data transmission
- ✅ Role-based access control
- ✅ Session timeout enforcement
- ✅ Data retention policies

### Data Protection
- ✅ Input validation with Zod schemas
- ✅ Parameterized queries (Prisma ORM)
- ✅ XSS prevention
- ✅ CSRF protection
- ✅ Rate limiting

## Resources

### Documentation
- [Full Strategy Document](./DATA_FETCHING_STRATEGY.md)
- [Quick Reference Guide](./DATA_FETCHING_QUICK_REFERENCE.md)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)

### Reference Implementation
- Medication Module: `frontend/src/services/modules/medication/`
- BaseApiService: `frontend/src/services/core/BaseApiService.ts`
- QueryHooksFactory: `frontend/src/services/core/QueryHooksFactory.ts`

### Tools
- TanStack Query DevTools (built-in)
- React DevTools
- Redux DevTools (if needed)
- Cypress E2E Testing

## Support & Questions

For questions or clarifications:
1. Review the [Full Strategy Document](./DATA_FETCHING_STRATEGY.md)
2. Check the [Quick Reference Guide](./DATA_FETCHING_QUICK_REFERENCE.md)
3. Examine the medication module reference implementation
4. Consult TanStack Query documentation

## Version History

- **v1.0** (2025-10-10) - Initial comprehensive strategy
  - Complete architecture design
  - 12-week migration plan
  - Module-by-module implementation guides
  - Testing strategies
  - Security and compliance requirements

---

**Status**: Ready for Implementation
**Priority**: High
**Timeline**: 12 weeks
**Team Size**: 2-4 developers recommended
