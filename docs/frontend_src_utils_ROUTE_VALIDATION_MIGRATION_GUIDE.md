# Route Validation Migration Guide

## Overview

This guide helps you migrate existing components from unvalidated route parameters to the production-grade validation system.

---

## Before You Start

### Check Your Components

Look for these patterns that need migration:

```typescript
// ❌ UNSAFE PATTERNS
const { id } = useParams();
const [searchParams] = useSearchParams();
const type = searchParams.get('type');

// Direct usage without validation
<Component id={id!} />
```

### What You'll Need

```typescript
import {
  useValidatedParams,
  useValidatedQueryParams,
  // ... specific schemas you need
} from '@/utils/routeValidation';
```

---

## Migration Patterns

### Pattern 1: Simple ID Parameter

#### Before
```typescript
import { useParams } from 'react-router-dom';

function IncidentDetailPage() {
  const { id } = useParams();

  // Type is string | undefined, no validation
  const { data: incident } = useQuery({
    queryKey: ['incident', id],
    queryFn: () => fetchIncident(id!), // ❌ Unsafe non-null assertion
  });

  return <IncidentDetails incident={incident} />;
}
```

#### After
```typescript
import { useValidatedParams, IncidentIdParamSchema } from '@/utils/routeValidation';

function IncidentDetailPage() {
  const { data, loading, error } = useValidatedParams(
    IncidentIdParamSchema,
    { fallbackRoute: '/incidents' }
  );

  const { data: incident } = useQuery({
    queryKey: ['incident', data?.id],
    queryFn: () => fetchIncident(data!.id), // ✅ Type-safe, validated
    enabled: !!data, // ✅ Only fetch when validated
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage />;

  return <IncidentDetails incident={incident} />;
}
```

**Benefits**:
- ✅ Type-safe UUID validation
- ✅ Automatic security checks
- ✅ Loading and error states handled
- ✅ Automatic redirect on invalid ID

---

### Pattern 2: Query Parameters

#### Before
```typescript
import { useSearchParams } from 'react-router-dom';

function IncidentListPage() {
  const [searchParams] = useSearchParams();

  // ❌ No validation, could be invalid
  const page = parseInt(searchParams.get('page') || '1');
  const type = searchParams.get('type'); // Could be invalid enum value
  const severity = searchParams.get('severity');

  const { data } = useQuery({
    queryKey: ['incidents', page, type, severity],
    queryFn: () => fetchIncidents({ page, type, severity }),
  });

  return <IncidentList incidents={data} />;
}
```

#### After
```typescript
import { useValidatedQueryParams } from '@/utils/routeValidation';
import { z } from 'zod';

function IncidentListPage() {
  const filterSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    type: IncidentTypeParamSchema.optional(),
    severity: IncidentSeverityParamSchema.optional(),
  });

  const { data: filters } = useValidatedQueryParams(filterSchema, {
    silent: true, // Don't show errors for invalid filters
  });

  // ✅ Validated with defaults
  const safeFilters = filters || { page: 1 };

  const { data } = useQuery({
    queryKey: ['incidents', safeFilters],
    queryFn: () => fetchIncidents(safeFilters),
  });

  return <IncidentList incidents={data} filters={safeFilters} />;
}
```

**Benefits**:
- ✅ Type-safe enum validation
- ✅ Automatic type conversion (string → number)
- ✅ Default values
- ✅ Invalid params ignored gracefully

---

### Pattern 3: Multiple Route Parameters

#### Before
```typescript
function StudentIncidentPage() {
  const { studentId, incidentId } = useParams();

  // ❌ No validation
  if (!studentId || !incidentId) {
    return <Error message="Invalid parameters" />;
  }

  return <StudentIncident studentId={studentId} incidentId={incidentId} />;
}
```

#### After
```typescript
import { useValidatedParams, CompositeParamSchema, UUIDParamSchema } from '@/utils/routeValidation';

function StudentIncidentPage() {
  const schema = CompositeParamSchema({
    studentId: UUIDParamSchema,
    incidentId: UUIDParamSchema,
  });

  const { data, loading, error } = useValidatedParams(schema, {
    fallbackRoute: '/students',
  });

  if (loading) return <LoadingSpinner />;
  if (error) return null; // Auto-redirects

  return <StudentIncident studentId={data.studentId} incidentId={data.incidentId} />;
}
```

**Benefits**:
- ✅ Both params validated
- ✅ UUID format validation
- ✅ Security checks
- ✅ Automatic redirect

