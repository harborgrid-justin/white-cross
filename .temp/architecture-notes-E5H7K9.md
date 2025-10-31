# Architecture Notes - Error Handling and Status Codes - E5H7K9

## Agent Information
- **Agent**: Agent 5: Error Handling and Status Codes
- **Task ID**: E5H7K9
- **Date**: 2025-10-31
- **Related Work**: AP9E2X (API error handlers), N4W8Q2 (middleware), R3M8D1 (metadata)

## Current State Analysis

### ✅ EXCELLENT - Already Using Next.js Best Practices

#### 1. notFound() Usage
**Status**: Well adopted (20 files)

**Examples**:
- `/app/(dashboard)/medications/[id]/page.tsx` (line 94, 423)
- `/app/(dashboard)/medications/prescriptions/[id]/page.tsx` (line 10, 60)
- `/lib/server/fetch.ts` (line 16, 161)

**Pattern**:
```typescript
import { notFound } from 'next/navigation';

async function getData(id: string) {
  const data = await fetch(...);
  if (!data) return null;
  return data;
}

export default async function Page({ params }) {
  const data = await getData(params.id);
  if (!data) {
    notFound(); // ✅ Proper Next.js pattern
  }
  return <div>...</div>;
}
```

#### 2. redirect() Usage in Server Actions and Server Functions
**Status**: Properly implemented

**Examples**:
- `/actions/auth.actions.ts` (line 25, 243):
  ```typescript
  import { redirect } from 'next/navigation';

  export async function logoutAction(): Promise<void> {
    // Clear cookies...
    redirect('/login'); // ✅ Server action redirect
  }
  ```

- `/lib/server/fetch.ts` (lines 16, 122, 157, 159):
  ```typescript
  import { notFound, redirect } from 'next/navigation';

  export async function serverFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    // ... auth check
    if (!token) {
      redirect('/login'); // ✅ Server-side redirect
    }

    // ... response handling
    if (response.status === 401) {
      redirect('/login'); // ✅ Proper 401 handling
    } else if (response.status === 403) {
      redirect('/access-denied'); // ✅ Proper 403 handling
    } else if (response.status === 404) {
      notFound(); // ✅ Proper 404 handling
    }
  }
  ```

#### 3. Middleware Using NextResponse.redirect()
**Status**: Correct implementation

**Examples**:
- `/middleware/auth.ts` (lines 146-155, 163-173, 177-186):
  ```typescript
  import { NextRequest, NextResponse } from 'next/server';

  export function authMiddleware(request: NextRequest) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return {
        response: NextResponse.redirect(loginUrl), // ✅ Correct for middleware
        payload: null,
      };
    }
  }
  ```

**Note**: Middleware MUST use `NextResponse.redirect()`, NOT `redirect()` from 'next/navigation'.

#### 4. Error Boundary Coverage
**Status**: Good coverage (11 files)

**Existing error.tsx files**:
- `/app/error.tsx` - Root error boundary
- `/app/(dashboard)/analytics/error.tsx`
- `/app/(dashboard)/appointments/error.tsx`
- `/app/(dashboard)/communications/error.tsx`
- `/app/(dashboard)/compliance/error.tsx`
- `/app/(dashboard)/dashboard/error.tsx`
- `/app/(dashboard)/documents/error.tsx`
- `/app/(dashboard)/incidents/error.tsx`
- `/app/(dashboard)/inventory/error.tsx`
- `/app/(dashboard)/medications/error.tsx`
- `/app/students/error.tsx`

#### 5. Not-Found Pages
**Status**: Limited coverage (2 files)

**Existing not-found.tsx files**:
- `/app/not-found.tsx` - Root 404 page
- `/app/students/not-found.tsx` - Excellent example with proper UI

**Example of good not-found.tsx**:
```typescript
// /app/students/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function StudentNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <AlertTriangle />
        <h1>Student Not Found</h1>
        <p>The student you're looking for doesn't exist...</p>
        <Link href="/students">
          <Button>Back to Students</Button>
        </Link>
      </Card>
    </div>
  );
}
```

### ❌ AREAS FOR IMPROVEMENT

#### 1. Missing not-found.tsx Files

**Route segments needing not-found.tsx**:
- `/app/(auth)/not-found.tsx` - Auth route group
- `/app/(dashboard)/not-found.tsx` - Dashboard route group
- `/app/admin/not-found.tsx` - Admin routes
- `/app/(dashboard)/medications/[id]/not-found.tsx` - Medication detail 404s
- `/app/(dashboard)/documents/[id]/not-found.tsx` - Document detail 404s
- `/app/(dashboard)/forms/[id]/not-found.tsx` - Form detail 404s
- `/app/(dashboard)/incidents/[id]/not-found.tsx` - Incident detail 404s

