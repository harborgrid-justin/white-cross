# Next.js API Routes Documentation

## Overview

This document provides comprehensive documentation for the Next.js 15 API routes implementation that integrates with the existing Hapi.js backend. All routes implement proper authentication, HIPAA-compliant audit logging, caching, and rate limiting.

## Architecture

### Design Principles

1. **Backend Proxy Pattern**: All routes proxy to the Hapi.js backend - no business logic duplication
2. **Authentication First**: JWT-based authentication with role-based access control
3. **HIPAA Compliance**: Comprehensive audit logging for all PHI access
4. **Performance**: Strategic caching with Next.js revalidation
5. **Security**: Rate limiting, input validation, and secure headers

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: JWT with jsonwebtoken
- **Caching**: Next.js ISR (Incremental Static Regeneration)
- **Rate Limiting**: In-memory store (upgradable to Redis)
- **Audit Logging**: HIPAA-compliant centralized logging

---

## Library Files

### Authentication Library (`src/lib/auth.ts`)

Provides JWT validation and user authentication utilities.

**Key Functions:**
- `extractToken(request)` - Extract JWT from Authorization header
- `verifyAccessToken(token)` - Verify and decode access token
- `verifyRefreshToken(token)` - Verify and decode refresh token
- `authenticateRequest(request)` - Authenticate request and return user
- `hasRole(user, role)` - Check if user has specific role
- `hasMinimumRole(user, role)` - Check if user meets minimum role level

**Role Hierarchy:**
```
SUPER_ADMIN (100) > ADMIN (90) > SCHOOL_ADMIN (80) > NURSE (70) >
COUNSELOR (60) > VIEWER (50) > PARENT (40) > STUDENT (30)
```

### Audit Logging Library (`src/lib/audit.ts`)

HIPAA-compliant audit logging for all PHI access and system events.

**Key Functions:**
- `auditLog(entry)` - Log general audit event
- `logPHIAccess(entry)` - Log PHI access (HIPAA critical)
- `extractIPAddress(request)` - Extract client IP
- `extractUserAgent(request)` - Extract user agent
- `createAuditContext(request, userId)` - Create audit context from request

**PHI Actions:**
- `VIEW_PHI` - Viewing protected health information
- `CREATE_PHI` - Creating new PHI records
- `UPDATE_PHI` - Updating existing PHI records
- `DELETE_PHI` - Deleting PHI records
- `EXPORT_PHI` - Exporting PHI data
- `PRINT_PHI` - Printing PHI documents

**Audit Actions:**
- Authentication: `LOGIN`, `LOGOUT`, `LOGIN_FAILED`, `TOKEN_REFRESH`, `PASSWORD_CHANGE`
- Students: `VIEW_STUDENT`, `CREATE_STUDENT`, `UPDATE_STUDENT`, `DELETE_STUDENT`, `LIST_STUDENTS`
- Health Records: `VIEW_HEALTH_RECORD`, `CREATE_HEALTH_RECORD`, `UPDATE_HEALTH_RECORD`, `DELETE_HEALTH_RECORD`
- Medications: `VIEW_MEDICATION`, `CREATE_MEDICATION`, `UPDATE_MEDICATION`, `DELETE_MEDICATION`, `ADMINISTER_MEDICATION`
- Incidents: `VIEW_INCIDENT`, `CREATE_INCIDENT`, `UPDATE_INCIDENT`, `DELETE_INCIDENT`
- Documents: `VIEW_DOCUMENT`, `UPLOAD_DOCUMENT`, `DOWNLOAD_DOCUMENT`, `DELETE_DOCUMENT`
- Reports: `GENERATE_REPORT`, `EXPORT_DATA`

### Rate Limiting Library (`src/lib/rateLimit.ts`)

Protects API endpoints from abuse and DDoS attacks.

**Key Functions:**
- `checkRateLimit(request, config)` - Check if request exceeds rate limit
- `cleanupRateLimits()` - Clean up expired rate limit entries

**Default Rate Limits:**
- `AUTH`: 5 requests per 15 minutes (strict for login/auth)
- `API`: 100 requests per minute (standard API endpoints)
- `READ`: 200 requests per minute (read-only endpoints)
- `EXPENSIVE`: 10 requests per minute (complex operations)

