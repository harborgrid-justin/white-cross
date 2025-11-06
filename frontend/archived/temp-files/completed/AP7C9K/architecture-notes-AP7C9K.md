# Architecture Notes - API Architecture Implementation

**Agent**: API Architect
**ID**: AP7C9K
**Date**: 2025-11-04
**Module**: identity-access

---

## References to Other Agent Work

- **API Architecture Review**: `.temp/api-architecture-review-K8L9M3.md`
  - Comprehensive code review identifying 21 security vulnerabilities
  - Found 15 API design violations
  - Identified 12 inconsistency issues
  - Provided detailed recommendations for improvements

---

## High-Level Design Decisions

### 1. Centralized Configuration Pattern

**Decision**: Created `lib/config/` directory for all configuration data

**Rationale**:
- Separates configuration (data) from utilities (logic)
- Single source of truth for roles, permissions, and API settings
- Makes it easy to find and update configuration
- Prevents duplicate definitions across codebase

**Files**:
- `lib/config/roles.ts` - Role hierarchy and role-related types
- `lib/config/permissions.ts` - Permission definitions and RBAC logic
- `lib/config/api.ts` - API client configuration and endpoints

### 2. Utility Functions Pattern

**Decision**: Created `lib/utils/` directory for reusable utility functions

**Rationale**:
- Utilities contain logic, unlike configuration which is pure data
- Encourages code reuse and DRY principles
- Easy to test in isolation
- Clear separation of concerns

**Files**:
- `lib/utils/token-utils.ts` - Token extraction, validation, and management
- `lib/utils/api-response.ts` - Response builders and error sanitization

### 3. Type-First API Design

**Decision**: Created comprehensive `types/api.types.ts` with generics

**Rationale**:
- Type safety prevents runtime errors
- Generic types (`ApiResponse<T>`) provide flexibility with safety
- Type guards enable runtime type checking
- Clear contracts between API and consumers
- Improves IDE autocomplete and refactoring

**Benefits**:
```typescript
// Before: Multiple inconsistent formats
{ success: true, data: user }
{ user, token }
{ error: 'message' }
{ errors: { _form: ['error'] } }

// After: Single consistent format with type safety
ApiResponse<User> = ApiSuccessResponse<User> | ApiErrorResponse
```

### 4. Error Sanitization Pattern

**Decision**: All errors go through sanitization before reaching client

**Rationale**:
- Critical security requirement (from API review)
- Prevents backend error message leakage
- Maps technical errors to user-friendly messages
- Maintains detailed logging while protecting sensitive info

**Implementation**:
```typescript
// Production: Generic message
sanitizeError(new Error('Database connection failed'))
// Returns: "Service temporarily unavailable"

// Development: Full error
sanitizeError(new Error('Database connection failed'))
// Returns: "Database connection failed"
```

---

## Integration Patterns

### Client-Server Communication

**Pattern**: Unified token extraction across all contexts

```
┌─────────────────────┐
│ Middleware (Edge)   │ → extractTokenFromRequest(request)
└─────────────────────┘
           ↓
┌─────────────────────┐
│ API Routes (Server) │ → extractTokenFromServer()
└─────────────────────┘
           ↓
┌─────────────────────┐
│ Server Actions      │ → extractTokenFromServer()
└─────────────────────┘
           ↓
┌─────────────────────┐
│ Server Components   │ → extractTokenFromServer()
└─────────────────────┘
```

**Benefits**:
- Same cookie names checked everywhere
- Consistent token handling logic
- Falls back to Authorization header for API clients
- Works in all Next.js contexts

### Permission Checking Flow

```
User Request
    ↓
1. Extract role from token
    ↓
2. checkPermission(role, 'resource:action')
    ↓
3. Check ROLE_PERMISSIONS matrix
    ↓
4. Check PERMISSION_REQUIREMENTS
    ↓
5. Check role hierarchy
    ↓
6. Return boolean result
```

**Multi-layered approach**:
1. Explicit role-permission matrix
2. Minimum role requirements
3. Role hierarchy for inheritance
4. Wildcard support (e.g., `students:*`)

---

## API Design Strategies

### 1. Response Envelope Pattern

