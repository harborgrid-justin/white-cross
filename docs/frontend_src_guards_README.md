# Navigation Guards & Permission System

Comprehensive navigation guard and permission checking system for the White Cross healthcare platform frontend.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Core Concepts](#core-concepts)
- [Guard Types](#guard-types)
- [Permission System](#permission-system)
- [Usage Examples](#usage-examples)
- [Advanced Features](#advanced-features)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

---

## Overview

The navigation guard system provides a declarative way to protect routes and components based on:
- **Authentication status** - Is the user logged in?
- **User roles** - Does the user have the right role?
- **Permissions** - Does the user have specific permissions?
- **Data availability** - Is required data loaded?
- **Feature flags** - Is the feature enabled?
- **Unsaved changes** - Prevent navigation with unsaved data

### Key Features

✅ **Type-safe** - Full TypeScript support with comprehensive type definitions
✅ **Composable** - Combine multiple guards easily
✅ **Async-ready** - Support for asynchronous data loading
✅ **HIPAA-compliant** - Audit logging for healthcare security
✅ **Developer-friendly** - Clear error messages and debugging
✅ **Performant** - Efficient guard evaluation with caching
✅ **Testable** - Comprehensive test coverage

---

## Installation

The guards are already integrated into the project. Import them as needed:

```tsx
import {
  withAuthGuard,
  withRoleGuard,
  withPermissionGuard,
  withDataGuard,
  composeGuards
} from '@/guards/navigationGuards';
```

---

## Core Concepts

### Guard Context

Every guard receives a context object with:

```typescript
interface GuardContext {
  user: User | null;           // Current authenticated user
  location: Location;          // Current route location
  navigate: NavigateFunction;  // Navigation function
  params?: Record<string, string>;  // Route parameters
  data?: Record<string, any>;  // Data from previous guards
}
```

### Guard Result

Guards return (or resolve to) a result:

```typescript
interface GuardResult {
  allowed: boolean;      // Whether navigation is allowed
  redirectTo?: string;   // Optional redirect path
  error?: string;        // Optional error message
  data?: Record<string, any>;  // Data to pass to next guard
}
```

---

## Guard Types

### 1. Authentication Guard

Ensures the user is logged in.

```tsx
import { withAuthGuard } from '@/guards/navigationGuards';

function DashboardPage() {
  return <div>Protected Dashboard</div>;
}

export default withAuthGuard(DashboardPage);
```

**Behavior:**
- ✅ Authenticated users see the component
- ❌ Unauthenticated users are redirected to `/login?redirect=<current-path>`
- 🔄 Shows loading spinner while checking authentication

---

### 2. Role Guard

Checks if user has one of the allowed roles.

```tsx
import { withRoleGuard } from '@/guards/navigationGuards';

function AdminSettingsPage() {
  return <div>Admin Settings</div>;
}

export default withRoleGuard(['ADMIN', 'DISTRICT_ADMIN'])(AdminSettingsPage);
```

**Available Roles:**
- `ADMIN` - Full system access
- `DISTRICT_ADMIN` - District-level administration
- `SCHOOL_ADMIN` - School-level administration
- `NURSE` - Healthcare provider access
- `COUNSELOR` - Limited health record access
- `READ_ONLY` - View-only access

---

### 3. Permission Guard

Validates specific permissions.

```tsx
import { withPermissionGuard } from '@/guards/navigationGuards';

function StudentEditPage() {
  return <div>Edit Student</div>;
}

export default withPermissionGuard([
  { resource: 'students', action: 'update' }
])(StudentEditPage);
```

**Permission Format:**
```typescript
interface PermissionCheck {
  resource: string;  // e.g., 'students', 'medications', 'health_records'
  action: string;    // e.g., 'read', 'create', 'update', 'delete'
  context?: Record<string, unknown>;  // Optional context
}
```

---

### 4. Data Guard

Loads required data before rendering.

```tsx
import { withDataGuard } from '@/guards/navigationGuards';
import { studentsApi } from '@/services';

interface StudentDetailProps {
  guardData: { student: Student };
}

function StudentDetailPage({ guardData }: StudentDetailProps) {
  const { student } = guardData;
  return <div>{student.firstName} {student.lastName}</div>;
}

export default withDataGuard<StudentDetailProps, { student: Student }>(
  async (context) => {
    const studentId = context.location.pathname.split('/').pop();
    const student = await studentsApi.getById(studentId!);
    return { student };
  }
)(StudentDetailPage);
```

**Features:**
- 🔄 Automatic loading state
- ❌ Error handling with retry option
- 🚀 Async data fetching
- 📦 Type-safe data passing

---

### 5. Feature Flag Guard

Gates features behind feature flags.

```tsx
import { withFeatureGuard } from '@/guards/navigationGuards';

function BetaAnalyticsPage() {
  return <div>Advanced Analytics (Beta)</div>;
}

export default withFeatureGuard('advanced-analytics')(BetaAnalyticsPage);
```

**Managing Feature Flags:**

```typescript
// Enable a feature
localStorage.setItem('featureFlags', JSON.stringify({
  'advanced-analytics': true,
  'beta-features': true
}));

// Check programmatically
const isEnabled = checkFeatureFlag('advanced-analytics');
```

---

## Permission System

### Permission Checking Functions

#### `checkPermission(user, permission)`

Check if user has a specific permission.

```tsx
import { checkPermission } from '@/guards/navigationGuards';

const canEdit = checkPermission(user, {
  resource: 'students',
  action: 'update'
});
```

#### `checkAnyPermission(user, permissions[])`

Check if user has at least one of the permissions.

```tsx
const canManage = checkAnyPermission(user, [
  { resource: 'students', action: 'update' },
  { resource: 'students', action: 'delete' }
]);
```

#### `checkAllPermissions(user, permissions[])`

Check if user has all the permissions.

```tsx
const canFullyManage = checkAllPermissions(user, [
  { resource: 'students', action: 'read' },
  { resource: 'students', action: 'update' },
  { resource: 'students', action: 'delete' }
]);
```

#### `checkRolePermission(role, permission)`

Check if a role has a specific permission.

```tsx
const nurseCanPrescribe = checkRolePermission('NURSE', {
  resource: 'medications',
  action: 'create'
});
```

### Permission Matrix

| Resource | Action | ADMIN | NURSE | COUNSELOR | READ_ONLY |
|----------|--------|-------|-------|-----------|-----------|
| students | read   | ✅ | ✅ | ✅ | ✅ |
| students | create | ✅ | ✅ | ❌ | ❌ |
| students | update | ✅ | ✅ | ❌ | ❌ |
| students | delete | ✅ | ❌ | ❌ | ❌ |
| medications | read | ✅ | ✅ | ❌ | ✅ |
| medications | create | ✅ | ✅ | ❌ | ❌ |
| medications | update | ✅ | ✅ | ❌ | ❌ |
| medications | delete | ✅ | ✅ | ❌ | ❌ |
| health_records | read | ✅ | ✅ | ✅ | ✅ |
| health_records | create | ✅ | ✅ | ❌ | ❌ |
| health_records | update | ✅ | ✅ | ❌ | ❌ |
| incident_reports | read | ✅ | ✅ | ✅ | ✅ |
| incident_reports | create | ✅ | ✅ | ✅ | ❌ |
| system | configure | ✅ | ❌ | ❌ | ❌ |

---

## Usage Examples

### Example 1: Simple Protected Page

```tsx
import { withAuthGuard } from '@/guards/navigationGuards';

function MyProtectedPage() {
  return <div>Only logged-in users see this</div>;
}

export default withAuthGuard(MyProtectedPage);
```

### Example 2: Admin-Only Page

```tsx
import { withRoleGuard } from '@/guards/navigationGuards';

function AdminDashboard() {
  return <div>Admin Dashboard</div>;
}

export default withRoleGuard(['ADMIN'])(AdminDashboard);
```

### Example 3: Composed Guards

```tsx
import { composeGuards, withAuthGuard, withRoleGuard, withPermissionGuard } from '@/guards/navigationGuards';

function IncidentReportEditPage() {
  return <div>Edit Incident Report</div>;
}

export default composeGuards([
  withAuthGuard,
  withRoleGuard(['NURSE', 'ADMIN']),
  withPermissionGuard([
    { resource: 'incident_reports', action: 'update' }
  ])
])(IncidentReportEditPage);
```

### Example 4: Data Loading with Guards

```tsx
import { composeGuards, withAuthGuard, withDataGuard } from '@/guards/navigationGuards';
import { studentsApi, medicationsApi } from '@/services';

interface HealthManagementProps {
  guardData: {
    student: Student;
    medications: Medication[];
  };
}

function HealthManagementPage({ guardData }: HealthManagementProps) {
  const { student, medications } = guardData;

  return (
    <div>
      <h1>{student.firstName} {student.lastName}</h1>
      <p>Medications: {medications.length}</p>
    </div>
  );
}

export default composeGuards([
  withAuthGuard,
  withDataGuard(async (context) => {
    const studentId = context.location.pathname.split('/')[2];

    const [student, medications] = await Promise.all([
      studentsApi.getById(studentId),
      medicationsApi.getStudentMedications(studentId)
    ]);

    return { student, medications };
  })
])(HealthManagementPage);
```

### Example 5: Unsaved Changes Protection

```tsx
import { useUnsavedChanges, UnsavedChangesPrompt } from '@/guards/navigationGuards';

function StudentForm() {
  const [formData, setFormData] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const {
    setHasUnsavedChanges,
    showPrompt,
    confirmNavigation,
    cancelNavigation
  } = useUnsavedChanges();

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);

  const handleSave = async () => {
    await studentsApi.create(formData);
    setIsDirty(false);
    confirmNavigation();
  };

  return (
    <div>
      <form>
        <input onChange={() => setIsDirty(true)} />
        <button onClick={handleSave}>Save</button>
      </form>

      <UnsavedChangesPrompt
        isOpen={showPrompt}
        onSave={handleSave}
        onDiscard={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </div>
  );
}
```

### Example 6: Conditional UI Based on Permissions

```tsx
import { checkPermission } from '@/guards/navigationGuards';
import { useAuthContext } from '@/contexts/AuthContext';

function StudentActionsMenu({ studentId }: { studentId: string }) {
  const { user } = useAuthContext();

  const canEdit = checkPermission(user, {
    resource: 'students',
    action: 'update'
  });

  const canDelete = checkPermission(user, {
    resource: 'students',
    action: 'delete'
  });

  return (
    <div>
      {canEdit && <button>Edit Student</button>}
      {canDelete && <button>Delete Student</button>}
    </div>
  );
}
```

---

## Advanced Features

### Navigation Interceptors

Register global callbacks for navigation events:

```tsx
import { navigationInterceptorManager } from '@/guards/navigationGuards';

// Before navigation
navigationInterceptorManager.beforeNavigate((to, from, next) => {
  console.log(`Navigating from ${from.pathname} to ${to.pathname}`);
  // Track analytics
  analytics.pageView(to.pathname);
  next();
});

// After navigation
navigationInterceptorManager.afterNavigate((to, from) => {
  // Scroll to top
  window.scrollTo(0, 0);
});

// On error
navigationInterceptorManager.onNavigationError((error) => {
  console.error('Navigation error:', error);
  Sentry.captureException(error);
});

// On cancelled
navigationInterceptorManager.onNavigationCancelled(() => {
  console.log('Navigation was cancelled');
});
```

### Route Metadata

Define comprehensive route metadata:

```tsx
import { RouteMetadata } from '@/guards/navigationGuards';

const routeMetadata: Record<string, RouteMetadata> = {
  '/students/:id/edit': {
    requiresAuth: true,
    roles: ['ADMIN', 'NURSE'],
    permissions: [
      { resource: 'students', action: 'read' },
      { resource: 'students', action: 'update' }
    ],
    title: 'Edit Student',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Students', path: '/students' },
      { label: 'Edit' }
    ],
    features: ['student-editing']
  }
};
```

### Specialized Data Loaders

Use pre-built entity loaders:

```tsx
import { EnsureStudentLoaded, EnsureMedicationLoaded, EnsureIncidentReportLoaded } from '@/guards/navigationGuards';

// Student loader
const StudentPage = EnsureStudentLoaded(({ student }) => (
  <div>{student.firstName}</div>
));

// Medication loader
const MedicationPage = EnsureMedicationLoaded(({ medication }) => (
  <div>{medication.name}</div>
));

// Generic loader
const CustomEntityPage = EnsureEntityLoaded<HealthRecord, Props>(
  'healthRecord',
  async (id) => await healthRecordsApi.getById(id)
)(MyComponent);
```

---

## Best Practices

### 1. **Always Start with Authentication**

```tsx
// ✅ Good
composeGuards([
  withAuthGuard,
  withRoleGuard(['NURSE']),
  withPermissionGuard([...])
])

// ❌ Bad
composeGuards([
  withRoleGuard(['NURSE']),  // Will fail without auth check first
  withAuthGuard
])
```

### 2. **Use Specific Permissions Over Broad Roles**

```tsx
// ✅ Better - specific permission
withPermissionGuard([
  { resource: 'medications', action: 'prescribe' }
])

// ⚠️ Acceptable - but less granular
withRoleGuard(['NURSE'])
```

### 3. **Load Data in Guards, Not in Components**

```tsx
// ✅ Good - data loaded by guard
const Page = withDataGuard(loader)(Component);

// ❌ Bad - loading in component
function Component() {
  const [data, setData] = useState(null);
  useEffect(() => { loadData(); }, []);
  // ...
}
```

### 4. **Compose Guards for Readability**

```tsx
// ✅ Good
const ProtectedPage = composeGuards([
  withAuthGuard,
  withRoleGuard(['NURSE']),
  withPermissionGuard([{ resource: 'students', action: 'read' }])
])(MyPage);

// ❌ Bad - nested HOCs
const ProtectedPage = withAuthGuard(
  withRoleGuard(['NURSE'])(
    withPermissionGuard([...])(MyPage)
  )
);
```

### 5. **Use Unsaved Changes for Forms**

```tsx
// Always protect forms with unsaved changes hook
function FormComponent() {
  const { setHasUnsavedChanges } = useUnsavedChanges();
  // Track changes...
}
```

### 6. **Log Security Events**

Guards automatically log security-relevant events in development and production for HIPAA compliance audit trails.

---

## API Reference

### Higher-Order Components

#### `withAuthGuard<P>(Component: ComponentType<P>): ComponentType<P>`

Ensures user is authenticated.

#### `withRoleGuard<P>(roles: UserRole[]): (Component: ComponentType<P>) => ComponentType<P>`

Checks if user has one of the specified roles.

#### `withPermissionGuard<P>(permissions: PermissionCheck[]): (Component: ComponentType<P>) => ComponentType<P>`

Validates user has required permissions.

#### `withDataGuard<P, T>(loader: DataLoader<T>): (Component: ComponentType<P & { guardData: T }>) => ComponentType<P>`

Loads data before rendering component.

#### `withFeatureGuard<P>(featureFlag: string): (Component: ComponentType<P>) => ComponentType<P>`

Checks if feature flag is enabled.

#### `composeGuards<P>(guards: Array<HOC>, mode?: 'sequence' | 'parallel'): (Component: ComponentType<P>) => ComponentType<P>`

Composes multiple guards.

### Permission Functions

#### `checkPermission(user: User | null, permission: PermissionCheck): boolean`

Check single permission.

#### `checkAnyPermission(user: User | null, permissions: PermissionCheck[]): boolean`

Check if user has any of the permissions.

#### `checkAllPermissions(user: User | null, permissions: PermissionCheck[]): boolean`

Check if user has all permissions.

#### `checkRolePermission(role: UserRole, permission: PermissionCheck): boolean`

Check if role has permission.

#### `hasAccessToRoute(user: User | null, metadata: RouteMetadata): boolean`

Check if user can access route based on metadata.

### Hooks

#### `useUnsavedChanges()`

Hook for tracking and managing unsaved changes.

Returns:
```typescript
{
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  showPrompt: boolean;
  confirmNavigation: () => void;
  cancelNavigation: () => void;
  attemptNavigation: (path: string) => boolean;
}
```

### Components

#### `<UnsavedChangesPrompt />`

Modal prompt for unsaved changes.

Props:
```typescript
{
  isOpen: boolean;
  onSave?: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}
```

---

## Testing

See `navigationGuards.test.tsx` for comprehensive test examples.

```tsx
import { render, screen } from '@testing-library/react';
import { withAuthGuard } from '@/guards/navigationGuards';

test('renders component when authenticated', () => {
  // Mock auth context
  vi.mock('../contexts/AuthContext', () => ({
    useAuthContext: () => ({ user: mockUser, loading: false })
  }));

  const Protected = withAuthGuard(TestComponent);
  render(<Protected />);

  expect(screen.getByText('Test Component')).toBeInTheDocument();
});
```

---

## Security Considerations

1. **Audit Logging** - All guard failures are logged for HIPAA compliance
2. **Client-Side Only** - Guards are UI protection; always validate on backend
3. **Token Security** - Uses secure token storage from AuthContext
4. **Session Management** - Integrates with session expiration handling
5. **CSRF Protection** - Works with API security layers

---

## Troubleshooting

### Guard Not Working

1. Check guard order in `composeGuards`
2. Verify AuthContext is properly providing user
3. Check console for guard logging (in dev mode)

### Data Not Loading

1. Ensure DataLoader is async
2. Check network tab for API errors
3. Verify error handling in guard

### Permissions Not Working

1. Check user role in AuthContext
2. Verify permission strings match exactly
3. Review permission matrix in this README

---

## License

Part of the White Cross healthcare platform. Internal use only.

## Support

For questions or issues, contact the development team.