### API Proxy Library (`src/lib/apiProxy.ts`)

Handles request forwarding to the Hapi.js backend.

**Key Functions:**
- `proxyToBackend(request, path, config)` - Proxy request to backend
- `createProxyHandler(basePath, config)` - Create reusable proxy handler

**Configuration Options:**
- `forwardAuth` - Whether to forward authentication headers (default: true)
- `headers` - Custom headers to add
- `cache.revalidate` - Cache duration in seconds
- `cache.tags` - Cache tags for revalidation
- `timeout` - Request timeout in milliseconds (default: 30000)

---

## Middleware

### `withAuth` (`src/app/api/middleware/withAuth.ts`)

Wraps route handlers with JWT authentication.

**Usage:**
```typescript
export const GET = withAuth(async (request, context, auth) => {
  // auth.user contains authenticated user
  console.log(auth.user.id, auth.user.email, auth.user.role);
  // ... route logic
});
```

### `withRole` (`src/app/api/middleware/withAuth.ts`)

Requires specific role(s) for access.

**Usage:**
```typescript
export const POST = withRole('ADMIN', async (request, context, auth) => {
  // Only ADMIN role can access
});

export const POST = withRole(['ADMIN', 'NURSE'], async (request, context, auth) => {
  // ADMIN or NURSE can access
});
```

### `withMinimumRole` (`src/app/api/middleware/withAuth.ts`)

Requires minimum role level for access.

**Usage:**
```typescript
export const POST = withMinimumRole('NURSE', async (request, context, auth) => {
  // NURSE, SCHOOL_ADMIN, ADMIN, or SUPER_ADMIN can access
});
```

### `withRateLimit` (`src/app/api/middleware/withRateLimit.ts`)

Applies rate limiting to route handler.

**Usage:**
```typescript
import { RATE_LIMITS } from '@/lib/rateLimit';

export const POST = withRateLimit(RATE_LIMITS.AUTH, async (request, context) => {
  // Rate limited to 5 requests per 15 minutes
});
```

---

## API Routes

### Authentication Routes

#### `POST /api/auth/login`
Authenticate user credentials and return JWT token.

**Rate Limit**: 5 requests per 15 minutes
**Authentication**: None (public endpoint)
**Audit Log**: Logs login attempts (success and failure)

**Request:**
```json
{
  "email": "nurse@school.edu",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "nurse@school.edu",
      "firstName": "Jane",
      "lastName": "Smith",
      "role": "NURSE"
    }
  }
}
```

#### `POST /api/auth/logout`
Logout user and invalidate session.

**Authentication**: Required
**Audit Log**: Logs logout event

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### `GET|POST /api/auth/verify`
Verify JWT token validity.

**Authentication**: Token validated from Authorization header
**Audit Log**: No

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "nurse@school.edu",
    "role": "NURSE"
  }
}
```

#### `POST /api/auth/refresh`
Refresh access token using refresh token.

**Authentication**: Refresh token required
**Audit Log**: Logs token refresh

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "user": { ... }
  }
}
```

---

### Students Routes

#### `GET /api/v1/students`
List all students with filtering and pagination.

**Authentication**: Required
**Cache**: 60 seconds, tags: `['students']`
**Audit Log**: PHI access logged
**HIPAA**: Critical - logs all PHI viewing

**Query Parameters:**
- `page` - Page number
- `limit` - Results per page
- `search` - Search query
- `grade` - Filter by grade

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "2010-05-15",
      "grade": "5th",
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

#### `POST /api/v1/students`
Create new student record.

