# Migration Guide: Next.js App Router Routing Improvements

## Overview

This guide helps you migrate from old routing patterns to the new Next.js App Router-compatible patterns.

---

## Breaking Changes

### 1. Guard Hooks Now Return State

**Before**:
```typescript
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    window.location.href = '/login';
  }
}

// Usage
function MyPage() {
  useRequireAuth();
  return <div>Content</div>;
}
```

**After**:
```typescript
export function useRequireAuth(): AuthGuardState {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [state, setState] = useState({ isLoading: true, isAuthorized: false });

  useEffect(() => {
    // Proper auth check with loading state
  }, [isAuthenticated, isLoading, router]);

  return state;
}

// Usage - YOU MUST UPDATE THIS
function MyPage() {
  const { isLoading, isAuthorized } = useRequireAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <div>Content</div>;
}
```

**Migration Steps**:
1. ✅ Change hook call to destructure `{ isLoading, isAuthorized }`
2. ✅ Add loading state check
3. ✅ Add unauthorized check
4. ✅ Test that redirects work properly

---

### 2. All Guard Hooks Have Same Pattern

This applies to:
- `useRequireAuth()`
- `useRequirePermission(permission)`
- `useRequireRole(role)`

**Migration Template**:
```typescript
// OLD
function OldComponent() {
  useRequirePermission('students:edit');
  return <Form />;
}

// NEW
function NewComponent() {
  const { isLoading, isAuthorized } = useRequirePermission('students:edit');

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthorized) return null;

  return <Form />;
}
```

---

### 3. No More Direct window.location Usage

**Before** (WRONG):
```typescript
if (!isAuthenticated) {
  window.location.href = '/login';
}
```

**After** (CORRECT):
```typescript
const router = useRouter();

useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, router]);
```

**Why?**:
- Next.js App Router uses client-side navigation
- `window.location` causes full page reloads
- `router.push()` enables prefetching and faster navigation
- Maintains SPA behavior

---

### 4. AuthContext Must Provide isLoading

Your `AuthContext` must now expose an `isLoading` property:

**Update Your AuthContext**:
```typescript
interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;  // ← ADD THIS
  user: User | null;
  // ... other properties
}

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const user = await loadUserFromToken();
        setUser(user);
      } finally {
        setIsLoading(false);  // ← Important!
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## Non-Breaking Additions

### 1. New Guard Components

You can now use guard components for simpler conditional rendering:

**Example**:
```typescript
import { AuthGuard, RoleGuard, PermissionGuard } from '@/identity-access/hooks/auth-guards';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Only authenticated users see this */}
      <AuthGuard fallback={<LoginPrompt />}>
        <UserProfile />
      </AuthGuard>

      {/* Only admins see this */}
      <RoleGuard role="ADMIN" fallback={<div>Admin only</div>}>
        <AdminPanel />
      </RoleGuard>

      {/* Only users with permission see this */}
      <PermissionGuard permission="students:edit">
        <StudentEditButton />
      </PermissionGuard>
    </div>
  );
}
```

### 2. Centralized Route Configuration

New centralized route config in `lib/config/routes.ts`:

**Usage**:
```typescript
import {
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  getRoutePermissions,
  hasRouteAccess
} from '@/identity-access/lib/config/routes';

// Check if route is public
const isPublic = isPublicRoute(pathname);

// Get required permissions
const permissions = getRoutePermissions('/students/new');

// Check access
const hasAccess = hasRouteAccess(userRole, pathname);
```

### 3. Root Middleware

New `src/middleware.ts` provides:
- Edge-level authentication
- Security headers
- User context injection
- Route protection

**No changes needed in your code** - it runs automatically!

---

## Step-by-Step Migration

### Step 1: Update Import Statements

**Before**:
```typescript
import { useRequireAuth } from '@/hooks/auth-guards';
```

**After** (same, just be aware of the new signature):
```typescript
import { useRequireAuth } from '@/identity-access/hooks/auth-guards';
```

### Step 2: Find All Guard Hook Usage

Search your codebase for:
```bash
useRequireAuth
useRequirePermission
useRequireRole
```

### Step 3: Update Each Component

For each component using guard hooks:

1. Add loading state handling
2. Add unauthorized state handling
3. Remove any direct window.location usage
4. Add proper loading UI

**Template**:
```typescript
// Before
function MyComponent() {
  useRequireAuth();
  return <Content />;
}

// After
function MyComponent() {
  const { isLoading, isAuthorized } = useRequireAuth();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <Content />;
}
```

### Step 4: Test Each Migration

For each migrated component, test:
1. ✅ Loading state shows properly
2. ✅ Redirect works when unauthorized
3. ✅ Content shows when authorized
4. ✅ No flash of unauthorized content

---

## Common Migration Scenarios

### Scenario 1: Simple Protected Page

**Before**:
```typescript
'use client';

export default function ProtectedPage() {
  useRequireAuth();

  return (
    <div>
      <h1>Protected Content</h1>
    </div>
  );
}
```

**After**:
```typescript
'use client';

