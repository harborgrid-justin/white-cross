# withAuth Middleware Module

## Overview

The `withAuth` module provides production-grade authentication and authorization middleware for Next.js 16 App Router API routes. It implements JWT-based authentication with role-based access control (RBAC) and integrates seamlessly with the White Cross healthcare platform's security requirements.

## Features

- ✅ **JWT Token Validation**: Automatic token extraction, verification, and expiration checking
- ✅ **Multiple Authentication Sources**: Support for both Authorization headers and cookies
- ✅ **Role-Based Access Control**: Hierarchical role permissions with fine-grained control
- ✅ **TypeScript Type Safety**: Comprehensive type definitions for all handlers and contexts
- ✅ **HIPAA Compliance Ready**: Integrates with audit logging for PHI access tracking
- ✅ **Error Handling**: Standardized error responses with meaningful error codes
- ✅ **Next.js 16 Compatible**: Designed specifically for App Router API routes
- ✅ **Optional Authentication**: Support for public endpoints with enhanced features for authenticated users
- ✅ **Production Ready**: Comprehensive error handling, logging, and security best practices

## Installation

The module is located at `/src/middleware/withAuth.ts` and can be imported using TypeScript path aliases:

```typescript
// Import specific functions
import { withAuth, withRole, withMinimumRole } from '@/middleware/withAuth';

// Or import from middleware barrel export
import { withAuth } from '@/middleware';
```

## Quick Start

### 1. Basic Protected Route

```typescript
// src/app/api/v1/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';

export const GET = withAuth(async (request, context, auth) => {
  const userId = auth.user.userId;
  const profile = await fetchUserProfile(userId);

  return NextResponse.json({ data: profile });
});
```

### 2. Role-Protected Route

```typescript
// src/app/api/v1/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/middleware/withAuth';

export const POST = withRole('ADMIN', async (request, context, auth) => {
  const body = await request.json();
  const newUser = await createUser(body);

  return NextResponse.json({ data: newUser }, { status: 201 });
});
```

### 3. Hierarchical Role Protection

```typescript
// src/app/api/v1/health-records/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withMinimumRole } from '@/middleware/withAuth';

// Accessible by NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, and ADMIN
export const GET = withMinimumRole('NURSE', async (request, context, auth) => {
  const records = await getHealthRecords();
  return NextResponse.json({ data: records });
});
```

## API Reference

### Core Functions

#### `withAuth(handler: AuthenticatedHandler)`

Wraps an API route handler with JWT authentication. Returns 401 if authentication fails.

**Parameters:**
- `handler`: Async function `(request, context, auth) => Promise<NextResponse>`

**Returns:** Wrapped Next.js route handler

**Example:**
```typescript
export const GET = withAuth(async (request, context, auth) => {
  // auth.user.userId, auth.user.role, auth.user.email available
  // auth.token contains the original JWT
  return NextResponse.json({ userId: auth.user.userId });
});
```

---

#### `withOptionalAuth(handler: OptionalAuthHandler)`

Provides authentication context if available, but doesn't require it. Handler receives `null` for unauthenticated requests.

**Parameters:**
- `handler`: Async function `(request, context, auth | null) => Promise<NextResponse>`

**Returns:** Wrapped Next.js route handler

**Example:**
```typescript
export const GET = withOptionalAuth(async (request, context, auth) => {
  if (auth) {
    // Authenticated - provide personalized data
    return NextResponse.json({ user: auth.user, personalized: true });
  }
  // Unauthenticated - provide public data
  return NextResponse.json({ public: true });
});
```

---

#### `withRole(requiredRoles: string | string[], handler: AuthenticatedHandler)`

Requires specific role(s). Returns 403 if user doesn't have one of the required roles.

**Parameters:**
- `requiredRoles`: Single role string or array of acceptable roles
- `handler`: Authenticated handler function

**Returns:** Wrapped Next.js route handler

**Example:**
```typescript
// Single role
export const DELETE = withRole('ADMIN', async (request, context, auth) => {
  await deleteResource();
  return NextResponse.json({ success: true });
});

// Multiple acceptable roles
export const POST = withRole(
  ['ADMIN', 'NURSE', 'SCHOOL_ADMIN'],
  async (request, context, auth) => {
    const result = await createRecord();
    return NextResponse.json({ data: result });
  }
);
```

---

#### `withMinimumRole(minimumRole: string, handler: AuthenticatedHandler)`

