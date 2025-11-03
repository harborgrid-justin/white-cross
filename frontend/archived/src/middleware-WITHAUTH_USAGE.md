# withAuth Middleware Usage Guide

## Overview

The `withAuth` module provides higher-order functions for protecting Next.js API routes with JWT-based authentication and role-based access control (RBAC).

## Installation

```typescript
import { withAuth, withOptionalAuth, withRole, withMinimumRole } from '@/middleware/withAuth';
```

## Basic Authentication

### Protect an API Route

```typescript
// src/app/api/v1/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';

export const GET = withAuth(async (request, context, auth) => {
  // auth.user contains authenticated user info
  const { userId, email, role } = auth.user;

  const data = await fetchUserData(userId);

  return NextResponse.json({
    data,
    user: { userId, email, role }
  });
});

export const POST = withAuth(async (request, context, auth) => {
  const body = await request.json();

  // Create resource for authenticated user
  const result = await createResource(auth.user.userId, body);

  return NextResponse.json({ data: result }, { status: 201 });
});
```

### Optional Authentication

For endpoints that provide extra features for authenticated users but don't require authentication:

```typescript
// src/app/api/v1/public/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withOptionalAuth } from '@/middleware/withAuth';

export const GET = withOptionalAuth(async (request, context, auth) => {
  const publicData = await getPublicData();

  if (auth) {
    // User is authenticated - provide personalized data
    const userData = await getUserData(auth.user.userId);
    return NextResponse.json({ ...publicData, user: userData });
  }

  // User is not authenticated - return public data only
  return NextResponse.json(publicData);
});
```

## Role-Based Access Control

### Specific Role Requirement

Restrict access to users with specific role(s):

```typescript
// src/app/api/v1/admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/middleware/withAuth';

// Only ADMIN users can access
export const DELETE = withRole('ADMIN', async (request, context, auth) => {
  const { id } = context.params;
  await deleteResource(id);

  return NextResponse.json({ success: true });
});

// Multiple acceptable roles
export const POST = withRole(
  ['ADMIN', 'SCHOOL_ADMIN', 'NURSE'],
  async (request, context, auth) => {
    const body = await request.json();
    const result = await createRecord(body, auth.user);

    return NextResponse.json({ data: result }, { status: 201 });
  }
);
```

### Minimum Role Requirement

Use role hierarchy - higher roles automatically have access:

**Role Hierarchy** (highest to lowest):
1. ADMIN
2. DISTRICT_ADMIN
3. SCHOOL_ADMIN
4. NURSE
5. STAFF

```typescript
// src/app/api/v1/health-records/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withMinimumRole } from '@/middleware/withAuth';

// Requires at least NURSE role
// Accessible by: NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN
export const GET = withMinimumRole('NURSE', async (request, context, auth) => {
  const records = await getHealthRecords();

  return NextResponse.json({ data: records });
});

// Requires at least SCHOOL_ADMIN role
// Accessible by: SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN
export const POST = withMinimumRole('SCHOOL_ADMIN', async (request, context, auth) => {
  const body = await request.json();
  const result = await createHealthRecord(body);

  return NextResponse.json({ data: result }, { status: 201 });
});
```

## Dynamic Routes

Works seamlessly with Next.js dynamic routes:

```typescript
// src/app/api/v1/students/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';

export const GET = withAuth(async (request, context, auth) => {
  // Access dynamic route params from context
  const { id } = context.params;

  const student = await getStudent(id);

  // HIPAA: Log PHI access
  await logPHIAccess({
    userId: auth.user.userId,
    action: 'VIEW',
    resource: 'Student',
    resourceId: id
  });

  return NextResponse.json({ data: student });
});

export const PUT = withMinimumRole('NURSE', async (request, context, auth) => {
  const { id } = context.params;
  const body = await request.json();

  const updated = await updateStudent(id, body);

  return NextResponse.json({ data: updated });
});

export const DELETE = withRole('ADMIN', async (request, context, auth) => {
  const { id } = context.params;

  await deleteStudent(id);

  return NextResponse.json({ success: true });
});
```

