# Error Handling Migration Guide

## Overview

This guide helps you migrate from the legacy error handling systems to the modern `/common/exceptions/` system.

## Why Migrate?

The modern exception system provides:
- **Consistent error responses** across all modules
- **Retry semantics** for transient errors
- **Better type safety** with TypeScript
- **Standardized error codes** for client-side handling
- **Automatic Sentry integration** for error tracking
- **Request ID propagation** for error correlation
- **Structured logging** with Winston

## Deprecated Systems

The following error systems are **DEPRECATED** and should not be used in new code:

- `/src/errors/ServiceError.ts` - Legacy service errors
- `/src/shared/errors/ServiceErrors.ts` - Legacy retry-enabled errors

## Migration Paths

### 1. ServiceError → BusinessException or RetryableException

#### Before (DEPRECATED):
```typescript
import { ServiceError } from '@/errors/ServiceError';

throw new ServiceError('Operation failed', 400, 'OPERATION_FAILED');
```

#### After (MODERN):
```typescript
import { BusinessException, ErrorCodes } from '@/common/exceptions';

throw new BusinessException(
  'Operation failed',
  ErrorCodes.OPERATION_NOT_ALLOWED,
  { /* context */ }
);
```

### 2. NotFoundError → BusinessException.notFound()

#### Before (DEPRECATED):
```typescript
import { NotFoundError } from '@/errors/ServiceError';

throw new NotFoundError('Student not found');
```

#### After (MODERN):
```typescript
import { BusinessException } from '@/common/exceptions';

throw BusinessException.notFound('Student', studentId);
```

### 3. ConflictError → BusinessException.alreadyExists()

#### Before (DEPRECATED):
```typescript
import { ConflictError } from '@/errors/ServiceError';

throw new ConflictError('Student already exists');
```

#### After (MODERN):
```typescript
import { BusinessException } from '@/common/exceptions';

throw BusinessException.alreadyExists('Student', studentId);
```

### 4. ValidationError → ValidationException

#### Before (DEPRECATED):
```typescript
import { ValidationError } from '@/errors/ServiceError';

throw new ValidationError('Invalid input');
```

#### After (MODERN):
```typescript
import { ValidationException } from '@/common/exceptions';

throw new ValidationException('Invalid input', [
  { field: 'email', message: 'Invalid email format' }
]);
```

### 5. DatabaseError → DatabaseException

#### Before (DEPRECATED):
```typescript
import { DatabaseError } from '@/shared/errors/ServiceErrors';

throw new DatabaseError('query', error);
```

#### After (MODERN):
```typescript
import { DatabaseException } from '@/common/exceptions';

throw new DatabaseException('query', error, { table: 'users' });
```

### 6. TimeoutError → TimeoutException

#### Before (DEPRECATED):
```typescript
import { TimeoutError } from '@/shared/errors/ServiceErrors';

throw new TimeoutError('API call', 5000);
```

#### After (MODERN):
```typescript
import { TimeoutException } from '@/common/exceptions';

throw new TimeoutException('API call', 5000, { endpoint: '/api/users' });
```

### 7. Authentication/Authorization Errors → NestJS Built-in Exceptions

#### Before (DEPRECATED):
```typescript
import { AuthenticationError, AuthorizationError } from '@/errors/ServiceError';

throw new AuthenticationError('Invalid credentials');
throw new AuthorizationError('Insufficient permissions');
```

#### After (MODERN):
```typescript
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

throw new UnauthorizedException('Invalid credentials');
throw new ForbiddenException('Insufficient permissions');
```

## Using Retry Semantics

The modern system includes built-in retry semantics for transient errors:

```typescript
import { DatabaseException, TimeoutException, isRetryable } from '@/common/exceptions';

try {
  await someOperation();
} catch (error) {
  if (isRetryable(error)) {
    // Retry the operation
    await retryOperation();
  } else {
    // Don't retry, handle the error
    throw error;
  }
}
```

## Error Codes

Use standardized error codes from `/common/exceptions/constants/error-codes.ts`:

```typescript
import {
  ErrorCodes,
  AuthErrorCodes,
  ValidationErrorCodes,
  BusinessErrorCodes,
  HealthcareErrorCodes,
  SystemErrorCodes
} from '@/common/exceptions';

// Business logic errors
throw new BusinessException(
  'Cannot delete student with active appointments',
  ErrorCodes.DEPENDENCY_EXISTS,
  { studentId, activeAppointments: 3 }
);

// Healthcare domain errors
throw new HealthcareException(
  'Drug interaction detected',
  ErrorCodes.DRUG_INTERACTION_DETECTED,
  { medications: ['Drug A', 'Drug B'] }
);
```

## Request Context

Use the new request context middleware for automatic request ID propagation:

```typescript
import { getRequestId, getRequestContext } from '@/common/middleware/request-context.middleware';

// Access request ID anywhere in the request lifecycle
const requestId = getRequestId();
logger.log('Processing request', { requestId });

// Access full context
const context = getRequestContext();
logger.log('User action', {
  requestId: context.requestId,
  userId: context.userId,
  organizationId: context.organizationId
});
```

## Logging

Replace `console.log` with `LoggerService`:

#### Before (NOT ALLOWED):
```typescript
console.log('User created', user);
console.error('Error occurred', error);
```

#### After (REQUIRED):
```typescript
import { LoggerService } from '@/shared/logging/logger.service';

const logger = new LoggerService();
logger.setContext('UserService');

logger.log('User created', { userId: user.id });
logger.error('Error occurred', error);
logger.logWithMetadata('error', 'Database error', {
  operation: 'createUser',
  error: error.message,
  requestId: getRequestId()
});
```

## Exception Filters

The modern system includes two exception filters:

### 1. HttpExceptionFilter
Handles all HTTP exceptions (400-499 errors)

### 2. AllExceptionsFilter
Handles all unhandled exceptions (500+ errors) with:
- Automatic Sentry reporting
- Structured logging
- Request correlation
- HIPAA-compliant error messages

Both filters are automatically applied globally via `app.module.ts`.

## Migration Checklist

- [ ] Replace all `ServiceError` imports with `BusinessException` or `RetryableException`
- [ ] Replace all `NotFoundError` with `BusinessException.notFound()`
- [ ] Replace all `ConflictError` with `BusinessException.alreadyExists()`
- [ ] Replace all `ValidationError` with `ValidationException`
- [ ] Replace all `DatabaseError` with `DatabaseException`
- [ ] Replace all `TimeoutError` with `TimeoutException`
- [ ] Replace all `AuthenticationError` with `UnauthorizedException`
- [ ] Replace all `AuthorizationError` with `ForbiddenException`
- [ ] Use standardized error codes from `ErrorCodes`
- [ ] Replace all `console.log` with `LoggerService`
- [ ] Add request context where needed
- [ ] Test error responses match expected format
- [ ] Verify Sentry error tracking works

## Testing Error Handling

```typescript
import { BusinessException, ErrorCodes } from '@/common/exceptions';

describe('UserService', () => {
  it('should throw BusinessException for duplicate user', async () => {
    await expect(service.createUser(duplicateEmail))
      .rejects
      .toThrow(BusinessException);
  });

  it('should include correct error code', async () => {
    try {
      await service.createUser(duplicateEmail);
    } catch (error) {
      expect(error.errorCode).toBe(ErrorCodes.RESOURCE_ALREADY_EXISTS);
    }
  });

  it('should include context', async () => {
    try {
      await service.createUser(duplicateEmail);
    } catch (error) {
      expect(error.context).toHaveProperty('email');
    }
  });
});
```

## Common Patterns

### Pattern 1: Not Found with Context
```typescript
const student = await this.studentModel.findByPk(id);
if (!student) {
  throw BusinessException.notFound('Student', id);
}
```

### Pattern 2: Validation with Multiple Errors
```typescript
const errors: ValidationErrorDetail[] = [];

if (!email) errors.push({ field: 'email', message: 'Email is required' });
if (!name) errors.push({ field: 'name', message: 'Name is required' });

if (errors.length > 0) {
  throw new ValidationException('Validation failed', errors);
}
```

### Pattern 3: Database Error with Retry
```typescript
try {
  await this.database.query('...');
} catch (error) {
  const dbError = new DatabaseException('query', error, { sql: '...' });

  if (dbError.isConnectionError() || dbError.isTimeoutError()) {
    // Retry logic
  }

  throw dbError;
}
```

### Pattern 4: External Service Error
```typescript
import { ExternalServiceException } from '@/common/exceptions';

try {
  await axios.get('https://external-api.com/data');
} catch (error) {
  throw new ExternalServiceException(
    'ExternalAPI',
    'Failed to fetch data from external API',
    { statusCode: error.response?.status },
    'https://external-api.com/data'
  );
}
```

## ESLint Rules

The following ESLint rules enforce error handling standards:

- `no-console`: Prevents `console.log` usage (only `console.warn` and `console.error` allowed)
- `no-restricted-properties`: Prevents specific console methods with helpful error messages

To check for violations:
```bash
npm run lint:check
```

To auto-fix violations where possible:
```bash
npm run lint
```

## Support

For questions or issues with migration:
1. Check this guide first
2. Review `/docs/adr/ERROR_HANDLING_STANDARDS.md`
3. Look at examples in `/common/exceptions/exceptions/`
4. Ask in the team Slack channel

## Related Documentation

- [Error Handling Standards ADR](./adr/ERROR_HANDLING_STANDARDS.md)
- [Logger Service Documentation](./LOGGING.md)
- [Error Codes Reference](../src/common/exceptions/constants/error-codes.ts)
- [Request Context Middleware](../src/common/middleware/request-context.middleware.ts)