export default function ProtectedPage() {
  const { isLoading, isAuthorized } = useRequireAuth();

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div>
      <h1>Protected Content</h1>
    </div>
  );
}
```

### Scenario 2: Permission-Based Page

**Before**:
```typescript
'use client';

export default function StudentEditPage() {
  useRequirePermission('students:edit');

  return <StudentEditForm />;
}
```

**After**:
```typescript
'use client';

export default function StudentEditPage() {
  const { isLoading, isAuthorized } = useRequirePermission('students:edit');

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <StudentEditForm />;
}
```

### Scenario 3: Role-Based Dashboard

**Before**:
```typescript
'use client';

export default function AdminDashboard() {
  useRequireRole('ADMIN');

  return <AdminPanel />;
}
```

**After**:
```typescript
'use client';

export default function AdminDashboard() {
  const { isLoading, isAuthorized } = useRequireRole('ADMIN');

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <AdminPanel />;
}
```

### Scenario 4: Multiple Roles

**Before**:
```typescript
export default function NurseDashboard() {
  useRequireRole(['NURSE', 'SCHOOL_NURSE']);

  return <NursePanel />;
}
```

**After** (same pattern):
```typescript
export default function NurseDashboard() {
  const { isLoading, isAuthorized } = useRequireRole(['NURSE', 'SCHOOL_NURSE']);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <NursePanel />;
}
```

### Scenario 5: Conditional UI Rendering

**Before** (hooks):
```typescript
function Dashboard() {
  const hasPermission = useHasPermission();
  useRequireAuth();

  return (
    <div>
      {hasPermission('students:edit') && <EditButton />}
    </div>
  );
}
```

**After** (guard components - simpler):
```typescript
function Dashboard() {
  const { isLoading, isAuthorized } = useRequireAuth();

  if (isLoading) return <LoadingSkeleton />;
  if (!isAuthorized) return null;

  return (
    <div>
      <PermissionGuard permission="students:edit">
        <EditButton />
      </PermissionGuard>
    </div>
  );
}
```

---

## Testing Your Migration

### 1. Test Loading States

Simulate slow auth loading:
```typescript
// In AuthContext, temporarily add delay
useEffect(() => {
  const initAuth = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    // ... rest of auth init
  };
}, []);
```

Verify:
- ✅ Loading UI shows during auth check
- ✅ No flash of unauthorized content
- ✅ Smooth transition to content

### 2. Test Unauthorized Access

Clear your auth token and navigate to protected page:

Verify:
- ✅ Redirects to login
- ✅ Redirect URL is preserved
- ✅ No console errors
- ✅ No unauthorized content briefly visible

### 3. Test Authorized Access

With valid token, navigate to protected page:

Verify:
- ✅ Content loads properly
- ✅ No unnecessary redirects
- ✅ Loading state is brief
- ✅ Everything works as expected

### 4. Test Permission Denial

With token but insufficient permissions:

Verify:
- ✅ Redirects to access denied
- ✅ Proper error message shown
- ✅ No console errors

---

## Automated Migration Script

Run this to find all hook usages:

```bash
# Find all useRequireAuth usages
grep -r "useRequireAuth" src/ --include="*.tsx" --include="*.ts"

# Find all useRequirePermission usages
grep -r "useRequirePermission" src/ --include="*.tsx" --include="*.ts"

# Find all useRequireRole usages
grep -r "useRequireRole" src/ --include="*.tsx" --include="*.ts"

# Find window.location usage (anti-pattern)
grep -r "window.location" src/ --include="*.tsx" --include="*.ts"
```

---

## Rollback Plan

If you need to temporarily rollback:

1. Keep old hook implementations in a separate file:
   ```typescript
   // hooks/auth-guards-legacy.ts
   export function useRequireAuthLegacy() {
     // Old implementation
   }
   ```

2. Update imports to use legacy versions:
   ```typescript
   import { useRequireAuthLegacy as useRequireAuth } from '@/hooks/auth-guards-legacy';
   ```

3. Gradually migrate components one at a time

---

## Support and Questions

If you encounter issues during migration:

1. **Check ROUTING_ARCHITECTURE.md** for patterns and examples
2. **Review this guide** for your specific scenario
3. **Check AuthContext** - ensure it provides `isLoading`
4. **Test in isolation** - migrate one component at a time
5. **Use guard components** - they're simpler for many cases

---

## Checklist

Use this checklist for each migrated component:

- [ ] Updated hook call to destructure state
- [ ] Added loading state check
- [ ] Added unauthorized state check
- [ ] Removed window.location usage (if any)
- [ ] Added proper loading UI
- [ ] Tested loading state
- [ ] Tested unauthorized redirect
- [ ] Tested authorized access
- [ ] No flash of unauthorized content
- [ ] No console errors

---

**Last Updated**: 2025-11-04
**Version**: 1.0.0
**Questions?**: Check ROUTING_ARCHITECTURE.md or contact the architecture team