Requires minimum role level using hierarchical permissions. Higher roles automatically have access.

**Role Hierarchy:**
1. `ADMIN` (highest)
2. `DISTRICT_ADMIN`
3. `SCHOOL_ADMIN`
4. `NURSE`
5. `STAFF` (lowest)

**Parameters:**
- `minimumRole`: Minimum required role level
- `handler`: Authenticated handler function

**Returns:** Wrapped Next.js route handler

**Example:**
```typescript
// Requires at least NURSE - accessible by NURSE, SCHOOL_ADMIN, DISTRICT_ADMIN, ADMIN
export const GET = withMinimumRole('NURSE', async (request, context, auth) => {
  const records = await getHealthRecords();
  return NextResponse.json({ data: records });
});
```

---

### TypeScript Types

#### `AuthenticatedContext`

User context provided to authenticated handlers:

```typescript
interface AuthenticatedContext {
  user: JWTPayload;  // Verified user information
  token: string;      // Original JWT token string
}
```

#### `JWTPayload`

JWT token payload structure:

```typescript
interface JWTPayload {
  userId: string;              // User ID
  role: string;                // User role (ADMIN, NURSE, etc.)
  email?: string;              // User email (optional)
  organizationId?: string;     // Organization ID (optional)
  exp: number;                 // Expiration timestamp (seconds)
  iat: number;                 // Issued at timestamp (seconds)
  iss?: string;                // Issuer (optional)
}
```

#### `AuthenticatedHandler`

Handler signature for authenticated routes:

```typescript
type AuthenticatedHandler = (
  request: NextRequest,
  context: any,
  auth: AuthenticatedContext
) => Promise<NextResponse>;
```

#### `OptionalAuthHandler`

Handler signature for optionally authenticated routes:

```typescript
type OptionalAuthHandler = (
  request: NextRequest,
  context: any,
  auth: AuthenticatedContext | null
) => Promise<NextResponse>;
```

---

### Utility Functions

#### `createUnauthorizedResponse(message?: string, code?: string)`

Creates standardized 401 Unauthorized response.

**Example:**
```typescript
return createUnauthorizedResponse('Custom message', 'CUSTOM_CODE');
```

#### `createForbiddenResponse(message?: string, code?: string)`

Creates standardized 403 Forbidden response.

**Example:**
```typescript
return createForbiddenResponse('Access denied', 'CUSTOM_FORBIDDEN');
```

---

## Authentication Flow

### Token Extraction

The middleware extracts JWT tokens from two sources (in order):

1. **Authorization Header** (preferred):
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Cookie**:
   - Cookie name: `auth_token`

### Token Verification

After extraction, the token is:
1. Validated for correct JWT structure (3 parts, base64url encoding)
2. Decoded to extract payload
3. Checked for expiration (`exp` claim)
4. Validated for required fields (`userId`, `role`)
5. Optionally verified via backend API for full signature validation

### Error Responses

#### 401 Unauthorized

Returned when:
- No token is provided
- Token is malformed or invalid
- Token has expired
- Token is missing required fields

**Response Structure:**
```json
{
  "error": "Unauthorized",
  "message": "Authentication required. Please provide a valid token.",
  "code": "AUTH_TOKEN_MISSING" | "AUTH_TOKEN_INVALID" | "AUTH_ERROR"
}
```

#### 403 Forbidden

Returned when:
- User is authenticated but doesn't have required role
- User's role level is insufficient

**Response Structure:**
```json
{
  "error": "Forbidden",
  "message": "Access denied. Required role: ADMIN",
  "code": "AUTH_INSUFFICIENT_ROLE" | "AUTH_INSUFFICIENT_PERMISSIONS",
  "requiredRoles": ["ADMIN"],
  "userRole": "NURSE"
}
```

---

## Advanced Usage

### Dynamic Routes with Authentication

```typescript
// src/app/api/v1/students/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';

export const GET = withAuth(async (request, context, auth) => {
  // Access route parameters
  const { id } = context.params;

  const student = await getStudent(id);

  return NextResponse.json({ data: student });
});

export const PUT = withMinimumRole('NURSE', async (request, context, auth) => {
  const { id } = context.params;
  const body = await request.json();

  const updated = await updateStudent(id, body);

  return NextResponse.json({ data: updated });
});
```

### HIPAA Compliance with Audit Logging