## Error Handling

The middleware automatically handles authentication errors:

### 401 Unauthorized Responses

```json
// Missing token
{
  "error": "Unauthorized",
  "message": "Authentication required. Please provide a valid token.",
  "code": "AUTH_TOKEN_MISSING"
}

// Invalid token
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "code": "AUTH_TOKEN_INVALID"
}
```

### 403 Forbidden Responses

```json
// Insufficient role
{
  "error": "Forbidden",
  "message": "Access denied. Required role: ADMIN",
  "code": "AUTH_INSUFFICIENT_ROLE",
  "requiredRoles": ["ADMIN"],
  "userRole": "NURSE"
}

// Insufficient permissions
{
  "error": "Forbidden",
  "message": "Access denied. Minimum required role: SCHOOL_ADMIN",
  "code": "AUTH_INSUFFICIENT_PERMISSIONS",
  "minimumRole": "SCHOOL_ADMIN",
  "userRole": "NURSE"
}
```

## Request Headers & Cookies

The middleware extracts JWT tokens from:

1. **Authorization Header** (preferred):
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Cookies**:
   - `auth_token` cookie

## Type Safety

The middleware provides full TypeScript type safety:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedContext } from '@/middleware/withAuth';

export const GET = withAuth(async (request, context, auth) => {
  // TypeScript knows auth.user has these properties:
  const userId: string = auth.user.userId;
  const role: string = auth.user.role;
  const email: string | undefined = auth.user.email;
  const organizationId: string | undefined = auth.user.organizationId;

  // auth.token contains the original JWT string
  const token: string = auth.token;

  return NextResponse.json({ userId, role });
});
```

## Integration with Audit Logging

For HIPAA compliance, integrate with audit logging:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withMinimumRole } from '@/middleware/withAuth';
import { logPHIAccess, createAuditContext } from '@/lib/audit';

export const GET = withMinimumRole('NURSE', async (request, context, auth) => {
  const { id } = context.params;

  // Fetch health record (PHI data)
  const record = await getHealthRecord(id);

  // HIPAA: Log PHI access
  const auditContext = createAuditContext(request, auth.user.userId);
  await logPHIAccess({
    ...auditContext,
    action: 'VIEW',
    resource: 'HealthRecord',
    resourceId: id,
    details: 'Viewed patient health record'
  });

  return NextResponse.json({ data: record });
});
```

## Best Practices

1. **Use Minimum Role When Possible**: Prefer `withMinimumRole` over `withRole` for hierarchical permissions
2. **Log PHI Access**: Always log when accessing Protected Health Information (PHI)
3. **Validate Input**: Even with authentication, validate and sanitize all inputs
4. **Handle Errors**: Provide meaningful error messages without exposing sensitive information
5. **Type Safety**: Leverage TypeScript types for compile-time safety

## Testing

Mock the authentication in tests:

```typescript
import { NextRequest } from 'next/server';
import * as jwtVerifier from '@/lib/auth/jwtVerifier';

jest.mock('@/lib/auth/jwtVerifier');

const mockVerifyToken = jwtVerifier.verifyToken as jest.MockedFunction<typeof jwtVerifier.verifyToken>;

// Mock successful authentication
mockVerifyToken.mockResolvedValue({
  valid: true,
  payload: {
    userId: 'test-user-id',
    role: 'NURSE',
    email: 'test@example.com',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  }
});
```

## Migration from Existing Patterns

### From Manual Token Verification

**Before:**
```typescript
export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Handler logic...
}
```

**After:**
```typescript
export const GET = withAuth(async (request, context, auth) => {
  // Handler logic with auth.user automatically available
});
```

### From Existing Middleware

If you're currently using `/src/lib/middleware/withAuth.ts`:

```typescript
// Old import
import { withAuth } from '@/lib/middleware/withAuth';

// New import (same API, better integration)
import { withAuth } from '@/middleware/withAuth';
```

Both implementations have the same API signature for easy migration.