**Standard Format**:
```typescript
// Success
{
  success: true,
  data: T,
  meta: {
    timestamp: "2025-11-04T19:30:00Z",
    requestId: "uuid",
    version: "1.0.0"
  }
}

// Error
{
  success: false,
  error: {
    code: "AUTH_INVALID_CREDENTIALS",
    message: "Invalid credentials",
    details?: { field: ["error"] }
  },
  meta: { ... }
}
```

**Advantages**:
- Consistent structure across all endpoints
- `success` flag for easy checking
- Metadata for debugging and tracking
- Error codes for programmatic handling

### 2. Pagination Strategy

**Implementation**:
```typescript
{
  data: T[],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 100,
    totalPages: 5,
    hasMore: true,
    isFirst: true,
    isLast: false
  }
}
```

**Benefits**:
- Rich metadata for UI pagination controls
- Client knows if more pages exist
- Total count available without extra query
- Consistent across all list endpoints

### 3. Error Code System

**Structure**:
```typescript
enum ErrorCode {
  // Authentication errors (1000-1999)
  AUTH_INVALID_CREDENTIALS = 'AUTH_1001',
  AUTH_TOKEN_EXPIRED = 'AUTH_1002',

  // Validation errors (2000-2999)
  VALIDATION_REQUIRED_FIELD = 'VAL_2001',

  // Authorization errors (3000-3999)
  AUTHZ_FORBIDDEN = 'AUTHZ_3001',

  // Resource errors (4000-4999)
  RESOURCE_NOT_FOUND = 'RES_4001',

  // General errors (9000-9999)
  INTERNAL_ERROR = 'ERR_9001',
}
```

**Advantages**:
- Machine-readable error codes
- Grouped by category
- Easy to add new codes
- Supports i18n (error code → translated message)

---

## Performance Considerations

### 1. Token Validation Caching

**Current**: Token decoded on every request
**Recommendation**: Cache decoded token payload in memory

```typescript
// Pseudo-code for future enhancement
const tokenCache = new Map<string, { payload: TokenPayload, exp: number }>();

function decodeTokenCached(token: string): TokenPayload | null {
  const cached = tokenCache.get(token);
  if (cached && Date.now() < cached.exp) {
    return cached.payload;
  }

  const payload = decodeToken(token);
  if (payload) {
    tokenCache.set(token, { payload, exp: payload.exp * 1000 });
  }

  return payload;
}
```

### 2. Permission Checking Optimization

**Current**: Permission checked on every request
**Enhancement**: Added support for permission caching in `lib/permissions.ts`

**Usage**:
```typescript
// Get all permissions for user (cached)
const permissions = await getPermissions(userId, userRole);

// Check multiple permissions efficiently
if (permissions.has('students:read')) {
  // User can read students
}
```

### 3. Response Compression

**Recommendation**: Enable compression for API responses

```typescript
// In API route
export async function GET(request: NextRequest) {
  const data = await fetchData();

  const response = NextResponse.json(successResponse(data));

  // Add compression hint
  response.headers.set('Content-Encoding', 'gzip');

  return response;
}
```

---

## Security Requirements

### 1. Token Management Security

**Implemented**:
- ✓ httpOnly cookies (prevents XSS token theft)
- ✓ Secure flag in production (HTTPS only)
- ✓ SameSite=lax (CSRF protection)
- ✓ Multiple cookie names checked (backward compatibility)
- ✓ Authorization header support (API clients)

**Missing (from review)**:
- ✗ Server-side JWT signature verification (currently client-side only)
- ✗ Token rotation on refresh
- ✗ Refresh token revocation mechanism

**Critical**: Replace client-side token verification with server-side using `jsonwebtoken` library:

```typescript
// lib/utils/token-utils.ts - Add this function
import jwt from 'jsonwebtoken';

export function verifyTokenServer(token: string): TokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

### 2. Error Information Leakage Prevention

**Implemented**:
```typescript
// sanitizeError() function
if (process.env.NODE_ENV === 'production') {
  // Never expose internal errors
  return 'Service temporarily unavailable';
}
// In development, show details
return error.message;
```

**mapBackendError() function**:
```typescript
const errorMap: Record<string, string> = {
  'DB_CONNECTION_ERROR': 'Service temporarily unavailable',
  'QUERY_TIMEOUT': 'Request timeout',
  // ... safe mappings
};
```

### 3. Permission-Based Access Control

**Layers**:
1. **Route-level**: Middleware checks if user can access route
2. **Resource-level**: Permission checks for resource actions
3. **Field-level**: (Future) Hide/show fields based on permissions
4. **Row-level**: (Future) Filter data based on ownership

**Example**:
```typescript
// Route level
if (!checkPermission(role, 'students:read')) {
  return authorizationErrorResponse();
}