```typescript
import { withMinimumRole } from '@/middleware/withAuth';
import { logPHIAccess, createAuditContext } from '@/lib/audit';

export const GET = withMinimumRole('NURSE', async (request, context, auth) => {
  const { id } = context.params;

  // Fetch PHI data
  const healthRecord = await getHealthRecord(id);

  // HIPAA: Log PHI access
  const auditContext = createAuditContext(request, auth.user.userId);
  await logPHIAccess({
    ...auditContext,
    action: 'VIEW',
    resource: 'HealthRecord',
    resourceId: id,
    details: 'Viewed patient health record'
  });

  return NextResponse.json({ data: healthRecord });
});
```

### Custom Authorization Logic

```typescript
import { withAuth, AuthenticatedContext } from '@/middleware/withAuth';

export const PUT = withAuth(async (request, context, auth) => {
  const { id } = context.params;
  const body = await request.json();

  // Custom authorization: users can only edit their own profile
  if (auth.user.userId !== id && auth.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden', message: 'You can only edit your own profile' },
      { status: 403 }
    );
  }

  const updated = await updateProfile(id, body);
  return NextResponse.json({ data: updated });
});
```

### Combining Multiple Checks

```typescript
import { withMinimumRole } from '@/middleware/withAuth';

export const POST = withMinimumRole('NURSE', async (request, context, auth) => {
  const body = await request.json();

  // Additional business logic checks
  const canCreate = await checkPermissions(auth.user.userId, body.studentId);

  if (!canCreate) {
    return NextResponse.json(
      { error: 'Forbidden', message: 'Insufficient permissions for this student' },
      { status: 403 }
    );
  }

  const result = await createHealthRecord(body);
  return NextResponse.json({ data: result }, { status: 201 });
});
```

---

## Testing

### Unit Tests

Mock the JWT verification utilities:

```typescript
import * as jwtVerifier from '@/lib/auth/jwtVerifier';

jest.mock('@/lib/auth/jwtVerifier');

const mockVerifyToken = jwtVerifier.verifyToken as jest.MockedFunction<
  typeof jwtVerifier.verifyToken
>;

// Mock successful authentication
mockVerifyToken.mockResolvedValue({
  valid: true,
  payload: {
    userId: 'test-user',
    role: 'NURSE',
    email: 'test@example.com',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000)
  }
});
```

See `/src/middleware/__tests__/withAuth.test.ts` for comprehensive test examples.

---

## Migration Guide

### From Manual Authentication

**Before:**
```typescript
export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload || !payload.valid) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const data = await fetchData(payload.userId);
  return NextResponse.json({ data });
}
```

**After:**
```typescript
export const GET = withAuth(async (request, context, auth) => {
  const data = await fetchData(auth.user.userId);
  return NextResponse.json({ data });
});
```

### From `/src/lib/middleware/withAuth.ts`

The API is identical - simply update the import path:

```typescript
// Old
import { withAuth } from '@/lib/middleware/withAuth';

// New
import { withAuth } from '@/middleware/withAuth';
```

---

## Security Considerations

1. **Token Storage**: Never store JWT tokens in localStorage. Use httpOnly cookies or secure session storage.

2. **Token Expiration**: Tokens should have reasonable expiration times (e.g., 15-60 minutes for access tokens).

3. **Secret Management**: JWT secrets must be stored securely in environment variables, never in code.

4. **HTTPS Only**: Always use HTTPS in production to prevent token interception.

5. **Rate Limiting**: Combine with rate limiting middleware to prevent brute force attacks.

6. **Audit Logging**: Always log access to Protected Health Information (PHI) for HIPAA compliance.

7. **Error Messages**: Don't expose sensitive information in error messages.

---

## Dependencies

- `next`: ^16.0.0 (Next.js framework)
- `@/lib/auth/jwtVerifier`: JWT verification utilities
- TypeScript type support

---

## Related Modules

- `/src/lib/auth/jwtVerifier.ts` - JWT token verification
- `/src/middleware/auth.ts` - Edge middleware for page-level authentication
- `/src/lib/auth.ts` - Core authentication utilities
- `/src/lib/audit.ts` - HIPAA audit logging

---

## License

Part of the White Cross Healthcare Platform - Proprietary and Confidential

---

## Changelog

### 2025-10-27
- Initial implementation
- Support for Next.js 16 App Router
- JWT authentication with role-based access control
- Comprehensive TypeScript types
- Full test coverage
- Documentation and usage examples
