# Next.js Middleware - Complete Documentation

## Overview

This document provides comprehensive documentation for the production-ready Next.js middleware system implemented for the White Cross healthcare platform.

## Table of Contents

1. [Architecture](#architecture)
2. [Components](#components)
3. [Execution Flow](#execution-flow)
4. [RBAC Permission Matrix](#rbac-permission-matrix)
5. [Configuration](#configuration)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Architecture

### Modular Design

The middleware system is built with a modular architecture, separating concerns into individual middleware components:

```
src/
├── middleware.production.ts       # Main composite middleware
├── middleware/
│   ├── auth.ts                   # Authentication & JWT validation
│   ├── rbac.ts                   # Role-based access control
│   ├── security.ts               # Security headers & CORS
│   ├── audit.ts                  # HIPAA audit logging
│   ├── rateLimit.ts              # Rate limiting
│   └── sanitization.ts           # Request sanitization
└── lib/security/
    ├── config.ts                 # Security configuration
    ├── csrf.ts                   # CSRF protection utilities
    └── sanitization.ts           # Sanitization utilities
```

### Execution Order

Middleware components execute in a specific order to ensure security and performance:

1. **Security Headers** - Applied to all requests
2. **CORS/Preflight** - Handle OPTIONS requests
3. **Rate Limiting** - Prevent abuse
4. **CSRF Validation** - Validate state-changing requests
5. **Authentication** - Verify JWT tokens
6. **RBAC Authorization** - Check permissions
7. **Audit Logging** - Log PHI/admin access
8. **Sanitization** - Mark requests for sanitization

---

## Components

### 1. Authentication Middleware (`auth.ts`)

**Purpose**: Validates JWT tokens and extracts user context.

**Features**:
- Cookie and header-based token extraction
- JWT decoding and validation
- Token expiration checking
- User context extraction
- Public route handling

**Key Functions**:
```typescript
authMiddleware(request)           // Main auth check
extractToken(request)             // Get token from request
decodeToken(token)                // Decode JWT payload
isTokenExpired(payload)           // Check expiration
addUserContextHeaders(request, payload) // Add user headers
```

**Public Routes**:
- `/login`
- `/forgot-password`
- `/reset-password`
- `/session-expired`
- `/access-denied`

### 2. RBAC Middleware (`rbac.ts`)

**Purpose**: Implements fine-grained role-based access control.

**Roles**:
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Full access except super admin functions
- `DISTRICT_ADMIN` - Multi-school oversight
- `SCHOOL_ADMIN` - Single school management
- `SCHOOL_NURSE` / `NURSE` - Clinical operations
- `OFFICE_STAFF` / `STAFF` - Administrative support
- `COUNSELOR` - Student support
- `VIEWER` - Read-only access

**Resources**:
- Students
- Medications
- Appointments
- Health Records
- Incidents
- Inventory
- Communications
- Emergency Contacts
- Compliance
- Analytics
- Audit Logs
- Users
- Settings
- Admin

**Actions**:
- `CREATE` - Create new resources
- `READ` - View resources
- `UPDATE` - Modify resources
- `DELETE` - Remove resources
- `ADMINISTER` - Special admin actions
- `EXPORT` - Export data
- `IMPORT` - Import data

**Permission Format**: `resource:action` (e.g., `students:read`, `medications:*`)

### 3. Security Middleware (`security.ts`)

**Purpose**: Apply HIPAA-compliant security headers.

**Headers**:
- `Content-Security-Policy` - XSS prevention
- `Strict-Transport-Security` - HTTPS enforcement
- `X-Frame-Options` - Clickjacking protection
- `X-Content-Type-Options` - MIME sniffing prevention
- `X-XSS-Protection` - XSS filter
- `Referrer-Policy` - Referrer control
- `Permissions-Policy` - Feature control

**CORS Configuration**:
- Allowed origins from env variables
- Credentials support
- Preflight handling

### 4. Audit Middleware (`audit.ts`)

**Purpose**: Log PHI access and admin operations for HIPAA compliance.

**Logged Events**:
- PHI access (students, medications, health records, etc.)
- Admin operations
- Authorization failures
- Critical security events

**Audit Log Fields**:
- Timestamp
- User ID and role
- Action and resource
- IP address
- User agent
- Request details

### 5. Rate Limit Middleware (`rateLimit.ts`)

**Purpose**: Prevent abuse and ensure system stability.

**Limits**:
- **General Routes**: 100 requests / 15 minutes
- **Auth Routes**: 5 requests / 15 minutes
- **PHI Routes**: 60 requests / 1 minute

**Features**:
- Per-IP rate limiting
- Configurable windows and limits
- In-memory storage (Redis-ready)
- Automatic cleanup of expired entries
- Standard rate limit headers

**Headers**:
- `X-RateLimit-Limit` - Total requests allowed
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Reset timestamp
- `Retry-After` - Seconds to wait (on 429)

### 6. Sanitization Middleware (`sanitization.ts`)

**Purpose**: Mark requests for sanitization to prevent XSS.

**Features**:
- Marks state-changing requests for sanitization
- XSS pattern removal
- Script tag stripping
- Event handler removal
- Dangerous protocol blocking

**Note**: Actual sanitization happens in API routes due to Next.js Edge Runtime limitations.

---

## Execution Flow

### Request Flow Diagram

```
┌─────────────────────┐
│  Incoming Request   │
└──────────┬──────────┘
           │
           ├──────────────────────────────┐
           │  1. Security Headers         │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  2. CORS/Preflight Check     │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  3. Static File Check        │
           │     (Skip if static)         │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  4. Rate Limiting            │
           │     (429 if exceeded)        │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  5. CSRF Validation          │
           │     (403 if invalid)         │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  6. Authentication           │
           │     (Redirect if no token)   │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  7. Public Route Check       │
           │     (Allow if public)        │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  8. User Context Headers     │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  9. RBAC Authorization       │
           │     (Redirect if denied)     │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  10. Audit Logging           │
           │      (PHI/Admin routes)      │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  11. Sanitization Markers    │
           └──────────┬───────────────────┘
                      │
           ┌──────────▼───────────────────┐
           │  12. Final Response          │
           │      (With all headers)      │
           └──────────────────────────────┘
```

### Performance Considerations

- **Static Files**: Bypassed early for maximum performance
- **Public Routes**: Skip most checks
- **Authenticated Routes**: Full security pipeline
- **Warning Threshold**: 100ms (logged if exceeded)
- **In-Memory Storage**: Rate limit and session data

---

## RBAC Permission Matrix

### Role Capabilities Overview

| Role | Students | Medications | Health Records | Appointments | Incidents | Inventory | Admin |
|------|----------|-------------|----------------|--------------|-----------|-----------|-------|
| SUPER_ADMIN | ✓ All | ✓ All | ✓ All | ✓ All | ✓ All | ✓ All | ✓ All |
| ADMIN | ✓ All | ✓ All | ✓ All | ✓ All | ✓ All | ✓ All | ✓ Read |
| DISTRICT_ADMIN | Read, Update | Read | Read | Read | Read | Read | ✓ Read |
| SCHOOL_ADMIN | Read, Update | Read, Update | Read, Update | ✓ All | Read, Update | Read | - |
| SCHOOL_NURSE | Read, Update | ✓ All | ✓ All | ✓ All | ✓ All | Read, Update | - |
| OFFICE_STAFF | Read | - | - | ✓ All | - | - | - |
| COUNSELOR | Read | - | Read | Read | Read | - | - |
| VIEWER | Read | - | Read | Read | - | - | - |

### Detailed Permission Breakdown

#### SUPER_ADMIN
```typescript
['*']  // All permissions
```

#### ADMIN
```typescript
[
  'students:*',
  'medications:*',
  'appointments:*',
  'health-records:*',
  'incidents:*',
  'inventory:*',
  'communications:*',
  'emergency-contacts:*',
  'compliance:read',
  'analytics:read',
  'audit:read',
  'users:*',
  'settings:*',
  'admin:read'
]
```

#### DISTRICT_ADMIN
```typescript
[
  'students:read',
  'students:update',
  'medications:read',
  'appointments:read',
  'health-records:read',
  'incidents:read',
  'inventory:read',
  'communications:read',
  'communications:create',
  'emergency-contacts:read',
  'compliance:read',
  'analytics:read',
  'audit:read',
  'users:read',
  'settings:read',
  'admin:read'
]
```

#### SCHOOL_NURSE
```typescript
[
  'students:read',
  'students:update',
  'medications:*',          // Full medication management
  'appointments:*',          // Full appointment management
  'health-records:*',        // Full health record access
  'incidents:*',             // Full incident management
  'inventory:read',
  'inventory:update',
  'communications:read',
  'communications:create',
  'emergency-contacts:read',
  'emergency-contacts:create'
]
```

#### OFFICE_STAFF
```typescript
[
  'students:read',
  'appointments:*',          // Full appointment scheduling
  'emergency-contacts:read',
  'communications:read'
]
```

#### COUNSELOR
```typescript
[
  'students:read',
  'appointments:read',
  'health-records:read',     // Limited for student support
  'incidents:read',
  'communications:read',
  'emergency-contacts:read'
]
```

#### VIEWER
```typescript
[
  'students:read',
  'appointments:read',
  'health-records:read',
  'communications:read'
]
```

### Route Permission Examples

| Route | Required Permission | Roles Allowed |
|-------|-------------------|---------------|
| `/students` | `students:read` | All roles |
| `/students/new` | `students:create` | SUPER_ADMIN, ADMIN |
| `/students/[id]/edit` | `students:update` | SUPER_ADMIN, ADMIN, DISTRICT_ADMIN, SCHOOL_ADMIN, SCHOOL_NURSE |
| `/medications` | `medications:read` | SUPER_ADMIN, ADMIN, DISTRICT_ADMIN, SCHOOL_ADMIN, SCHOOL_NURSE |
| `/medications/[id]/administer` | `medications:administer` | SUPER_ADMIN, ADMIN, SCHOOL_NURSE |
| `/admin` | `admin:read` | SUPER_ADMIN, ADMIN, DISTRICT_ADMIN |
| `/audit` | `audit:read` | SUPER_ADMIN, ADMIN, DISTRICT_ADMIN |

---

## Configuration

### Environment Variables

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-key-here-min-32-chars

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# CORS Configuration
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com

# Environment
NODE_ENV=production  # or development

# Session Configuration (optional)
SESSION_TIMEOUT_MS=900000        # 15 minutes (HIPAA compliant)
SESSION_WARNING_MS=120000        # 2 minutes before expiry
```

### Security Configuration

Located in `src/lib/security/config.ts`:

```typescript
// Rate Limiting
RATE_LIMIT_CONFIG = {
  general: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // 100 requests per window
  },
  auth: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,                     // 5 login attempts per window
  },
  phi: {
    windowMs: 60 * 1000,       // 1 minute
    max: 60,                    // 60 requests per minute
  },
}

// Session Configuration
SESSION_CONFIG = {
  idleTimeout: 15 * 60 * 1000,        // 15 minutes (HIPAA)
  warningTime: 2 * 60 * 1000,         // 2 minutes before expiry
  maxDuration: 24 * 60 * 60 * 1000,   // 24 hours
}
```

### Middleware Configuration

In `middleware.production.ts`:

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp)).*)',
  ],
};
```

---

## Testing

### Manual Testing Scenarios

#### 1. Authentication Tests

```bash
# Test: No token - should redirect to login
curl -v http://localhost:3000/students

# Test: Invalid token - should redirect to login
curl -v http://localhost:3000/students \
  -H "Authorization: Bearer invalid.token.here"

# Test: Expired token - should redirect to session-expired
curl -v http://localhost:3000/students \
  -H "Authorization: Bearer <expired-token>"

# Test: Valid token - should allow access
curl -v http://localhost:3000/students \
  -H "Authorization: Bearer <valid-token>"
```

#### 2. RBAC Tests

```bash
# Test: VIEWER accessing students (should allow)
curl -v http://localhost:3000/students \
  -H "Authorization: Bearer <viewer-token>"

# Test: VIEWER accessing /admin (should deny)
curl -v http://localhost:3000/admin \
  -H "Authorization: Bearer <viewer-token>"

# Test: SCHOOL_NURSE accessing medications (should allow)
curl -v http://localhost:3000/medications \
  -H "Authorization: Bearer <nurse-token>"

# Test: OFFICE_STAFF accessing medications (should deny)
curl -v http://localhost:3000/medications \
  -H "Authorization: Bearer <staff-token>"
```

#### 3. Rate Limit Tests

```bash
# Test: Exceed rate limit
for i in {1..101}; do
  curl -s http://localhost:3000/students \
    -H "Authorization: Bearer <token>"
done
# Should return 429 after 100 requests

# Test: Auth rate limit (stricter)
for i in {1..6}; do
  curl -s http://localhost:3000/api/auth/login \
    -X POST -d '{"email":"test@test.com","password":"wrong"}'
done
# Should return 429 after 5 attempts
```

#### 4. CSRF Tests

```bash
# Test: POST without CSRF token (should fail)
curl -v http://localhost:3000/api/students \
  -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe"}'

# Test: POST with valid CSRF token (should succeed)
curl -v http://localhost:3000/api/students \
  -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <csrf-token>" \
  -b "csrf_token=<csrf-token>" \
  -d '{"name":"John Doe"}'
```

### Automated Testing

Create test file `src/__tests__/middleware.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals';
import { checkPermission, UserRole, Resource, Action } from '../middleware/rbac';

describe('RBAC Middleware', () => {
  it('should allow SUPER_ADMIN all permissions', () => {
    expect(checkPermission(UserRole.SUPER_ADMIN, 'students:delete')).toBe(true);
    expect(checkPermission(UserRole.SUPER_ADMIN, 'admin:update')).toBe(true);
  });

  it('should allow SCHOOL_NURSE medication management', () => {
    expect(checkPermission(UserRole.SCHOOL_NURSE, 'medications:create')).toBe(true);
    expect(checkPermission(UserRole.SCHOOL_NURSE, 'medications:administer')).toBe(true);
  });

  it('should deny VIEWER write operations', () => {
    expect(checkPermission(UserRole.VIEWER, 'students:create')).toBe(false);
    expect(checkPermission(UserRole.VIEWER, 'students:update')).toBe(false);
  });

  it('should deny OFFICE_STAFF medication access', () => {
    expect(checkPermission(UserRole.OFFICE_STAFF, 'medications:read')).toBe(false);
  });
});
```

---

## Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET` (min 32 characters)
- [ ] Configure `NEXT_PUBLIC_ALLOWED_ORIGINS` for CORS
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (Strict-Transport-Security header)
- [ ] Configure Redis for rate limiting (optional)
- [ ] Set up audit log backend endpoint
- [ ] Test all role permissions
- [ ] Verify CSRF protection
- [ ] Test rate limits
- [ ] Enable monitoring and alerting
- [ ] Review CSP headers for your domains
- [ ] Test session timeout behavior
- [ ] Verify PHI access logging

### Redis Integration (Optional)

For production with multiple instances, use Redis for rate limiting:

```typescript
// src/middleware/rateLimit.ts
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

// Use Redis for rate limit storage instead of Map
```

### Monitoring

Add monitoring for:
- Failed authentication attempts
- Rate limit hits
- RBAC denials
- Slow middleware execution (>100ms)
- CSRF validation failures
- Audit log transmission failures

---

## Troubleshooting

### Common Issues

#### 1. Infinite Redirect Loop

**Symptom**: Browser keeps redirecting to `/login`

**Causes**:
- Token not being sent in requests
- Token expired but not refreshed
- `/login` route not marked as public

**Solution**:
```typescript
// Check PUBLIC_ROUTES includes all auth pages
export const PUBLIC_ROUTES = [
  '/login',
  '/session-expired',
  '/access-denied',
];
```

#### 2. CORS Errors

**Symptom**: `Access-Control-Allow-Origin` errors

**Causes**:
- Origin not in `NEXT_PUBLIC_ALLOWED_ORIGINS`
- Credentials not included in request

**Solution**:
```bash
# Add origin to .env
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com
```

#### 3. Rate Limit False Positives

**Symptom**: Users getting rate limited too quickly

**Causes**:
- Shared IP addresses (office network, VPN)
- Rate limit window too restrictive

**Solution**:
```typescript
// Adjust rate limit config
RATE_LIMIT_CONFIG.general.max = 200; // Increase limit
RATE_LIMIT_CONFIG.general.windowMs = 60 * 60 * 1000; // 1 hour window
```

#### 4. RBAC Permission Denied

**Symptom**: Users with correct role denied access

**Causes**:
- Route not mapped in `ROUTE_PERMISSIONS`
- Incorrect permission format

**Solution**:
```typescript
// Add route permission
ROUTE_PERMISSIONS['/my-route'] = {
  resource: Resource.MY_RESOURCE,
  action: Action.READ
};

// Add role permission
ROLE_PERMISSIONS[UserRole.MY_ROLE].push('my-resource:read');
```

#### 5. Slow Middleware Performance

**Symptom**: Requests taking >100ms in middleware

**Causes**:
- Too many regex operations
- Inefficient permission checks
- Network calls in middleware

**Solution**:
- Cache route permission lookups
- Use exact matches before regex
- Move network calls to API routes

### Debug Mode

Enable detailed logging:

```typescript
// In middleware.production.ts
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('[DEBUG] Request:', {
    pathname,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
  });
}
```

### Performance Monitoring

Track middleware execution time:

```typescript
const processingTime = Date.now() - startTime;
if (processingTime > 100) {
  console.warn(`[MIDDLEWARE] Slow request: ${pathname} took ${processingTime}ms`);
}
```

---

## Security Best Practices

1. **JWT Secrets**: Use strong, random secrets (min 32 characters)
2. **Token Expiration**: Set appropriate expiration times (15-60 minutes)
3. **HTTPS Only**: Always use HTTPS in production
4. **Rate Limiting**: Adjust based on your traffic patterns
5. **Audit Logs**: Store securely for 7 years (HIPAA requirement)
6. **CSP Headers**: Keep strict and test thoroughly
7. **CSRF Tokens**: Rotate on each session
8. **Error Messages**: Don't leak sensitive information
9. **Monitoring**: Set up alerts for security events
10. **Regular Updates**: Keep dependencies updated

---

## Additional Resources

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## Version History

- **v1.0.0** (2025-10-26) - Initial production release
  - Complete RBAC implementation
  - HIPAA-compliant audit logging
  - Comprehensive security headers
  - Rate limiting
  - CSRF protection
  - Request sanitization

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review audit logs for security events
3. Enable debug mode for detailed logging
4. Contact security team for HIPAA compliance questions
