# Route Guard Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Application Entry Point                       │
│                            (App.tsx)                                 │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         AppRoutes Component                          │
│                        (routes/index.tsx)                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐  ┌───────────────────────────────────┐  │
│  │   Public Routes       │  │      Protected Routes             │  │
│  │                       │  │                                   │  │
│  │  • /login            │  │  • /dashboard                     │  │
│  │  • /forgot-password  │  │  • /students/*                    │  │
│  │  • /reset-password   │  │  • /medications/*                 │  │
│  │  • /verify-email     │  │  • /health-records/*              │  │
│  │                       │  │  • /incident-reports/*            │  │
│  │  No guards applied    │  │  • ...all protected routes        │  │
│  └───────────────────────┘  └───────────────┬───────────────────┘  │
│                                              │                       │
└──────────────────────────────────────────────┼───────────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Guard Evaluation Pipeline                       │
│                         (Executed in Order)                          │
└─────────────────────────────────────────────────────────────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
         ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
         │   AuthGuard      │      │  RoleGuard       │      │ PermissionGuard  │
         │                  │      │                  │      │                  │
         │ ✓ User logged in?│      │ ✓ Has role?      │      │ ✓ Has permission?│
         │ ✗ → Redirect     │      │ ✗ → Access Denied│      │ ✗ → Access Denied│
         │     to /login    │      │                  │      │                  │
         └────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
                  │                         │                         │
                  └─────────────────────────┼─────────────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
                    ▼                       ▼                       ▼
         ┌──────────────────┐    ┌──────────────────┐   ┌──────────────────┐
         │ FeatureFlagGuard │    │RouteParamValidator│   │  DataLoadGuard   │
         │                  │    │                  │    │                  │
         │ ✓ Feature enabled?│    │ ✓ Valid params?  │    │ ✓ Data loaded?   │
         │ ✗ → Access Denied│    │ ✗ → 404          │    │ ✗ → Error/Redirect│
         │                  │    │                  │    │                  │
         └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
                  │                       │                       │
                  └───────────────────────┼───────────────────────┘
                                          │
                                          ▼
                              ┌──────────────────────┐
                              │  RouteErrorBoundary  │
                              │  (Error Handling)    │
                              └──────────┬───────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │    Page Transition   │
                              │   (Fade Animation)   │
                              └──────────┬───────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │  Target Component    │
                              │    (Rendered)        │
                              └──────────────────────┘
```

## Guard Component Architecture

### AuthGuard Flow
```
User navigates to protected route
         │
         ▼
┌─────────────────────┐
│   Check loading     │──── Yes ──▶ Show LoadingSpinner
└─────────┬───────────┘
          │ No
          ▼
┌─────────────────────┐
│   User exists?      │──── No ───▶ Navigate to /login?redirect=<path>
└─────────┬───────────┘
          │ Yes
          ▼
   Render children
```

### RoleGuard Flow
```
User authenticated
         │
         ▼
┌────────────────────────┐
│  requiredRole set?     │──── Yes ──▶ user.role === requiredRole?
└─────────┬──────────────┘                      │
          │ No                                  ├─ Yes ─▶ Render
          ▼                                     └─ No ──▶ Access Denied
┌────────────────────────┐
│  allowedRoles set?     │──── Yes ──▶ user.role in allowedRoles?
└─────────┬──────────────┘                      │
          │ No                                  ├─ Yes ─▶ Render
          ▼                                     └─ No ──▶ Access Denied
    Render children
     (no role req)
```

### PermissionGuard Flow
```
User authenticated
         │
         ▼
┌─────────────────────────────┐
│ Build permission list       │
│ (from props)                │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ requireAll = true?          │
├─── Yes ──▶ All permissions?  │──── Yes ──▶ Render
│                              │──── No ───▶ Access Denied
├─── No ───▶ Any permission?   │──── Yes ──▶ Render
└──────────────────────────────┘──── No ───▶ Access Denied
```

### RouteParamValidator Flow
```
Component mounting
         │
         ▼
┌─────────────────────────────┐
│ Extract params from route   │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ For each param in schema:   │
│ ┌─────────────────────────┐ │
│ │ Param exists?           │ │──── No ──▶ Add error
│ └────────┬────────────────┘ │
│          │ Yes               │
│          ▼                   │
│ ┌─────────────────────────┐ │
│ │ Validate type:          │ │
│ │ • uuid → isValidUUID()  │ │
│ │ • number → isNumber()   │ │
│ │ • enum → in array?      │ │
│ │ • RegExp → test()       │ │
│ │ • Function → call()     │ │──── Pass ──▶ Continue
│ └─────────────────────────┘ │──── Fail ──▶ Add error
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Has errors?                 │
├─── Yes ──▶ Navigate to 404   │
└─── No ───▶ Render children   │
```

### DataLoadGuard Flow
```
Component mounting
         │
         ▼
┌─────────────────────────────┐
│ Set loading = true          │
└─────────┬───────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Execute config.loadData()   │
└─────────┬───────────────────┘
          │
          ├──── Success ───▶ Has validateData?
          │                    │
          │                    ├─ Yes ─▶ validateData(data)?
          │                    │           │
          │                    │           ├─ Pass ─▶ setData()
          │                    │           └─ Fail ─▶ setError()
          │                    └─ No ──▶ setData()
          │
          └──── Error ────▶ setError()
                              │
                              ▼
                   ┌─────────────────────────┐
                   │ Set loading = false     │
                   └─────────┬───────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │ loading?                     │
              ├─ Yes ─▶ Show loading spinner │
              └─ No ──▶ Has error?           │
                         │                    │
                         ├─ Yes ─▶ Show error or redirect
                         └─ No ──▶ Render children with data
```

## Permission System

### Permission Format
```
resource.action

Examples:
  students.read
  students.create
  students.update
  students.delete
  medications.administer
  health_records.read
  incidents.create
```

### Role-Permission Matrix
```
┌──────────────────┬───────┬───────┬────────────┬──────────────┬──────────┬──────────┬───────┐
│ Permission       │ ADMIN │ NURSE │SCHOOL_ADMIN│DISTRICT_ADMIN│READ_ONLY │COUNSELOR │ STAFF │
├──────────────────┼───────┼───────┼────────────┼──────────────┼──────────┼──────────┼───────┤
│ students.*       │   ✓   │   ✓   │            │              │          │          │       │
│ students.read    │   ✓   │   ✓   │     ✓      │      ✓       │    ✓     │    ✓     │       │
│ students.update  │   ✓   │   ✓   │            │              │          │    ✓     │       │
│ medications.*    │   ✓   │   ✓   │            │              │          │          │       │
│ medications.read │   ✓   │   ✓   │     ✓      │      ✓       │    ✓     │          │       │
│ health_records.* │   ✓   │   ✓   │            │              │          │          │       │
│ health_records.read│  ✓  │   ✓   │     ✓      │      ✓       │    ✓     │    ✓     │       │
│ appointments.*   │   ✓   │   ✓   │            │              │          │          │       │
│ incidents.*      │   ✓   │   ✓   │            │              │          │          │       │
│ incidents.read   │   ✓   │   ✓   │     ✓      │      ✓       │    ✓     │    ✓     │   ✓   │
│ incidents.create │   ✓   │   ✓   │            │              │          │    ✓     │       │
│ reports.*        │   ✓   │       │            │      ✓       │          │          │       │
│ reports.read     │   ✓   │   ✓   │     ✓      │      ✓       │    ✓     │    ✓     │       │
│ communication.*  │   ✓   │       │            │              │          │          │   ✓   │
│ settings.*       │   ✓   │       │            │              │          │          │       │
└──────────────────┴───────┴───────┴────────────┴──────────────┴──────────┴──────────┴───────┘

Legend:
  ✓ = Permission granted
  * = Wildcard (all actions for resource)
```

## Route Metadata Structure

### Example Metadata Entry
```typescript
{
  path: '/medications/new',
  title: 'New Medication',
  icon: 'Plus',
  parent: '/medications',
  roles: ['ADMIN', 'NURSE'],
  permissions: ['medications.create'],
  hidden: false
}
```

### Metadata Hierarchy Example
```
/dashboard (Dashboard)
└── /students (Students)
    ├── /students/new (New Student)
    │   └── roles: [ADMIN, NURSE]
    │   └── permissions: [students.create]
    │
    ├── /students/:id (Student Details)
    │   ├── /students/:id/edit (Edit Student)
    │   │   └── roles: [ADMIN, NURSE]
    │   │   └── permissions: [students.update]
    │   │
    │   └── /students/:id/health-records (Student Health Records)
    │       └── parent: /students/:id
    │
    └── /students/list (Student List)
        └── hidden: true
```

## Breadcrumb Generation

### Process Flow
```
1. Current pathname: /students/123/edit
2. Extract params: { id: '123' }
3. Find matching route in metadata
4. Build hierarchy by following parent chain:

   /students/123/edit
        ↓ parent
   /students/:id
        ↓ parent
   /students
        ↓ parent (none, but add dashboard)
   /dashboard

5. Reverse order and generate breadcrumbs:
   [
     { label: 'Dashboard', path: '/dashboard', isActive: false },
     { label: 'Students', path: '/students', isActive: false },
     { label: 'Student Details', path: '/students/123', isActive: false },
     { label: 'Edit Student', path: '/students/123/edit', isActive: true }
   ]
```

## Error Handling Flow

### RouteErrorBoundary
```
Component renders
       │
       ▼
Try to execute component lifecycle
       │
       ├──── Success ───▶ Render normally
       │
       └──── Error ─────▶ getDerivedStateFromError()
                              │
                              ▼
                         Set hasError = true
                         Set error = caught error
                              │
                              ▼
                         componentDidCatch()
                              │
                              ├─▶ Log to console
                              └─▶ Send to error tracking (TODO)
                              │
                              ▼
                         Render error UI
                              │
                              ├─▶ Show error message
                              └─▶ Offer reload button
```

## Feature Flag System

### Flag Configuration
```typescript
{
  'incident-timeline': {
    name: 'incident-timeline',
    enabled: true,
    roles: ['ADMIN', 'NURSE', 'SCHOOL_ADMIN']
  }
}
```

### Evaluation Flow
```
User accesses guarded route
         │
         ▼
┌─────────────────────────┐
│ Feature exists in flags?│──── No ───▶ Feature disabled
└─────────┬───────────────┘
          │ Yes
          ▼
┌─────────────────────────┐
│ Feature.enabled = true? │──── No ───▶ Feature disabled
└─────────┬───────────────┘
          │ Yes
          ▼
┌─────────────────────────┐
│ Has roles restriction?  │──── No ───▶ Feature enabled
└─────────┬───────────────┘
          │ Yes
          ▼
┌─────────────────────────┐
│ User role in list?      │──── Yes ──▶ Feature enabled
└─────────────────────────┘──── No ───▶ Feature disabled
```

## Incident Report Sub-Routes Architecture

```
/incident-reports
       │
       ├── /:id (Detail View)
       │    │
       │    ├── /witnesses (Witness Statements Tab)
       │    │   └── roles: [ADMIN, NURSE]
       │    │   └── feature: incident-witnesses
       │    │
       │    ├── /actions (Follow-up Actions Tab)
       │    │   └── roles: [ADMIN, NURSE]
       │    │   └── feature: incident-actions
       │    │
       │    ├── /evidence (Evidence Management Tab)
       │    │   └── roles: [ADMIN, NURSE]
       │    │   └── feature: incident-evidence
       │    │
       │    ├── /timeline (Timeline View Tab)
       │    │   └── roles: [ADMIN, NURSE, SCHOOL_ADMIN]
       │    │   └── feature: incident-timeline
       │    │
       │    └── /export (Export Functionality)
       │        └── roles: [ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN]
       │        └── feature: incident-export
       │
       ├── /new (Create New Report)
       │   └── roles: [ADMIN, NURSE, COUNSELOR]
       │
       └── /list (Report List)
           └── roles: [ADMIN, NURSE, COUNSELOR, READ_ONLY]
```

## Data Flow Diagram

### Complete Request Flow
```
User Action (Navigate to /medications/123)
         │
         ▼
React Router catches navigation
         │
         ▼
AppRoutes component renders
         │
         ▼
┌────────────────────────────────────────┐
│ 1. AuthGuard                           │
│    - Check AuthContext                 │
│    - If no user → redirect /login      │
│    - If loading → show spinner         │
└────────────────┬───────────────────────┘
                 │ ✓ Authenticated
                 ▼
┌────────────────────────────────────────┐
│ 2. ProtectedRoute (Enhanced)           │
│    - Check role requirements           │
│    - Check permissions                 │
│    - Generate breadcrumbs              │
│    - Track analytics                   │
└────────────────┬───────────────────────┘
                 │ ✓ Authorized
                 ▼
┌────────────────────────────────────────┐
│ 3. RouteParamValidator                 │
│    - Validate :id = '123'              │
│    - Check UUID format                 │
│    - If invalid → redirect 404         │
└────────────────┬───────────────────────┘
                 │ ✓ Valid params
                 ▼
┌────────────────────────────────────────┐
│ 4. RouteErrorBoundary                  │
│    - Wrap component in try-catch       │
│    - Catch rendering errors            │
└────────────────┬───────────────────────┘
                 │ ✓ No errors
                 ▼
┌────────────────────────────────────────┐
│ 5. Suspense                            │
│    - Wait for lazy-loaded component    │
│    - Show loading fallback             │
└────────────────┬───────────────────────┘
                 │ ✓ Component loaded
                 ▼
┌────────────────────────────────────────┐
│ 6. PageTransition                      │
│    - Apply fade-in animation           │
│    - Smooth user experience            │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│ 7. Target Component                    │
│    - MedicationDetail renders          │
│    - Fetches medication data           │
│    - Displays to user                  │
└────────────────────────────────────────┘
```

## Performance Considerations

### Guard Evaluation Optimization
```
Guards evaluated in order of:
1. Fastest → Slowest
2. Most likely to fail → Least likely to fail

Order:
1. AuthGuard (check variable)           ~0.1ms
2. RouteParamValidator (regex test)     ~0.5ms
3. RoleGuard (array lookup)             ~0.1ms
4. PermissionGuard (array operations)   ~1ms
5. FeatureFlagGuard (object lookup)     ~0.1ms
6. DataLoadGuard (async fetch)          ~100-500ms

Total guard overhead (without data loading): ~2ms
```

### Memoization Strategy
```typescript
// Guards use useCallback to memoize checks
const hasPermission = useCallback(() => {
  // Expensive permission logic
}, [user, permissions]); // Only recompute when deps change

// Breadcrumbs computed once per route change
useEffect(() => {
  const crumbs = buildBreadcrumbs(pathname);
  setBreadcrumbs(crumbs);
}, [pathname]); // Only rebuild on path change
```

## Security Model

### Layers of Protection
```
Layer 1: Network (not shown)
         ├─ HTTPS enforcement
         └─ CORS policies

Layer 2: Authentication (AuthGuard)
         ├─ JWT token validation
         ├─ Session management
         └─ Login redirect

Layer 3: Authorization (RoleGuard + PermissionGuard)
         ├─ Role-based access control
         ├─ Fine-grained permissions
         └─ Resource-action pairs

Layer 4: Input Validation (RouteParamValidator)
         ├─ Parameter format validation
         ├─ Injection prevention
         └─ Type checking

Layer 5: Feature Control (FeatureFlagGuard)
         ├─ Beta feature access
         ├─ A/B testing
         └─ Gradual rollout

Layer 6: Data Validation (DataLoadGuard)
         ├─ Required data presence
         ├─ Data integrity checks
         └─ Business rule validation
```

## Extensibility Points

### Adding New Guards
```typescript
// 1. Create guard component in guards.tsx
export const CustomGuard: React.FC<CustomGuardProps> = ({
  children,
  customCheck
}) => {
  if (!customCheck()) {
    return <AccessDenied />;
  }
  return <>{children}</>;
};

// 2. Add to CombinedGuard if needed
export const CombinedGuard: React.FC<CombinedGuardProps> = ({
  // ... existing props
  customCheck,
  children
}) => {
  let content = <>{children}</>;

  if (customCheck) {
    content = <CustomGuard customCheck={customCheck}>{content}</CustomGuard>;
  }

  // ... rest of guards
  return content;
};

// 3. Use in routes
<Route path="/custom" element={
  <CustomGuard customCheck={() => /* logic */}>
    <CustomPage />
  </CustomGuard>
} />
```

### Adding New Route Metadata
```typescript
// 1. Add route constant in constants/routes.ts
CUSTOM_ROUTE: '/custom/:id'

// 2. Add metadata in routeUtils.ts
export const ROUTE_METADATA = {
  // ... existing metadata
  [PROTECTED_ROUTES.CUSTOM_ROUTE]: {
    path: PROTECTED_ROUTES.CUSTOM_ROUTE,
    title: 'Custom Page',
    icon: 'Star',
    parent: PROTECTED_ROUTES.DASHBOARD,
    roles: ['ADMIN'],
    permissions: ['custom.read'],
  },
};

// 3. Add route builder helper
export const buildCustomRoute = (id: string | number) =>
  buildRoute(PROTECTED_ROUTES.CUSTOM_ROUTE, { id });
```

## Testing Strategy

### Unit Tests
- Test each guard in isolation
- Mock AuthContext
- Verify redirect behavior
- Check error states

### Integration Tests
- Test guard combinations
- Verify proper route access
- Check breadcrumb generation
- Validate parameter checking

### E2E Tests
- Full user flow testing
- Role-based access scenarios
- Error handling verification
- Performance monitoring

---

**Document Version:** 1.0.0
**Last Updated:** October 11, 2025
**Status:** Complete