---

### Pattern 4: Date Parameters

#### Before
```typescript
function ReportPage() {
  const { startDate, endDate } = useParams();

  // ❌ Unsafe parsing
  const start = new Date(startDate!);
  const end = new Date(endDate!);

  // ❌ No validation
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return <Error />;
  }

  return <Report startDate={start} endDate={end} />;
}
```

#### After
```typescript
import { useValidatedParams, DateRangeParamSchema } from '@/utils/routeValidation';

function ReportPage() {
  const { data, loading, error } = useValidatedParams(
    DateRangeParamSchema,
    { fallbackRoute: '/reports' }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return null;

  return <Report startDate={data.startDate} endDate={data.endDate} />;
}
```

**Benefits**:
- ✅ ISO 8601 validation
- ✅ Date range validation (start < end)
- ✅ Type-safe Date objects
- ✅ Invalid dates rejected

---

### Pattern 5: Optional Query Filters

#### Before
```typescript
function SearchPage() {
  const [searchParams] = useSearchParams();

  const filters = {
    search: searchParams.get('search') || undefined,
    type: searchParams.get('type') || undefined,
    active: searchParams.get('active') === 'true',
  };

  return <SearchResults filters={filters} />;
}
```

#### After
```typescript
function SearchPage() {
  const filterSchema = z.object({
    search: z.string().optional(),
    type: IncidentTypeParamSchema.optional(),
    active: z.string().transform(val => parseBoolean(val)).optional(),
  });

  const { data: filters } = useValidatedQueryParams(filterSchema, {
    silent: true,
  });

  return <SearchResults filters={filters || {}} />;
}
```

**Benefits**:
- ✅ Optional params handled correctly
- ✅ Boolean parsing
- ✅ Enum validation
- ✅ Type-safe

---

## Common Migration Scenarios

### Scenario 1: Protected Routes

#### Before
```typescript
function ProtectedPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || !isValidUUID(id)) {
      navigate('/home');
    }
  }, [id, navigate]);

  return <Content id={id} />;
}
```

#### After
```typescript
function ProtectedPage() {
  const { data } = useValidatedParams(
    z.object({ id: UUIDParamSchema }),
    { fallbackRoute: '/home' }
  );

  return <Content id={data.id} />;
}
```

---

### Scenario 2: Form Pre-population

#### Before
```typescript
function EditForm() {
  const [searchParams] = useSearchParams();

  const initialValues = {
    name: searchParams.get('name') || '',
    type: searchParams.get('type') || '',
  };

  return <Form initialValues={initialValues} />;
}
```

#### After
```typescript
function EditForm() {
  const schema = z.object({
    name: z.string().optional(),
    type: IncidentTypeParamSchema.optional(),
  });

  const { data: initialValues } = useValidatedQueryParams(schema, {
    silent: true,
  });

  return <Form initialValues={initialValues || {}} />;
}
```

---

### Scenario 3: Pagination

#### Before
```typescript
function PaginatedList() {
  const [searchParams] = useSearchParams();

  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

  return <List page={page} limit={limit} />;
}
```

#### After
```typescript
function PaginatedList() {
  const { data: pagination } = useValidatedQueryParams(
    PaginationParamSchema,
    { silent: true }
  );

  const { page = 1, limit = 20 } = pagination || {};

  return <List page={page} limit={limit} />;
}
```

---

## Step-by-Step Migration

### Step 1: Identify Components

Find all components using `useParams()` or `useSearchParams()`:

```bash
# Search for components to migrate
grep -r "useParams()" src/
grep -r "useSearchParams()" src/
```

### Step 2: Choose Schema

For each component, determine the appropriate schema:

| Parameter Type | Schema to Use |
|---------------|---------------|
| UUID ID | `UUIDParamSchema` or `IncidentIdParamSchema` |
| Number | `NumericParamSchema` or `PositiveIntegerParamSchema` |
| Date | `DateParamSchema` |
| Enum | `EnumParamSchema(MyEnum, 'Name')` |
| Multiple | `CompositeParamSchema({ ... })` |
| Pagination | `PaginationParamSchema` |

### Step 3: Replace Hooks

```typescript
// Before
const { id } = useParams();

// After
const { data, loading, error } = useValidatedParams(
  z.object({ id: UUIDParamSchema })
);
```

### Step 4: Add Loading States

```typescript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorPage />; // or null for redirect
```

### Step 5: Update Usage

```typescript
// Before
<Component id={id!} />

// After
<Component id={data.id} />
```