**Authentication**: Required
**Audit Log**: PHI creation logged
**Cache Invalidation**: Revalidates `['students']`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2010-05-15",
  "grade": "5th",
  "gender": "M"
}
```

#### `GET /api/v1/students/:id`
Get student by ID.

**Authentication**: Required
**Cache**: 60 seconds, tags: `['student-{id}', 'students']`
**Audit Log**: PHI access logged

#### `PUT /api/v1/students/:id`
Update student record.

**Authentication**: Required
**Audit Log**: PHI update logged
**Cache Invalidation**: Revalidates `['students', 'student-{id}']`

#### `DELETE /api/v1/students/:id`
Delete student record.

**Authentication**: Required
**Audit Log**: PHI deletion logged
**Cache Invalidation**: Revalidates `['students', 'student-{id}']`

#### `GET /api/v1/students/:id/health-records`
Get all health records for a student.

**Authentication**: Required
**Cache**: 30 seconds, tags: `['student-{id}-health-records', 'student-{id}', 'health-records']`
**Audit Log**: PHI access logged
**HIPAA**: Critical - highly sensitive data

---

### Medications Routes

#### `GET /api/v1/medications`
List all medications.

**Authentication**: Required
**Cache**: 30 seconds, tags: `['medications']`
**Audit Log**: PHI access logged

#### `POST /api/v1/medications`
Create new medication record.

**Authentication**: Required
**Audit Log**: PHI creation logged
**Cache Invalidation**: Revalidates `['medications']`

#### `GET /api/v1/medications/:id`
Get medication by ID.

**Authentication**: Required
**Cache**: 30 seconds, tags: `['medication-{id}', 'medications']`
**Audit Log**: PHI access logged

#### `PUT /api/v1/medications/:id`
Update medication record.

**Authentication**: Required
**Audit Log**: PHI update logged
**Cache Invalidation**: Revalidates `['medications', 'medication-{id}']`

#### `DELETE /api/v1/medications/:id`
Delete medication record.

**Authentication**: Required
**Audit Log**: PHI deletion logged
**Cache Invalidation**: Revalidates `['medications', 'medication-{id}']`

#### `POST /api/v1/medications/:id/administer`
Record medication administration.

**Authentication**: Required
**Audit Log**: Medication administration logged (critical event)
**Cache Invalidation**: Revalidates `['medications', 'medication-{id}']`
**HIPAA**: Critical - medication administration is a high-risk event

---

### Health Records Routes

#### `GET /api/v1/health-records`
List all health records.

**Authentication**: Required
**Cache**: 30 seconds, tags: `['health-records']`
**Audit Log**: PHI access logged
**HIPAA**: Critical - highly sensitive data

#### `POST /api/v1/health-records`
Create new health record.

**Authentication**: Required
**Audit Log**: PHI creation logged
**Cache Invalidation**: Revalidates `['health-records', 'student-{studentId}-health-records', 'student-{studentId}']`

#### `GET /api/v1/health-records/:id`
Get health record by ID.

**Authentication**: Required
**Cache**: 30 seconds, tags: `['health-record-{id}', 'health-records']`
**Audit Log**: PHI access logged

#### `PUT /api/v1/health-records/:id`
Update health record.

**Authentication**: Required
**Audit Log**: PHI update logged
**Cache Invalidation**: Revalidates `['health-records', 'health-record-{id}', 'student-{studentId}-health-records']`

#### `DELETE /api/v1/health-records/:id`
Delete health record.

**Authentication**: Required
**Audit Log**: PHI deletion logged
**Cache Invalidation**: Revalidates `['health-records', 'health-record-{id}']`

---

### Incidents Routes

#### `GET /api/v1/incidents`
List all incident reports.

**Authentication**: Required
**Cache**: 60 seconds, tags: `['incidents']`
**Audit Log**: Incident viewing logged

#### `POST /api/v1/incidents`
Create new incident report.

**Authentication**: Required
**Audit Log**: Incident creation logged
**Cache Invalidation**: Revalidates `['incidents']`

#### `GET /api/v1/incidents/:id`
Get incident by ID.

**Authentication**: Required
**Cache**: 60 seconds, tags: `['incident-{id}', 'incidents']`
**Audit Log**: Incident viewing logged

#### `PUT /api/v1/incidents/:id`
Update incident report.

**Authentication**: Required
**Audit Log**: Incident update logged
**Cache Invalidation**: Revalidates `['incidents', 'incident-{id}']`

#### `DELETE /api/v1/incidents/:id`
Delete incident report.

**Authentication**: Required
**Audit Log**: Incident deletion logged
**Cache Invalidation**: Revalidates `['incidents', 'incident-{id}']`

---

### Appointments Routes

#### `GET /api/v1/appointments`
List all appointments.

**Authentication**: Required
**Cache**: 30 seconds, tags: `['appointments']`

#### `POST /api/v1/appointments`
Create new appointment.

**Authentication**: Required
**Audit Log**: Appointment creation logged
**Cache Invalidation**: Revalidates `['appointments']`

#### `GET /api/v1/appointments/:id`
Get appointment by ID.

**Authentication**: Required
**Cache**: 30 seconds, tags: `['appointment-{id}', 'appointments']`

#### `PUT /api/v1/appointments/:id`
Update appointment.

**Authentication**: Required
**Audit Log**: Appointment update logged
**Cache Invalidation**: Revalidates `['appointments', 'appointment-{id}']`

#### `DELETE /api/v1/appointments/:id`
Delete appointment.

**Authentication**: Required
**Audit Log**: Appointment deletion logged
**Cache Invalidation**: Revalidates `['appointments', 'appointment-{id}']`

---

### Communications Routes

#### `GET /api/v1/communications/messages`
List all messages.

**Authentication**: Required
**Cache**: 10 seconds, tags: `['messages']` (short cache for real-time messaging)

#### `POST /api/v1/communications/messages`
Send new message.

**Authentication**: Required
**Audit Log**: Message sending logged
**Cache Invalidation**: Revalidates `['messages']`

#### `GET /api/v1/communications/broadcasts`
List all broadcast messages.

**Authentication**: Required
**Cache**: 60 seconds, tags: `['broadcasts']`

#### `POST /api/v1/communications/broadcasts`
Send new broadcast message.

**Authentication**: Required (minimum role: NURSE)
**Audit Log**: Broadcast sending logged
**Cache Invalidation**: Revalidates `['broadcasts']`

---

### Compliance Routes

#### `GET /api/v1/compliance/audit-logs`
Retrieve audit logs for compliance.

**Authentication**: Required (minimum role: ADMIN)
**Cache**: None (0 seconds) - audit logs must be real-time
**HIPAA**: Critical - audit logs are regulatory requirement

#### `GET /api/v1/compliance/reports`
List compliance reports.

**Authentication**: Required (minimum role: ADMIN)
**Cache**: 300 seconds (5 minutes), tags: `['compliance-reports']`

#### `POST /api/v1/compliance/reports`
Generate new compliance report.

**Authentication**: Required (minimum role: ADMIN)
**Audit Log**: Report generation logged

---

### Analytics Routes

#### `GET /api/v1/analytics/metrics`
Get health metrics and analytics data.

**Authentication**: Required
**Cache**: 300 seconds (5 minutes), tags: `['analytics-metrics']`

---

### GraphQL Endpoint

#### `POST /api/graphql`
Execute GraphQL query or mutation.

**Authentication**: Required
**Timeout**: 60 seconds (for complex queries)
**Proxy**: Forwards to backend `/graphql` endpoint

**Request:**
```json
{
  "query": "query GetStudents { students { id firstName lastName } }",
  "variables": {}
}
```

**Response:**
```json
{
  "data": {
    "students": [
      { "id": "uuid", "firstName": "John", "lastName": "Doe" }
    ]
  }
}
```

#### `GET /api/graphql`
GraphQL introspection (development only).

**Authentication**: Required
**Environment**: Development only (returns 405 in production)

---

### File Upload Endpoint

#### `POST /api/upload`
Upload file with validation and security.

**Authentication**: Required
**Audit Log**: File upload logged
**Rate Limit**: Standard API rate limit

**Request:** `multipart/form-data`
- `file` - File to upload (required)
- `category` - Upload category (optional, default: 'general')

**Allowed File Types:**
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV

**Maximum File Size:** 10MB

**Response (201):**
```json
{
  "success": true,
  "data": {
    "filename": "1234567890-abc123.pdf",
    "originalName": "document.pdf",
    "size": 524288,
    "type": "application/pdf",
    "category": "documents",
    "url": "/uploads/documents/1234567890-abc123.pdf"
  }
}
```

#### `GET /api/upload`
Get upload configuration and limits.

**Authentication**: Required

**Response (200):**
```json
{
  "maxFileSize": 10485760,
  "maxFileSizeMB": 10,
  "allowedTypes": ["image/jpeg", "image/png", ...],
  "allowedExtensions": [".jpg", ".png", ...]
}
```

---

### Webhook Endpoints

#### `POST /api/webhooks/stripe`
Handle Stripe webhook events.

**Authentication**: Verified via Stripe signature
**Audit Log**: Webhook events logged

**Supported Events:**
- `payment_intent.succeeded` - Successful payment
- `payment_intent.payment_failed` - Failed payment
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription cancelled

---

## Caching Strategy

### Cache Durations

| Resource Type | Duration | Rationale |
|--------------|----------|-----------|
| Students | 60s | Moderate change frequency |
| Medications | 30s | Higher sensitivity, more frequent updates |
| Health Records | 30s | Highly sensitive PHI data |
| Incidents | 60s | Low change frequency |
| Appointments | 30s | Moderate change frequency, scheduling needs |
| Messages | 10s | Real-time communication |
| Broadcasts | 60s | Low change frequency |
| Audit Logs | 0s | Real-time compliance requirement |
| Compliance Reports | 300s | Low change frequency, expensive operations |
| Analytics Metrics | 300s | Expensive calculations |

### Cache Tags

Cache tags enable targeted revalidation:

- `students` - All students
- `student-{id}` - Specific student
- `student-{id}-health-records` - Student's health records
- `medications` - All medications
- `medication-{id}` - Specific medication
- `health-records` - All health records
- `health-record-{id}` - Specific health record
- `incidents` - All incidents
- `incident-{id}` - Specific incident
- `appointments` - All appointments
- `appointment-{id}` - Specific appointment
- `messages` - All messages
- `broadcasts` - All broadcasts
- `audit-logs` - Audit logs
- `compliance-reports` - Compliance reports
- `analytics-metrics` - Analytics metrics

### Revalidation

Cache is automatically revalidated on:
- CREATE operations - Invalidates list cache
- UPDATE operations - Invalidates list and detail cache
- DELETE operations - Invalidates list and detail cache

---

## Error Handling

### Standard Error Format

All errors follow consistent format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `405` - Method Not Allowed
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (semantic error)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable (backend down)
- `504` - Gateway Timeout (backend timeout)

### Rate Limit Headers

When rate limited (429), response includes:

```
Retry-After: 123
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-01-15T12:00:00.000Z
```

---

## Security

### Authentication Flow

1. Client sends credentials to `/api/auth/login`
2. Backend validates credentials
3. Backend generates JWT access token (15 min) and refresh token (7 days)
4. Client stores tokens securely
5. Client includes access token in Authorization header: `Bearer <token>`
6. Token validated on every request
7. Client uses refresh token to get new access token when expired

### HIPAA Compliance

All PHI access is logged with:
- User ID
- Action performed
- Resource accessed
- IP address
- User agent
- Timestamp
- Success/failure status

Audit logs cannot be modified or deleted and are stored permanently for compliance.

### Rate Limiting

Prevents abuse:
- **Authentication endpoints**: 5 requests per 15 minutes
- **Standard API endpoints**: 100 requests per minute
- **Read-only endpoints**: 200 requests per minute
- **Expensive operations**: 10 requests per minute

### File Upload Security

- MIME type validation
- File size limits (10MB)
- Unique filename generation
- Category-based storage
- Audit logging

---

## Environment Variables

Required environment variables:

```env
# Backend API URL
BACKEND_URL=http://localhost:3001