**Impact**: Without segment-level not-found.tsx files, 404s fall back to root not-found.tsx, losing context-specific messaging.

**Recommendation**: Create not-found.tsx files for major route segments with context-aware messages.

#### 2. Missing error.tsx Files

**Route segments needing error.tsx**:
- `/app/(auth)/error.tsx` - Auth errors (login failures, session expired)
- `/app/admin/error.tsx` - Admin route errors
- `/app/(dashboard)/billing/error.tsx` - Billing errors
- `/app/(dashboard)/forms/error.tsx` - Form errors
- `/app/(dashboard)/immunizations/error.tsx` - Immunization errors
- `/app/(dashboard)/reports/error.tsx` - Report generation errors

**Impact**: Without segment-level error.tsx files, errors bubble up to root error boundary, losing error recovery options.

**Recommendation**: Create error.tsx files for critical route segments with appropriate recovery actions.

#### 3. Response.redirect Usage Outside Middleware

**Files using Response.redirect outside middleware**:
- `/app/unauthorized.tsx`
- `/app/forbidden.tsx`
- `/app/(auth)/session-expired/page.tsx`
- `/app/(auth)/access-denied/page.tsx`

**Analysis Needed**: Review if these should be:
- Server components using `redirect()` from 'next/navigation'
- Error pages that don't need redirects
- Special handling pages that are appropriate as-is

#### 4. Client Component router.push Usage

**Status**: 54 files using router.push/router.replace

**Analysis**: Many client components appropriately use router.push for:
- Navigation after form submission
- Tab switching
- Interactive filtering
- Modal closures

**Review**: Check if any of these patterns would be better as Server Actions with `redirect()`:
- Post-mutation navigation
- Authentication flows
- Form submissions that should be server-side

## Next.js Error Handling Patterns

### Pattern 1: notFound() in Server Components

**When to use**:
- Dynamic routes where resource might not exist
- After fetching data that returns null
- 404 scenarios in server components

**Example**:
```typescript
// app/medications/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function MedicationPage({ params }) {
  const medication = await getMedication(params.id);

  if (!medication) {
    notFound(); // Triggers nearest not-found.tsx
  }

  return <div>{medication.name}</div>;
}
```

### Pattern 2: redirect() in Server Actions

**When to use**:
- After successful form submission
- Authentication redirects
- Authorization redirects
- Post-mutation navigation

**Example**:
```typescript
// actions/auth.actions.ts
'use server';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const result = await authenticate(formData);

  if (result.success) {
    redirect('/dashboard'); // Server-side redirect
  }

  return { error: result.error };
}
```

### Pattern 3: redirect() in Server Utility Functions

**When to use**:
- Centralized fetch utilities
- Authentication checks
- Authorization checks

**Example**:
```typescript
// lib/server/fetch.ts
import { redirect, notFound } from 'next/navigation';

export async function fetchWithAuth(url: string) {
  const token = await getAuthToken();

  if (!token) {
    redirect('/login'); // Redirect if unauthenticated
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (response.status === 401) redirect('/login');
  if (response.status === 403) redirect('/forbidden');
  if (response.status === 404) notFound();

  return response.json();
}
```

### Pattern 4: NextResponse.redirect() in Middleware

**When to use**:
- Edge middleware redirects
- Authentication checks before page load
- RBAC checks
- Locale redirects

**Example**:
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    ); // ✅ Use NextResponse in middleware
  }

  return NextResponse.next();
}
```

### Pattern 5: router.push() in Client Components

**When to use**:
- Client-side navigation after user interaction
- Tab switching
- Modal closures
- Filter changes

**Example**:
```typescript
// components/LoginForm.tsx
'use client';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard'); // ✅ Client-side navigation
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

## Error Hierarchy and Bubbling

### Error Boundary Hierarchy
```
app/
├── error.tsx                    # Root error boundary (catches all)
├── layout.tsx
├── not-found.tsx               # Root 404 page
├── (auth)/
│   ├── error.tsx               # ❌ MISSING - Auth errors
│   ├── not-found.tsx           # ❌ MISSING - Auth 404s
│   ├── login/page.tsx
│   └── access-denied/page.tsx
├── (dashboard)/
│   ├── error.tsx               # ❌ MISSING - Dashboard errors
│   ├── not-found.tsx           # ❌ MISSING - Dashboard 404s
│   ├── medications/
│   │   ├── error.tsx           # ✅ EXISTS
│   │   ├── not-found.tsx       # ❌ MISSING
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── not-found.tsx   # ❌ MISSING (important!)
│   │       └── page.tsx
│   └── students/
│       ├── error.tsx           # ✅ EXISTS
│       ├── not-found.tsx       # ❌ MISSING
│       └── [id]/
│           ├── not-found.tsx   # ❌ MISSING (important!)
│           └── page.tsx
└── admin/
    ├── error.tsx               # ❌ MISSING
    ├── not-found.tsx           # ❌ MISSING
    └── settings/page.tsx
```

