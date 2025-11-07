# ADR: Error Handling and Logging Standards

## Status
**ACCEPTED** - 2025-11-07

## Context

The White Cross platform previously had multiple error handling systems:
- `/errors/ServiceError.ts` - Legacy service errors
- `/shared/errors/ServiceErrors.ts` - Retry-enabled service errors
- Ad-hoc error throwing throughout codebase
- Inconsistent error response formats
- Missing request correlation
- Limited error tracking

This led to:
- Inconsistent error messages for clients
- Difficulty debugging production issues
- Poor error tracking and monitoring
- No standardized retry logic
- HIPAA compliance concerns with error exposure
- Missing request correlation across distributed systems

## Decision

We will consolidate all error handling into a single, modern system located at `/common/exceptions/` with the following components:

### 1. Exception Hierarchy

```
HttpException (NestJS)
├── BusinessException - Business logic violations
├── ValidationException - Input validation failures
├── HealthcareException - Healthcare domain errors
└── RetryableException - Transient errors
    ├── DatabaseException
    ├── TimeoutException
    └── ExternalServiceException
```

### 2. Standardized Error Codes

All errors use standardized codes from `/common/exceptions/constants/error-codes.ts`:

- **AUTH_xxx**: Authentication errors
- **AUTHZ_xxx**: Authorization errors
- **VALID_xxx**: Validation errors
- **BUSINESS_xxx**: Business logic errors
- **HEALTH_xxx**: Healthcare domain errors
- **SECURITY_xxx**: Security violations
- **SYSTEM_xxx**: System/infrastructure errors
- **COMPLY_xxx**: Compliance violations

### 3. Error Response Format

All API errors return this consistent structure:

```json
{
  "success": false,
  "timestamp": "2025-11-07T12:00:00.000Z",
  "path": "/api/students/123",
  "method": "GET",
  "statusCode": 404,
  "error": "Business Logic Error",
  "message": "Student with identifier '123' not found",
  "errorCode": "BUSINESS_001",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "details": {...}, // Only in development
  "stack": "..." // Only in development
}
```

### 4. Global Error Handlers

Implemented in `main.ts`:

#### Unhandled Rejection Handler
```typescript
process.on('unhandledRejection', (reason, promise) => {
  // Log with structured format
  // Report to Sentry
  // Graceful shutdown in production
});
```

#### Uncaught Exception Handler
```typescript
process.on('uncaughtException', (error) => {
  // Log with structured format
  // Report to Sentry
  // Immediate graceful shutdown (process state unreliable)
});
```

#### Graceful Shutdown
```typescript
process.on('SIGTERM', () => gracefulShutdown());
process.on('SIGINT', () => gracefulShutdown());
```

Graceful shutdown:
- Stops accepting new connections
- Waits for ongoing requests to complete (10s timeout)
- Closes database connections
- Flushes logs
- Exits with appropriate code

### 5. Request ID Propagation

Use `AsyncLocalStorage` for automatic request ID propagation:

```typescript
// Middleware generates/extracts request ID
// Stores in AsyncLocalStorage
// Available throughout request lifecycle
const requestId = getRequestId();
```

Request IDs are:
- Generated or extracted from headers (X-Request-ID, X-Correlation-ID, X-Trace-ID)
- Added to all log statements
- Included in all error responses
- Returned in response headers
- Sent to Sentry for correlation

### 6. Logging Standards

#### Required: LoggerService
```typescript
import { LoggerService } from '@/shared/logging/logger.service';

const logger = new LoggerService();
logger.setContext('ClassName');

logger.log('message', { key: 'value' });
logger.error('error message', error);
logger.warn('warning message');
logger.debug('debug info');
logger.verbose('verbose info');

// Structured logging with metadata
logger.logWithMetadata('error', 'Database error', {
  operation: 'query',
  table: 'users',
  requestId: getRequestId(),
  userId: getCurrentUserId()
});
```

#### Forbidden: console.log
- Enforced by ESLint rules
- Only `console.warn` and `console.error` allowed in exceptional cases
- All logging must go through LoggerService

### 7. Retry Semantics

Exceptions include `isRetryable` flag:

```typescript
try {
  await operation();
} catch (error) {
  if (isRetryable(error)) {
    // Retry with exponential backoff
    await retry(operation);
  } else {
    // Don't retry, handle error
    throw error;
  }
}
```

