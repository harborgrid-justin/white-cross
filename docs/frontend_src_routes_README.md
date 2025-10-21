# Route Guards & Utilities

Production-grade routing system for the White Cross Healthcare Platform with comprehensive security, validation, and monitoring features.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Route Guards](#route-guards)
- [Route Utilities](#route-utilities)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

## Overview

The routing system provides multiple layers of security and validation:

1. **Authentication Verification** - Ensures users are logged in
2. **Role-Based Access Control** - Restricts access by user role
3. **Permission Checking** - Validates specific permissions
4. **Parameter Validation** - Validates route parameters (UUIDs, numbers, enums)
5. **Feature Flags** - Controls access to beta features
6. **Data Loading Guards** - Ensures required data is loaded
7. **Unsaved Changes Protection** - Warns before navigation with unsaved data
8. **Error Boundaries** - Graceful error handling at route level
9. **Analytics Tracking** - Logs page views for monitoring
10. **Breadcrumb Generation** - Automatic breadcrumb creation

## Architecture

```
frontend/src/routes/
├── index.tsx          # Main routing configuration
├── guards.tsx         # Route guard components
├── routeUtils.ts      # Utility functions
└── README.md          # This file
```

### Key Files

**index.tsx** - Main application routing with:
- Route definitions
- ProtectedRoute wrapper component
- Error boundaries
- Page transitions

**guards.tsx** - Security guard components:
- `AuthGuard` - Authentication check
- `RoleGuard` - Role-based access
- `PermissionGuard` - Permission validation
- `DataLoadGuard` - Data loading requirement
- `UnsavedChangesGuard` - Unsaved changes warning
- `FeatureFlagGuard` - Feature flag checking
- `RouteParamValidator` - Parameter validation
- `CombinedGuard` - Multiple guards in one

**routeUtils.ts** - Helper functions:
- `isRouteAccessible()` - Check route accessibility
- `getRoutePermissions()` - Get required permissions
- `validateRouteParams()` - Validate parameters
- `buildBreadcrumbs()` - Generate breadcrumbs
- Route metadata management

## Route Guards

### AuthGuard

Verifies user authentication before allowing route access.

```tsx
import { AuthGuard } from './guards';

<AuthGuard>
  <ProtectedPage />
</AuthGuard>
```

**Props:**
- `children` - Content to render if authenticated
- `redirectTo` - Custom redirect path (default: /login)
- `showLoading` - Show loading spinner (default: true)

### RoleGuard

Checks if user has required role(s).

```tsx
import { RoleGuard } from './guards';

// Single role requirement
<RoleGuard requiredRole="ADMIN">
  <AdminPanel />
</RoleGuard>

// Multiple allowed roles
<RoleGuard allowedRoles={['ADMIN', 'NURSE']}>
  <HealthRecords />
</RoleGuard>
```

**Props:**
- `children` - Content to render if role check passes
- `requiredRole` - Single required role
- `allowedRoles` - Multiple allowed roles (user needs one)
- `fallback` - Custom fallback component
- `redirectTo` - Redirect path instead of showing access denied

**Available Roles:**
- `ADMIN` - Full system access
- `NURSE` - Clinical operations
- `SCHOOL_ADMIN` - School-level administration
- `DISTRICT_ADMIN` - District-level administration
- `READ_ONLY` - Read-only access
- `COUNSELOR` - Student counseling
- `STAFF` - Basic staff access

### PermissionGuard

Verifies specific permissions for resource actions.

```tsx
import { PermissionGuard } from './guards';

<PermissionGuard
  requiredPermission="medications.administer"
  requireAll={false}
>
  <MedicationAdministration />
</PermissionGuard>
```

**Props:**
- `children` - Content to render if permission check passes
- `requiredPermission` - Single permission (format: `resource.action`)
- `requiredPermissions` - Multiple permissions
- `requireAll` - If true, user needs ALL permissions. If false, ANY permission
- `fallback` - Custom fallback component
- `redirectTo` - Redirect path

**Permission Format:** `resource.action`
- Examples: `students.create`, `medications.administer`, `reports.read`

### DataLoadGuard

Ensures required data is loaded before rendering route.

```tsx
import { DataLoadGuard } from './guards';

<DataLoadGuard
  config={{
    loadData: async () => await fetchStudent(id),
    validateData: (student) => !!student && student.isActive,
    errorMessage: "Student not found or inactive",
    redirectOnError: "/students"
  }}
>
  {(student) => <StudentDetail student={student} />}
</DataLoadGuard>
```

**Props:**
- `children` - Content or function to render after data loads
- `config.loadData` - Async function to load data
- `config.validateData` - Optional validation function
- `config.errorMessage` - Error message on load failure
- `config.redirectOnError` - Redirect path on error
- `loadingComponent` - Custom loading component

### UnsavedChangesGuard

Warns before navigating away with unsaved changes.

```tsx
import { UnsavedChangesGuard } from './guards';

function FormPage() {
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <UnsavedChangesGuard
      hasUnsavedChanges={hasChanges}
      message="You have unsaved changes. Are you sure you want to leave?"
    >
      <FormContent onChange={() => setHasChanges(true)} />
    </UnsavedChangesGuard>
  );
}
```

**Props:**
- `children` - Content to render
- `hasUnsavedChanges` - Boolean indicating unsaved changes
- `message` - Confirmation message
- `onBlock` - Callback when navigation is blocked

**Features:**
- Blocks React Router navigation
- Intercepts browser refresh/close
- Shows confirmation modal

### FeatureFlagGuard

Controls access based on feature flags.

```tsx
import { FeatureFlagGuard } from './guards';

<FeatureFlagGuard
  featureName="incident-timeline"
  fallback={<ComingSoon />}
>
  <IncidentTimeline />
</FeatureFlagGuard>
```

**Props:**
- `children` - Content to render if feature is enabled
- `featureName` - Name of feature flag
- `fallback` - Component to show if disabled
- `redirectTo` - Redirect path if disabled

**Configured Features:**
- `incident-timeline` - Incident timeline view
- `incident-witnesses` - Witness statement management
- `incident-actions` - Follow-up action tracking
- `incident-evidence` - Evidence management
- `incident-export` - Export functionality
- `advanced-analytics` - Advanced reporting (disabled)
- `telemedicine` - Telemedicine features (disabled)

### RouteParamValidator

Validates route parameters against schema.

```tsx
import { RouteParamValidator } from './guards';

<RouteParamValidator
  schema={{
    id: 'uuid',
    type: ['INJURY', 'ILLNESS', 'BEHAVIORAL']
  }}
  redirectOnInvalid="/404"
>
  <IncidentDetail />
</RouteParamValidator>
```

**Props:**
- `children` - Content to render if params valid
- `schema` - Validation schema object
- `redirectOnInvalid` - Redirect path for invalid params
- `fallback` - Custom fallback component

**Validation Types:**
- `'uuid'` - Validates UUID v4 format
- `'number'` - Validates numeric value
- `['VALUE1', 'VALUE2']` - Validates enum values
- `RegExp` - Custom regex validation
- `(value) => boolean` - Custom validation function

### CombinedGuard

Convenience component that combines multiple guards.

```tsx
import { CombinedGuard } from './guards';

<CombinedGuard
  requiredRole="NURSE"
  requiredPermission="medications.administer"
  featureName="medication-administration"
  paramSchema={{ id: 'uuid' }}
>
  <MedicationPage />
</CombinedGuard>
```

**Props:** Combines all guard props from above guards

**Evaluation Order:**
1. Parameter validation (innermost)
2. Feature flag check
3. Permission check
4. Role check
5. Authentication check (outermost)

## Route Utilities

### isRouteAccessible

Check if a route is accessible to a user.

```ts
import { isRouteAccessible } from './routeUtils';

const { isAccessible, reason, message } = isRouteAccessible('/medications', user);

if (!isAccessible) {
  console.log(`Access denied: ${reason} - ${message}`);
}
```

**Returns:**
```ts
{
  isAccessible: boolean;
  reason?: 'not_authenticated' | 'insufficient_role' | 'missing_permission' | 'feature_disabled';
  message?: string;
}
```

### getRoutePermissions

Get required permissions for a route.

```ts
import { getRoutePermissions } from './routeUtils';

const permissions = getRoutePermissions('/medications/new');
// Returns: ['medications.create']
```

### validateRouteParams

Validate route parameters against a schema.

```ts
import { validateRouteParams } from './routeUtils';

const result = validateRouteParams(
  { id: '123', type: 'INJURY' },
  { id: 'uuid', type: ['INJURY', 'ILLNESS'] }
);

if (!result.isValid) {
  console.error(result.errors);
  // [{ param: 'id', message: "Parameter 'id' must be a valid UUID" }]
}
```

### buildBreadcrumbs

Generate breadcrumbs for current location.

```ts
import { buildBreadcrumbs } from './routeUtils';

const breadcrumbs = buildBreadcrumbs('/students/123/edit', { id: '123' });
// Returns:
// [
//   { label: 'Dashboard', path: '/dashboard', isActive: false },
//   { label: 'Students', path: '/students', isActive: false },
//   { label: 'Student Details', path: '/students/123', isActive: false },
//   { label: 'Edit Student', path: '/students/123/edit', isActive: true },
// ]
```

### Other Utilities

```ts
// Match path against pattern
matchesRoutePattern('/students/123', '/students/:id') // true

// Extract params from path
extractRouteParams('/students/123', '/students/:id') // { id: '123' }

// Get parent route
getParentRoute('/students/123/edit') // '/students/123'

// Check if requires auth
requiresAuthentication('/medications') // true
requiresAuthentication('/login') // false

// Get route metadata
getRouteMetadata('/medications') // { title, icon, roles, permissions }
```

## Usage Examples

### Basic Protected Route

```tsx
import { ProtectedRoute } from './routes';

<Route
  path="/medications"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'NURSE']}>
      <MedicationsPage />
    </ProtectedRoute>
  }
/>
```

### Route with Parameter Validation

```tsx
<Route
  path="/students/:id"
  element={
    <ProtectedRoute
      allowedRoles={['ADMIN', 'NURSE']}
      paramSchema={{ id: 'uuid' }}
    >
      <StudentDetailPage />
    </ProtectedRoute>
  }
/>
```

### Route with Data Loading

```tsx
function StudentPage() {
  const { id } = useParams();

  return (
    <DataLoadGuard
      config={{
        loadData: () => fetchStudent(id),
        validateData: (student) => student.isActive,
        errorMessage: "Student not found",
        redirectOnError: "/students"
      }}
    >
      {(student) => <StudentDetail student={student} />}
    </DataLoadGuard>
  );
}
```

### Form with Unsaved Changes Protection

```tsx
function StudentEditForm() {
  const [formData, setFormData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <UnsavedChangesGuard hasUnsavedChanges={hasChanges}>
      <form onChange={() => setHasChanges(true)}>
        {/* form fields */}
      </form>
    </UnsavedChangesGuard>
  );
}
```

### Combining Multiple Guards

```tsx
<Route
  path="/medications/:id/administer"
  element={
    <CombinedGuard
      requiredRole="NURSE"
      requiredPermission="medications.administer"
      featureName="medication-administration"
      paramSchema={{ id: 'uuid' }}
    >
      <MedicationAdministrationPage />
    </CombinedGuard>
  }
/>
```

## Best Practices

### 1. Use Appropriate Guard Granularity

```tsx
// Good - Guard at route level
<Route path="/admin/*" element={
  <RoleGuard requiredRole="ADMIN">
    <AdminRoutes />
  </RoleGuard>
} />

// Avoid - Too many nested guards
<AuthGuard>
  <RoleGuard>
    <PermissionGuard>
      <Component />
    </PermissionGuard>
  </RoleGuard>
</AuthGuard>
```

### 2. Validate Parameters Early

```tsx
// Good - Validate at route level
<ProtectedRoute paramSchema={{ id: 'uuid' }}>
  <StudentDetail />
</ProtectedRoute>

// Avoid - Manual validation in component
function StudentDetail() {
  const { id } = useParams();
  if (!isValidUUID(id)) navigate('/404');
  // ...
}
```

### 3. Use CombinedGuard for Multiple Checks

```tsx
// Good - Single combined guard
<CombinedGuard
  requiredRole="NURSE"
  requiredPermission="medications.administer"
  paramSchema={{ id: 'uuid' }}
>
  <MedicationPage />
</CombinedGuard>

// Avoid - Multiple separate guards
<RoleGuard requiredRole="NURSE">
  <PermissionGuard requiredPermission="medications.administer">
    <RouteParamValidator schema={{ id: 'uuid' }}>
      <MedicationPage />
    </RouteParamValidator>
  </PermissionGuard>
</RoleGuard>
```

### 4. Provide Meaningful Error Messages

```tsx
<DataLoadGuard
  config={{
    loadData: fetchStudent,
    errorMessage: "Student not found or has been archived",
    redirectOnError: "/students"
  }}
>
  {/* ... */}
</DataLoadGuard>
```

### 5. Handle Loading States

```tsx
<DataLoadGuard
  config={{ loadData: fetchData }}
  loadingComponent={<CustomSpinner message="Loading student data..." />}
>
  {/* ... */}
</DataLoadGuard>
```

## API Reference

### Guard Components

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `AuthGuard` | Verify authentication | `redirectTo` |
| `RoleGuard` | Check user roles | `requiredRole`, `allowedRoles` |
| `PermissionGuard` | Check permissions | `requiredPermission`, `requireAll` |
| `DataLoadGuard` | Load required data | `config.loadData`, `config.validateData` |
| `UnsavedChangesGuard` | Warn on unsaved changes | `hasUnsavedChanges`, `message` |
| `FeatureFlagGuard` | Check feature flags | `featureName` |
| `RouteParamValidator` | Validate parameters | `schema`, `redirectOnInvalid` |
| `CombinedGuard` | Multiple guards | All of the above |

### Utility Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `isRouteAccessible()` | Check route access | `RouteAccessibility` |
| `getRoutePermissions()` | Get required permissions | `Permission[]` |
| `getRouteRoles()` | Get required roles | `UserRole[]` |
| `validateRouteParams()` | Validate parameters | `ParamValidationResult` |
| `buildBreadcrumbs()` | Generate breadcrumbs | `Breadcrumb[]` |
| `matchesRoutePattern()` | Check path match | `boolean` |
| `extractRouteParams()` | Extract parameters | `Record<string, string>` |
| `getParentRoute()` | Get parent route | `string \| null` |
| `requiresAuthentication()` | Check if auth required | `boolean` |
| `getRouteMetadata()` | Get route metadata | `RouteMetadata \| null` |

### Validation Types

| Type | Description | Example |
|------|-------------|---------|
| `'uuid'` | UUID v4 format | `'f47ac10b-58cc-4372-a567-0e02b2c3d479'` |
| `'number'` | Numeric value | `'123'` |
| `string[]` | Enum values | `['INJURY', 'ILLNESS']` |
| `RegExp` | Custom pattern | `/^[A-Z]{3}$/` |
| `Function` | Custom validator | `(val) => val.length > 5` |

## Incident Report Sub-Routes

New routes added for incident report management:

| Route | Path | Roles | Description |
|-------|------|-------|-------------|
| Witnesses | `/incident-reports/:id/witnesses` | ADMIN, NURSE | Manage witness statements |
| Actions | `/incident-reports/:id/actions` | ADMIN, NURSE | Track follow-up actions |
| Evidence | `/incident-reports/:id/evidence` | ADMIN, NURSE | Manage evidence files |
| Timeline | `/incident-reports/:id/timeline` | ADMIN, NURSE, SCHOOL_ADMIN | View incident timeline |
| Export | `/incident-reports/:id/export` | ADMIN, NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN | Export report |

### Route Helpers

```ts
import {
  buildIncidentReportWitnessesRoute,
  buildIncidentReportActionsRoute,
  buildIncidentReportEvidenceRoute,
  buildIncidentReportTimelineRoute,
  buildIncidentReportExportRoute,
} from '../constants/routes';

// Generate route URLs
const witnessesUrl = buildIncidentReportWitnessesRoute('123');
// '/incident-reports/123/witnesses'
```

## Security Considerations

1. **Defense in Depth** - Multiple layers of security (auth, role, permission)
2. **Parameter Validation** - All route params validated before rendering
3. **Error Boundaries** - Graceful handling of route-level errors
4. **HIPAA Compliance** - Audit logging for PHI access (TODO: implement)
5. **Session Management** - Automatic redirect on session expiry
6. **Feature Flags** - Gradual rollout of new features
7. **Analytics** - Page view tracking for security monitoring

## Performance Optimizations

1. **Lazy Loading** - Routes wrapped in `Suspense` for code splitting
2. **Memoization** - Guard checks memoized to prevent re-computation
3. **Early Returns** - Failed checks return immediately
4. **Efficient Validation** - Parameter validation optimized for common cases

## Troubleshooting

### Common Issues

**Issue: Infinite redirect loop**
- Check that public routes (like `/login`) don't require auth
- Verify redirect logic doesn't create cycles

**Issue: Guard not applying**
- Ensure guard wraps the component, not inside it
- Check guard order (outer guards apply first)

**Issue: Breadcrumbs not showing**
- Verify route is in `ROUTE_METADATA`
- Check parent relationships are correct

**Issue: Feature flag not working**
- Verify feature name matches `FEATURE_FLAGS` config
- Check user role is in allowed roles list

## Future Enhancements

- [ ] Connect to actual permission system (backend)
- [ ] Implement audit logging for HIPAA compliance
- [ ] Add route transition animations
- [ ] Integrate with analytics service (e.g., Google Analytics)
- [ ] Add route preloading for better performance
- [ ] Implement route-based code splitting
- [ ] Add route-level error tracking (e.g., Sentry)
- [ ] Create visual route permission matrix

## Related Documentation

- [Authentication System](../contexts/AuthContext.tsx)
- [Route Constants](../constants/routes.ts)
- [Type Definitions](../types/index.ts)
- [Access Control](../types/accessControl.ts)

---

**Version:** 1.0.0
**Last Updated:** 2025-10-11
**Maintainer:** White Cross Development Team