# JWT Secrets
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here

# Stripe (optional)
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

---

## Testing

### Manual Testing with cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nurse@school.edu","password":"TestPassword123!"}'
```

**Get Students (authenticated):**
```bash
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer <your-token>"
```

**Create Student:**
```bash
curl -X POST http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","dateOfBirth":"2010-05-15","grade":"5th"}'
```

---

## Complete API Route Summary

### Authentication (4 routes)
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET|POST /api/auth/verify` - Verify token
- `POST /api/auth/refresh` - Refresh token

### Students (5 routes)
- `GET /api/v1/students` - List students
- `POST /api/v1/students` - Create student
- `GET /api/v1/students/:id` - Get student
- `PUT /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student
- `GET /api/v1/students/:id/health-records` - Get student health records

### Medications (6 routes)
- `GET /api/v1/medications` - List medications
- `POST /api/v1/medications` - Create medication
- `GET /api/v1/medications/:id` - Get medication
- `PUT /api/v1/medications/:id` - Update medication
- `DELETE /api/v1/medications/:id` - Delete medication
- `POST /api/v1/medications/:id/administer` - Administer medication

### Health Records (5 routes)
- `GET /api/v1/health-records` - List health records
- `POST /api/v1/health-records` - Create health record
- `GET /api/v1/health-records/:id` - Get health record
- `PUT /api/v1/health-records/:id` - Update health record
- `DELETE /api/v1/health-records/:id` - Delete health record

### Incidents (5 routes)
- `GET /api/v1/incidents` - List incidents
- `POST /api/v1/incidents` - Create incident
- `GET /api/v1/incidents/:id` - Get incident
- `PUT /api/v1/incidents/:id` - Update incident
- `DELETE /api/v1/incidents/:id` - Delete incident

### Appointments (5 routes)
- `GET /api/v1/appointments` - List appointments
- `POST /api/v1/appointments` - Create appointment
- `GET /api/v1/appointments/:id` - Get appointment
- `PUT /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Delete appointment