### Error Bubbling Behavior

1. **notFound() call**:
   - Looks for nearest `not-found.tsx` in route hierarchy
   - Bubbles up until found
   - Falls back to root `not-found.tsx` if none found

2. **Uncaught Error**:
   - Looks for nearest `error.tsx` in route hierarchy
   - Bubbles up until found
   - Falls back to root `error.tsx` if none found

3. **redirect() call**:
   - Immediately redirects, no bubbling
   - Works in Server Components, Server Actions, Route Handlers
   - Does NOT work in middleware (use NextResponse.redirect)

## Status Codes and Responses

### Current Implementation

#### 401 Unauthorized
**When**: Authentication required but not provided
**Current handling**:
- Middleware: `NextResponse.redirect('/login')`
- Server fetch: `redirect('/login')`
**Status**: ✅ Correct

#### 403 Forbidden
**When**: Authenticated but not authorized
**Current handling**:
- Middleware: `NextResponse.redirect('/forbidden')`
- Server fetch: `redirect('/access-denied')`
**Status**: ✅ Correct

#### 404 Not Found
**When**: Resource doesn't exist
**Current handling**:
- Server components: `notFound()`
- Server fetch: `notFound()`
**Status**: ✅ Correct

### Next.js 15+ Status Functions

**Note**: Check Next.js version for availability of:
- `unauthorized()` function (Next.js 15+)
- `forbidden()` function (Next.js 15+)

These provide better semantics than `redirect()` for auth failures.

## HIPAA Compliance Considerations

### PHI in Error Messages
**Requirement**: Error messages must not expose Protected Health Information

**Example**:
```typescript
// ❌ BAD - Exposes patient name
if (!medication) {
  throw new Error(`Medication for patient John Doe not found`);
}

// ✅ GOOD - Generic error
if (!medication) {
  notFound(); // Generic 404 page
}
```

### Audit Logging for Errors
**Requirement**: Failed access attempts must be logged

**Current implementation**: See AP9E2X's API error handlers with audit logging placeholders

**Integration point**:
```typescript
// lib/server/fetch.ts
if (response.status === 403) {
  await auditLog({
    userId: user?.id,
    action: AUDIT_ACTIONS.ACCESS_DENIED,
    resource: endpoint,
    success: false,
    errorMessage: 'Forbidden'
  });
  redirect('/forbidden');
}
```

## Implementation Recommendations

### Priority 1: Add Critical not-found.tsx Files
1. `/app/(dashboard)/not-found.tsx` - Covers all dashboard 404s
2. `/app/admin/not-found.tsx` - Covers admin 404s
3. `/app/(dashboard)/medications/[id]/not-found.tsx` - Medication-specific
4. `/app/(dashboard)/documents/[id]/not-found.tsx` - Document-specific

### Priority 2: Add Critical error.tsx Files
1. `/app/(auth)/error.tsx` - Auth flow errors
2. `/app/admin/error.tsx` - Admin errors with recovery
3. `/app/(dashboard)/billing/error.tsx` - Financial errors
4. `/app/(dashboard)/forms/error.tsx` - Form submission errors

### Priority 3: Review and Optimize
1. Review client component router.push usage
2. Check for opportunities to use Server Actions
3. Verify error message PHI sanitization
4. Add audit logging to error handlers

## Cross-Agent Coordination

### Building on AP9E2X's API Error Handlers
- API routes have error.tsx files with JSON error responses
- Coordinate to ensure consistent error format
- Add client-side error.tsx for UI errors

### Building on N4W8Q2's Middleware
- Middleware correctly uses NextResponse.redirect()
- No changes needed to middleware patterns
- Error pages handle middleware redirects

### Building on R3M8D1's Metadata
- Add metadata to new not-found.tsx files
- Ensure SEO-friendly 404 pages
- Keep robots:noindex for error pages

## Next Steps

1. Create not-found.tsx files for major route segments
2. Create error.tsx files for critical routes
3. Add proper error recovery UI
4. Ensure HIPAA-compliant error messages
5. Document error handling patterns for team
6. Test error boundaries and 404 handling