// Resource level
const students = await getStudents();

// Row level (future)
const filteredStudents = students.filter(s =>
  s.schoolId === user.schoolId || isAdmin(user.role)
);

// Field level (future)
const sanitizedStudents = filteredStudents.map(s => ({
  ...s,
  ssn: hasPermission(role, 'students:view_ssn') ? s.ssn : undefined,
}));
```

---

## Integration with Other Agents' Work

### 1. Frontend Components

**Integration Points**:
- Components import permission hooks
- Permission hooks use centralized config
- Consistent role/permission checking across UI

**Example**:
```typescript
// hooks/usePermissions.ts
import { checkPermission } from '@/identity-access/lib/config/permissions';

export function useHasPermission(permission: string) {
  const { user } = useAuth();
  return checkPermission(user.role, permission);
}

// Component
function StudentList() {
  const canCreate = useHasPermission('students:create');

  return (
    <>
      {canCreate && <CreateStudentButton />}
      <StudentTable />
    </>
  );
}
```

### 2. Backend API Routes

**Integration Points**:
- API routes use response builders
- Consistent error handling
- Standard response format

**Example**:
```typescript
// app/api/students/route.ts
import { successResponse, authorizationErrorResponse } from '@/identity-access/lib/utils/api-response';
import { checkPermission } from '@/identity-access/lib/config/permissions';
import { extractTokenFromRequest } from '@/identity-access/lib/utils/token-utils';

export async function GET(request: NextRequest) {
  // Extract and verify token
  const token = extractTokenFromRequest(request);
  if (!token) {
    return NextResponse.json(
      authenticationErrorResponse(),
      { status: 401 }
    );
  }

  // Check permission
  const payload = decodeToken(token);
  if (!checkPermission(payload.role, 'students:read')) {
    return NextResponse.json(
      authorizationErrorResponse(),
      { status: 403 }
    );
  }

  // Fetch data
  const students = await db.student.findMany();

  // Return standardized response
  return NextResponse.json(successResponse(students));
}
```

### 3. Server Actions

**Integration Points**:
- Server actions use centralized session management
- Role checking with centralized config
- Error sanitization

**Example**:
```typescript
// actions/student.actions.ts
'use server'

import { getServerAuth, requireMinimumRole } from '@/identity-access/lib/session';
import { errorResponse, successResponse } from '@/identity-access/lib/utils/api-response';
import { UserRole } from '@/identity-access/lib/config/roles';

export async function deleteStudent(id: string) {
  try {
    // Require minimum role
    await requireMinimumRole(UserRole.SCHOOL_ADMIN);

    // Delete student
    await db.student.delete({ where: { id } });

    return successResponse({ deleted: true });
  } catch (error) {
    return toErrorResponse(error, 'Failed to delete student');
  }
}
```

---

## Cross-Agent Communication

### Files Shared Across Modules

**Exported from identity-access**:
- `lib/config/roles.ts` - Other modules check roles
- `lib/config/permissions.ts` - Other modules check permissions
- `lib/session.ts` - Other modules get user session
- `types/api.types.ts` - Other modules use API types

**Import Pattern for Other Modules**:
```typescript
// From another module (e.g., @/students)
import { UserRole, hasMinimumRole } from '@/identity-access';
import { checkPermission } from '@/identity-access';
import { getServerSession } from '@/identity-access';
import type { ApiResponse } from '@/identity-access';
```

**Barrel Export** (`identity-access/index.ts`):
```typescript
// Re-export commonly used items
export { UserRole, ROLE_HIERARCHY, hasMinimumRole } from './lib/config/roles';
export { Resource, Action, checkPermission, canPerformAction } from './lib/config/permissions';
export { getServerSession, requireSession, getServerAuth } from './lib/session';
export type { ApiResponse, ApiSuccessResponse, ApiErrorResponse } from './types/api.types';
export { successResponse, errorResponse, paginatedResponse } from './lib/utils/api-response';
```

---

## Edge Cases and Escalation

### Handled Edge Cases

1. **Multiple Cookie Names**
   - Check primary cookie name first
   - Fall back to alternative names for backward compatibility
   - Support Authorization header for API clients

2. **Missing JWT Secret**
   - Environment variable validation
   - Clear error message if missing
   - Fail-fast in development

3. **Clock Skew in Token Expiration**
   - Allow 30-second clock skew tolerance
   - Prevents false expiration errors
   - Configurable threshold

4. **Token in Static Pages**
   - `headers()` might throw in static context
   - Wrapped in try-catch
   - Gracefully returns null

5. **Role Hierarchy Edge Cases**
   - Unknown roles default to level 0
   - Validation function `isValidRole()`
   - Type safety with enum prevents most issues

### Unhandled Edge Cases (Future Work)

1. **Token Rotation**
   - Need mechanism to invalidate old tokens
   - Refresh token rotation strategy
   - Token revocation list

2. **Multi-Tenancy**
   - School-level data isolation
   - Row-level security in permissions
   - Tenant context in requests

3. **MFA/2FA**
   - Additional authentication factor
   - Session security level
   - Step-up authentication

4. **Offline Support**
   - Cached permissions for offline mode
   - Token refresh without network
   - Sync when back online

---

## Testing Strategy

### Unit Tests Needed

```typescript
// lib/config/roles.test.ts
describe('hasMinimumRole', () => {
  it('should return true when user role >= minimum role', () => {
    expect(hasMinimumRole(UserRole.NURSE, UserRole.STAFF)).toBe(true);
    expect(hasMinimumRole(UserRole.ADMIN, UserRole.NURSE)).toBe(true);
  });

  it('should return false when user role < minimum role', () => {
    expect(hasMinimumRole(UserRole.VIEWER, UserRole.NURSE)).toBe(false);
  });
});