### Communications (4 routes)
- `GET /api/v1/communications/messages` - List messages
- `POST /api/v1/communications/messages` - Send message
- `GET /api/v1/communications/broadcasts` - List broadcasts
- `POST /api/v1/communications/broadcasts` - Send broadcast

### Compliance (3 routes)
- `GET /api/v1/compliance/audit-logs` - Get audit logs (ADMIN only)
- `GET /api/v1/compliance/reports` - List reports (ADMIN only)
- `POST /api/v1/compliance/reports` - Generate report (ADMIN only)

### Analytics (1 route)
- `GET /api/v1/analytics/metrics` - Get metrics

### GraphQL (2 routes)
- `POST /api/graphql` - Execute GraphQL query
- `GET /api/graphql` - Introspection (dev only)

### File Upload (2 routes)
- `POST /api/upload` - Upload file
- `GET /api/upload` - Get upload config

### Webhooks (1 route)
- `POST /api/webhooks/stripe` - Stripe webhook

**Total: 43+ API routes**

---

## Migration Guide

### Migrating from Direct Backend Calls

**Before:**
```typescript
const response = await fetch('http://localhost:3001/api/v1/students', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**After:**
```typescript
const response = await fetch('/api/v1/students', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Benefits

1. **Unified Origin**: No CORS issues
2. **Caching**: Automatic ISR caching
3. **Security**: Backend URL not exposed
4. **Monitoring**: Centralized request logging
5. **Rate Limiting**: Built-in protection

---

## Performance Optimization

### Caching Best Practices

1. **Use appropriate cache durations** - Balance freshness vs performance
2. **Leverage cache tags** - Enable targeted revalidation
3. **Cache read-heavy endpoints** - Students, medications, health records
4. **Don't cache sensitive operations** - Audit logs, real-time data

### Rate Limiting Best Practices

1. **Strict limits on authentication** - Prevent brute force
2. **Relaxed limits on reads** - Allow dashboard loading
3. **Moderate limits on writes** - Prevent abuse
4. **Custom limits for expensive ops** - Report generation, exports

---

## Troubleshooting

### Common Issues

**401 Unauthorized:**
- Check JWT token is valid
- Verify Authorization header format: `Bearer <token>`
- Ensure JWT_SECRET matches backend

**429 Too Many Requests:**
- Wait for rate limit reset (check Retry-After header)
- Implement client-side rate limiting
- Consider batching requests

**503 Service Unavailable:**
- Backend service is down
- Check BACKEND_URL environment variable
- Verify backend is running on correct port

**504 Gateway Timeout:**
- Backend request took too long
- Increase timeout in proxy config
- Optimize backend query

---

## Future Enhancements

### Recommended Upgrades

1. **Redis for Rate Limiting** - Distributed rate limiting across instances
2. **Redis for Caching** - Shared cache across instances
3. **Request Queue** - Background job processing
4. **WebSocket Support** - Real-time notifications
5. **API Versioning** - Support v1 and v2 simultaneously
6. **OpenAPI Specification** - Auto-generated API docs
7. **Request Validation** - Zod schema validation
8. **Response Compression** - Gzip/Brotli compression

---

## Support

For issues or questions:
- Review error logs in console
- Check audit logs for debugging
- Verify environment variables
- Consult Hapi.js backend documentation

---

**Last Updated**: 2025-10-26
**Version**: 1.0.0
**Author**: API Architect Agent
