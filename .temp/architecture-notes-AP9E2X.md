# Architecture Notes - API Error Handlers

**Task ID:** AP9E2X
**Agent:** API Architect
**Date:** 2025-10-31

## References to Other Agent Work
- **E2E9C7**: E2E encryption integration for messaging
- **M7B2K9**: Previous architectural implementations
- **WS8M3G**: Recent completion work

## API Error Handling Architecture

### Current System Analysis

**Existing Error Handling Patterns:**
1. Try-catch blocks in each route handler
2. Error format: `{ error: 'message' }` with HTTP status codes
3. Comprehensive HIPAA-compliant audit logging
4. Middleware wrappers: withAuth, withRateLimit
5. API proxy with timeout and error handling

**Error Response Format Standard:**
```typescript
// Success Response
{
  data: any,
  status: 200 | 201 | 204
}

// Error Response
{
  error: string,        // Error type/category
  message?: string,     // Human-readable message
  details?: any,        // Additional error details
  status: 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 503 | 504
}
```

**HTTP Status Codes Used:**
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 422: Unprocessable Entity (validation failed)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error
- 503: Service Unavailable (backend down)
- 504: Gateway Timeout

### Error Handler Design

**Next.js Error Boundaries for API Routes:**

Error handlers will be created at strategic levels:
1. `/api/error.ts` - Root API error handler
2. `/api/auth/error.ts` - Authentication errors
3. `/api/medications/error.ts` - Medication-specific errors
4. `/api/appointments/error.ts` - Appointment errors
5. `/api/incidents/error.ts` - Incident reporting errors

**Error Classification:**
- **Authentication Errors**: 401, 403, token expiration, rate limiting
- **Validation Errors**: 400, 422, malformed input
- **Resource Errors**: 404, 409, resource not found or conflicts
- **Server Errors**: 500, 503, 504, backend failures
- **PHI Access Errors**: Special handling for HIPAA compliance

**Error Logging Strategy:**
- Console logging in development with full stack traces
- Structured logging in production
- HIPAA-compliant audit logging for failed operations
- No PHI exposure in error messages or logs
- Error digest/correlation IDs for debugging

### HIPAA Compliance

**Requirements:**
1. No Protected Health Information (PHI) in error messages
2. All failed PHI access attempts must be audit logged
3. Error logs must not contain sensitive patient data
4. Failed authentication attempts must be tracked
5. Error responses must not leak system internals

**Safe Error Messages:**
- ✅ "Invalid credentials"
- ✅ "Resource not found"
- ✅ "Permission denied"
- ❌ "Student John Doe's record not found"
- ❌ "Invalid medication dosage for patient ID 12345"

### Integration with Existing Systems

**Audit Logging Integration:**
```typescript
// Failed operation logging
await auditLog({
  userId: auth?.user.id,
  action: 'OPERATION_FAILED',
  resource: 'ResourceType',
  resourceId: id,
  success: false,
  errorMessage: 'Sanitized error message',
  ipAddress: extractIPAddress(request),
  userAgent: extractUserAgent(request)
});
```

**API Proxy Error Handling:**
- Timeout errors: 504 Gateway Timeout
- Connection errors: 503 Service Unavailable
- Backend errors: Pass through with logging

### Error Handler Features

**Each error.ts will include:**
1. Error type detection and classification
2. Appropriate HTTP status code mapping
3. HIPAA-compliant error messages
4. Audit logging for security-sensitive errors
5. Error correlation IDs for debugging
6. Development vs. production error detail levels
7. Error recovery suggestions where appropriate

**Error Context Tracking:**
- Request method and path
- User ID (if authenticated)
- IP address and user agent
- Timestamp
- Error type and category
- Stack trace (development only)

### Performance Considerations

**Error Handling Performance:**
- Fast-path for common errors (401, 404)
- Async audit logging (non-blocking)
- Minimal error processing overhead
- Cached error response templates

### Security Considerations

**Error Security:**
- No stack traces in production responses
- No system internals exposed
- Rate limit on error responses (prevent enumeration)
- Sanitized error messages
- Secure audit logging