// lib/config/permissions.test.ts
describe('checkPermission', () => {
  it('should allow super admin all permissions', () => {
    expect(checkPermission(UserRole.SUPER_ADMIN, 'any:permission')).toBe(true);
  });

  it('should check explicit permissions', () => {
    expect(checkPermission(UserRole.NURSE, 'students:read')).toBe(true);
    expect(checkPermission(UserRole.VIEWER, 'students:delete')).toBe(false);
  });
});

// lib/utils/token-utils.test.ts
describe('decodeToken', () => {
  it('should decode valid JWT', () => {
    const token = 'eyJ...'; // Valid JWT
    const payload = decodeToken(token);
    expect(payload).toBeTruthy();
    expect(payload.email).toBe('test@example.com');
  });

  it('should return null for invalid JWT', () => {
    expect(decodeToken('invalid')).toBeNull();
  });
});
```

### Integration Tests Needed

```typescript
// API routes integration test
describe('GET /api/students', () => {
  it('should return students for authenticated nurse', async () => {
    const token = await createTestToken({ role: UserRole.NURSE });

    const response = await fetch('/api/students', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('should return 403 for viewer trying to access students', async () => {
    const token = await createTestToken({ role: UserRole.VIEWER });

    const response = await fetch('/api/students', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('AUTHORIZATION_ERROR');
  });
});
```

---

## Summary of Key Operational Principles

**Always Remember**:
1. All roles import from `lib/config/roles.ts`
2. All permissions import from `lib/config/permissions.ts`
3. All token operations import from `lib/utils/token-utils.ts`
4. All API responses use standardized format from `types/api.types.ts`
5. All errors are sanitized before reaching client
6. Type safety is enforced with TypeScript generics
7. Configuration is separate from utilities
8. Single source of truth for all shared data
9. Backward compatibility maintained during migration
10. Security is prioritized over convenience

---

## Future Enhancements

### Phase 2 (Security Hardening)
- [ ] Implement server-side JWT verification
- [ ] Add token rotation on refresh
- [ ] Create refresh token revocation mechanism
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF protection
- [ ] Security headers middleware

### Phase 3 (Feature Expansion)
- [ ] Database-driven RBAC (dynamic permissions)
- [ ] Attribute-based access control (ABAC)
- [ ] Field-level permissions
- [ ] Row-level security
- [ ] Multi-factor authentication
- [ ] Account lockout mechanism

### Phase 4 (Performance)
- [ ] Permission caching with Redis
- [ ] Token payload caching
- [ ] Response caching strategy
- [ ] Request batching
- [ ] Pagination optimization

---

**Architecture Notes Completed**: 2025-11-04
**Next Review**: After team integration and testing
**Contact**: API Architect (AP7C9K)
