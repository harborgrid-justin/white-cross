# Next.js App Router - Routing Architecture

## Overview

This document describes the routing and authentication architecture for the White Cross Healthcare platform using Next.js 13+ App Router patterns.

## Architecture Layers

Our routing protection strategy uses **multiple layers of defense**:

```
1. Edge Middleware (First Line of Defense)
   ↓
2. Server Components / Layouts (Server-side checks)
   ↓
3. Guard Components & Hooks (Client-side protection)
   ↓
4. API Route Guards (API endpoint protection)
```

---

## Layer 1: Edge Middleware

**File**: `src/middleware.ts`

**Purpose**: First line of defense - runs on Vercel Edge Runtime before requests reach your application.

**Responsibilities**:
- JWT authentication and validation
- Route protection (public vs protected)
- Security headers injection
- User context injection into request headers
- Redirects for unauthenticated users

**When to Use**:
- ✅ Global authentication checks
- ✅ Security headers
- ✅ Redirects based on auth state
- ✅ Adding user context to requests

**When NOT to Use**:
- ❌ Complex business logic (keep it lightweight)
- ❌ Database queries (use API routes)
- ❌ Heavy computations (edge runtime has limitations)

**Example**:
```typescript
// Automatically runs on all protected routes
// No code needed in your pages/layouts
```

---

## Layer 2: Server Components

**Purpose**: Server-side route protection with access to user context.

**Responsibilities**:
- Check user permissions before rendering
- Fetch user-specific data
- Conditional rendering based on roles

**When to Use**:
- ✅ Page-level protection
- ✅ Layout-level protection
- ✅ When you need server-side data fetching

**Example**:
```typescript
// app/admin/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const headersList = headers();
  const userRole = headersList.get('x-user-role');

  // Check role server-side
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    redirect('/access-denied');
  }

  return <AdminPanel />;
}
```

---

## Layer 3: Guard Components & Hooks

**Purpose**: Client-side protection with loading states and conditional rendering.

### Guard Hooks

**When to Use**:
- ✅ Client Components that need auth
- ✅ When you need loading states
- ✅ Preventing flash of unauthorized content

**Available Hooks**:
1. `useRequireAuth()` - Requires authentication
2. `useRequirePermission(permission)` - Requires specific permission
3. `useRequireRole(role)` - Requires specific role

**Example**:
```typescript
'use client';

import { useRequireAuth } from '@/identity-access/hooks/auth-guards';

export default function ProtectedClientComponent() {
  const { isLoading, isAuthorized } = useRequireAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <div>Protected Content</div>;
}
```

### Guard Components

**When to Use**:
- ✅ Wrapping sections of UI
- ✅ Conditional rendering without hooks
- ✅ Reusable protection patterns

**Available Components**:
1. `<AuthGuard>` - Requires authentication
2. `<PermissionGuard>` - Requires specific permission
3. `<RoleGuard>` - Requires specific role

**Example**:
```typescript
import { RoleGuard } from '@/identity-access/hooks/auth-guards';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Only visible to admins */}
      <RoleGuard role="ADMIN">
        <AdminPanel />
      </RoleGuard>

      {/* Visible to all authenticated users */}
      <UserStats />
    </div>
  );
}
```

---

## Layer 4: API Route Guards

**Files**: `identity-access/middleware/withAuth.ts` (to be renamed to `api-guards/`)

**Purpose**: Protect API routes from unauthorized access.

**Responsibilities**:
- JWT verification for API requests
- Role-based access control
- User context extraction

**When to Use**:
- ✅ All API routes that require authentication
- ✅ API routes with role restrictions
- ✅ API routes needing user context

**Available Guards**:
1. `withAuth(handler)` - Requires authentication
2. `withRole(roles, handler)` - Requires specific role(s)
3. `withMinimumRole(role, handler)` - Requires minimum role level
4. `withOptionalAuth(handler)` - Optional authentication

**Example**:
```typescript
// app/api/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/identity-access/middleware/withAuth';

export const GET = withAuth(async (request, context, auth) => {
  // auth.user contains authenticated user info
  const students = await getStudents(auth.user.userId);

  return NextResponse.json({ students });
});
```

**Example with Role**:
```typescript
// app/api/admin/users/route.ts
import { withRole } from '@/identity-access/middleware/withAuth';

export const GET = withRole('ADMIN', async (request, context, auth) => {
  // Only ADMIN role can access this
  const users = await getAllUsers();

  return NextResponse.json({ users });
});
```

---

## Route Configuration

**File**: `identity-access/lib/config/routes.ts`

Centralized route configuration with:
- Public routes list
- Protected routes list
- Admin routes list
- Route → Permission mapping
- Route → Role mapping
- Default redirects by role

**Usage**:
```typescript
import {
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  getRoutePermissions,
  hasRouteAccess
} from '@/identity-access/lib/config/routes';

// Check if route is public
const isPublic = isPublicRoute('/login');

// Get required permissions for a route
const permissions = getRoutePermissions('/students/new');

// Check if user has access
const hasAccess = hasRouteAccess('NURSE', '/medications');
```

---

## Decision Tree: When to Use What?

### Scenario 1: Protecting a Page
```
┌─ Is it a Server Component?
│  ├─ YES → Use headers() + redirect() in the component
│  └─ NO (Client Component) → Use useRequireAuth() hook
```