Retryable errors:
- DatabaseException (connection, timeout, lock errors)
- TimeoutException
- ExternalServiceException (5xx errors)

Non-retryable errors:
- ValidationException
- BusinessException
- UnauthorizedException
- ForbiddenException

### 8. Sentry Integration

All critical errors (5xx) are automatically reported to Sentry with:
- Error details and stack trace
- Request context (user, org, request ID)
- Tags (error code, category, path)
- Custom metadata
- Severity level

### 9. HIPAA Compliance

Error responses:
- Never expose PHI in error messages
- Sanitize database constraint errors
- Generic messages in production
- Detailed messages only in development
- All errors logged for audit trail

### 10. Exception Filters

#### AllExceptionsFilter (Global)
- Catches all unhandled exceptions
- Generates standardized error response
- Logs with structured format
- Reports to Sentry for critical errors
- Handles known error types (Sequelize, validation, etc.)

#### HttpExceptionFilter
- Handles NestJS HTTP exceptions
- Transforms to standard format
- Adds request correlation

## Consequences

### Positive
- **Consistency**: All errors follow same structure
- **Debuggability**: Request IDs enable end-to-end tracing
- **Monitoring**: Automatic Sentry integration for critical errors
- **Reliability**: Graceful shutdown prevents data loss
- **Type Safety**: TypeScript types for all exceptions
- **Retry Logic**: Built-in retry semantics for transient errors
- **HIPAA Compliance**: No PHI exposure in errors
- **Developer Experience**: Clear migration path and ESLint enforcement

### Negative
- **Migration Effort**: Must update all existing error handling
- **Learning Curve**: Team must learn new patterns
- **Breaking Changes**: Error responses may change format

### Neutral
- **Code Size**: Slightly more code for error handling
- **Dependencies**: No new external dependencies required

## Implementation

### Priority 1: Critical (COMPLETED)
- [x] Consolidate error systems in `/common/exceptions/`
- [x] Add retry semantics to modern system
- [x] Mark legacy systems as deprecated
- [x] Add global error handlers (unhandledRejection, uncaughtException)
- [x] Integrate Sentry for critical errors
- [x] Implement graceful shutdown

### Priority 2: High (COMPLETED)
- [x] Create request ID middleware with AsyncLocalStorage
- [x] Standardize error response format
- [x] Replace console.log with LoggerService in main.ts
- [x] Add ESLint rules to prevent console.log
- [x] Create migration guide

### Priority 3: Medium (PENDING)
- [ ] Migrate Discovery module to new error format
- [ ] Migrate WebSocket error handling
- [ ] Add retry helpers for common patterns
- [ ] Update all services to use new exceptions
- [ ] Add error response documentation to Swagger

### Priority 4: Low (PENDING)
- [ ] Add custom error pages for web UI
- [ ] Create error analytics dashboard
- [ ] Add error rate alerts
- [ ] Performance testing for error handling overhead

## Validation

### Success Metrics
- 100% of errors use standard format
- 0 console.log statements in production code
- All 5xx errors reported to Sentry
- Request IDs in 100% of error logs
- No PHI exposed in error responses

### Testing
- Unit tests for all exception classes
- Integration tests for exception filters
- E2E tests for error response format
- Load tests for error handling performance
- Chaos engineering for uncaught errors

### Monitoring
- Error rate by status code
- Error rate by error code
- Sentry event volume
- Request ID correlation rate
- Graceful shutdown success rate

## References

- [Migration Guide](../ERROR_HANDLING_MIGRATION_GUIDE.md)
- [Error Codes](../../src/common/exceptions/constants/error-codes.ts)
- [Exception Classes](../../src/common/exceptions/exceptions/)
- [Request Context Middleware](../../src/common/middleware/request-context.middleware.ts)
- [Global Error Handlers](../../src/main.ts)

## Related ADRs
- [Configuration Management](./CONFIGURATION_MANAGEMENT.md)
- [Logging Strategy](./LOGGING_STRATEGY.md)
- [HIPAA Compliance](./HIPAA_COMPLIANCE.md)

## Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2025-11-07 | 1.0 | System | Initial version - Priority 1 & 2 implemented |