### Step 6: Test

- Test with valid parameters
- Test with invalid parameters (should redirect or show error)
- Test with missing parameters
- Test with XSS/SQL injection attempts
- Test edge cases

---

## Testing Migrations

### Test Checklist

For each migrated component:

- [ ] Valid params work correctly
- [ ] Invalid params trigger error/redirect
- [ ] Missing params handled gracefully
- [ ] Loading state displays
- [ ] Error state displays (if not redirecting)
- [ ] Type safety verified (TypeScript)
- [ ] No console errors
- [ ] User experience is smooth

### Manual Testing

```typescript
// Test URLs:

// Valid
/incidents/123e4567-e89b-12d3-a456-426614174000

// Invalid UUID
/incidents/invalid-id

// XSS attempt
/incidents/<script>alert(1)</script>

// SQL injection
/incidents/'; DROP TABLE users; --

// Path traversal
/incidents/../../../etc/passwd
```

---

## Common Pitfalls

### Pitfall 1: Not Handling Loading State

❌ **Wrong**:
```typescript
const { data } = useValidatedParams(schema);
return <Component id={data.id} />; // Error if loading
```

✅ **Correct**:
```typescript
const { data, loading, error } = useValidatedParams(schema);
if (loading) return <Spinner />;
if (error) return <Error />;
return <Component id={data.id} />;
```

### Pitfall 2: Schema in Component Body

❌ **Wrong**:
```typescript
function MyComponent() {
  // Schema recreated on every render!
  const schema = z.object({ id: UUIDParamSchema });
  const { data } = useValidatedParams(schema);
}
```

✅ **Correct**:
```typescript
// Outside component
const schema = z.object({ id: UUIDParamSchema });

function MyComponent() {
  const { data } = useValidatedParams(schema);
}
```

### Pitfall 3: Ignoring Errors

❌ **Wrong**:
```typescript
const { data, error } = useValidatedParams(schema);
// No error handling
return <Component id={data?.id} />;
```

✅ **Correct**:
```typescript
const { data, loading, error } = useValidatedParams(schema, {
  fallbackRoute: '/home',
  onError: (err) => console.error(err),
});
if (loading) return <Spinner />;
if (error) return null; // Redirects
return <Component id={data.id} />;
```

---

## Gradual Migration Strategy

### Phase 1: Critical Routes (Week 1)
Migrate high-security routes first:
- Patient detail pages
- Incident report pages
- Medication pages
- Health record pages

### Phase 2: Admin Routes (Week 2)
- User management
- Settings pages
- Configuration pages

### Phase 3: Public Routes (Week 3)
- Search pages
- List pages
- Filter pages

### Phase 4: Optional Routes (Week 4)
- Documentation pages
- Help pages
- Static content

---

## Rollback Plan

If you need to rollback a migration:

1. Keep the old code in comments temporarily
2. Test thoroughly before removing old code
3. Use feature flags if available

```typescript
function MyComponent() {
  // New validated approach
  const { data, loading, error } = useValidatedParams(schema);

  // Old approach (keep commented during migration)
  // const { id } = useParams();

  // ... rest of component
}
```

---

## Getting Help

### Resources
1. **Quick Reference**: `ROUTE_VALIDATION_QUICK_REFERENCE.md`
2. **Complete Guide**: `ROUTE_VALIDATION_GUIDE.md`
3. **Examples**: `examples/routeValidationExamples.tsx`
4. **Tests**: `__tests__/routeValidation.test.ts`

### Common Questions

**Q: Do I need to migrate all at once?**
A: No, migrate gradually starting with critical routes.

**Q: What if my schema is complex?**
A: Use `CompositeParamSchema` or create a custom schema with refinements.

**Q: Can I mix old and new approaches?**
A: Yes, but aim to migrate completely for consistency.

**Q: How do I test migrations?**
A: Use the test checklist and manual testing URLs provided above.

---

## Success Metrics

Track these metrics during migration:

- [ ] Number of components migrated
- [ ] Number of security issues prevented
- [ ] Type safety coverage
- [ ] User-reported parameter errors (should decrease)
- [ ] Console errors related to params (should decrease)

---

## Conclusion

Migrating to the validation system provides:
- ✅ Better security
- ✅ Type safety
- ✅ Consistent error handling
- ✅ Better user experience
- ✅ Easier maintenance

Start with critical routes and migrate gradually for best results.

---

**Last Updated**: October 11, 2025
**Version**: 1.0.0