### Scenario 2: Protecting an API Route
```
┌─ Does it require specific role?
│  ├─ YES → Use withRole() or withMinimumRole()
│  └─ NO → Use withAuth()
```

### Scenario 3: Conditional UI Rendering
```
┌─ Do you need loading state?
│  ├─ YES → Use Guard Hooks (useRequireAuth, etc.)
│  └─ NO → Use Guard Components (<AuthGuard>, <RoleGuard>)
```

### Scenario 4: Permission-Based Features
```
┌─ Where is the check needed?
│  ├─ Server Component → Use headers() + permission check
│  ├─ Client Component → Use useHasPermission() hook
│  └─ Conditional Rendering → Use <PermissionGuard>
```

---

## Common Patterns

### Pattern 1: Protected Page with Loading State
```typescript
'use client';

export default function ProtectedPage() {
  const { isLoading, isAuthorized } = useRequireAuth();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthorized) {
    return null;
  }

  return <PageContent />;
}
```

### Pattern 2: Server Component with Role Check
```typescript
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const headersList = headers();
  const userRole = headersList.get('x-user-role');

  if (!['ADMIN', 'SUPER_ADMIN'].includes(userRole || '')) {
    redirect('/access-denied');
  }

  const data = await fetchAdminData();

  return <AdminDashboard data={data} />;
}
```

### Pattern 3: Mixed Protection (Server + Client)
```typescript
// Server Component (page.tsx)
import { headers } from 'next/headers';
import ClientComponent from './ClientComponent';

export default async function Page() {
  const headersList = headers();
  const userId = headersList.get('x-user-id');

  const serverData = await fetchData(userId);

  return <ClientComponent serverData={serverData} />;
}

// Client Component
'use client';

export default function ClientComponent({ serverData }) {
  const { isLoading } = useRequireAuth();

  if (isLoading) return <Loading />;

  return <div>{serverData}</div>;
}
```

### Pattern 4: API Route with RBAC
```typescript
import { withMinimumRole } from '@/identity-access/middleware/withAuth';

// Accessible by NURSE and above (NURSE, SCHOOL_ADMIN, ADMIN, etc.)
export const POST = withMinimumRole('NURSE', async (request, context, auth) => {
  const body = await request.json();

  // auth.user.role is guaranteed to be NURSE or higher
  const result = await createMedicationRecord(auth.user.userId, body);

  return NextResponse.json({ result });
});
```

---

## Security Best Practices

### 1. Defense in Depth
✅ **DO**: Use multiple layers (middleware + component guards + API guards)
❌ **DON'T**: Rely on only client-side protection

### 2. Server-Side Validation
✅ **DO**: Always validate permissions in API routes
❌ **DON'T**: Trust client-side permission checks alone

### 3. Loading States
✅ **DO**: Show loading UI while checking auth
❌ **DON'T**: Flash unauthorized content then redirect

### 4. Redirect Handling
✅ **DO**: Use Next.js router (useRouter, redirect)
❌ **DON'T**: Use window.location.href

### 5. Token Management
✅ **DO**: Verify JWT signatures server-side
❌ **DON'T**: Decode tokens client-side for security decisions

---

## File Organization

```
src/
├── middleware.ts                           # Root middleware (Edge)
├── identity-access/
│   ├── middleware/                         # To be renamed: api-guards/
│   │   ├── withAuth.ts                    # API route guards
│   │   └── rbac.ts                        # RBAC logic
│   ├── hooks/
│   │   └── auth-guards.ts                 # Client guards & hooks
│   ├── lib/
│   │   └── config/
│   │       └── routes.ts                  # Route configuration
│   └── ROUTING_ARCHITECTURE.md            # This file
└── app/
    ├── (dashboard)/
    │   └── page.tsx                       # Server Component protection
    └── api/
        └── students/
            └── route.ts                   # API route with guards
```

---

## Migration from Old Patterns

### Old Pattern (WRONG):
```typescript
// ❌ Direct window.location
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    window.location.href = '/login';
  }
}
```

### New Pattern (CORRECT):
```typescript
// ✅ useEffect + useRouter with loading state
export function useRequireAuth(): AuthGuardState {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [state, setState] = useState({ isLoading: true, isAuthorized: false });

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      setState({ isLoading: false, isAuthorized: false });
      return;
    }

    setState({ isLoading: false, isAuthorized: true });
  }, [isAuthenticated, isLoading, router]);

  return state;
}
```

---

## Troubleshooting

### Issue: Flash of unauthorized content
**Solution**: Use guard hooks with loading states

### Issue: Infinite redirect loops
**Solution**: Check middleware matcher config and public routes list

### Issue: API returns 401 even with valid token
**Solution**: Verify token is being sent in Authorization header or cookies

### Issue: Client guards not working
**Solution**: Ensure AuthContext is wrapping your component tree

### Issue: TypeScript errors with guard components
**Solution**: Import types from auth-guards.ts and auth-permissions.ts

---

## References

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Authentication Guide](https://nextjs.org/docs/app/building-your-application/authentication)
- [Next.js App Router](https://nextjs.org/docs/app)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Last Updated**: 2025-11-04
**Version**: 1.0.0
**Maintainer**: Next.js App Router Architect
