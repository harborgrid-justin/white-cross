# Error Code System Documentation

## Overview

Enhanced error handling system inspired by Berty's structured error codes, providing typed error codes, error wrapping, and context preservation for improved debugging and API responses.

## Features

- ✅ **Typed Error Codes** - Enumerated error codes for all application errors
- ✅ **Error Wrapping** - Preserve error chains for debugging
- ✅ **Context Preservation** - Attach metadata to errors
- ✅ **Error Chain Traversal** - Walk through nested errors
- ✅ **HTTP Status Mapping** - Automatic HTTP status code assignment
- ✅ **JSON Serialization** - Structured error responses for APIs
- ✅ **Factory Methods** - Convenient error creation

## Usage

### Basic Error Creation

```typescript
import { AppError, ErrorCode } from '../shared/errors';

// Create a simple error
throw new AppError(
  ErrorCode.ErrStudentNotFound,
  'Student not found',
  undefined,
  { studentId: '123' }
);
```

### Using Factory Methods

```typescript
import { ErrorFactory } from '../shared/errors';

// Medication error
throw ErrorFactory.medicationNotFound('med-456');

// Student error with context
throw ErrorFactory.studentNotFound('student-789', {
  requestId: 'req-123',
  userId: 'user-456'
});

// Permission error
throw ErrorFactory.permissionDenied('administer_medication', 'medication:med-789');
```

### Error Wrapping

```typescript
import { AppError, ErrorCode } from '../shared/errors';

try {
  await database.query(...);
} catch (error) {
  throw new AppError(
    ErrorCode.ErrDatabaseQuery,
    'Failed to fetch student',
    error as Error,
    { studentId: '123' }
  );
}
```

### Error Chain Traversal

```typescript
import { isAppError, hasErrorCode, ErrorCode } from '../shared/errors';

try {
  // Some operation
} catch (error) {
  if (isAppError(error)) {
    // Get all error codes in the chain
    const codes = error.getCodes();
    console.log('Error codes:', codes);
    
    // Check if chain contains specific error
    if (error.hasCode(ErrorCode.ErrDatabaseConnection)) {
      // Handle database connection error
    }
    
    // Get full error chain
    const chain = error.getErrorChain();
    console.log('Error chain:', chain);
  }
}
```

### Integration with Existing Error Handler

```typescript
import { AppError, isAppError } from '../shared/errors';
import { ErrorHandlerMiddleware } from '../middleware/error-handling/handlers/error-handler.middleware';

const errorHandler = new ErrorHandlerMiddleware();

try {
  // Your code
} catch (error) {
  if (isAppError(error)) {
    // Get HTTP status from error
    const statusCode = error.getHttpStatus();
    
    // Get JSON representation
    const errorJson = error.toJSON();
    
    // Pass to existing error handler
    const response = errorHandler.handleError(error, {
      requestId: 'req-123',
      userId: 'user-456'
    });
    
    return h.response(response).code(statusCode);
  }
}
```

## Error Code Organization

Error codes are organized by functional domain:

- **0-99**: Generic errors (Internal, Not Found, Unauthorized, etc.)
- **100-199**: Authentication errors
- **200-299**: Medication errors
- **300-399**: Student errors  
- **400-499**: Health record errors
- **500-599**: Contact errors
- **600-699**: Permission errors
- **700-799**: Database errors
- **800-899**: Validation errors
- **900-999**: Network/External errors

## Error Response Format

```json
{
  "name": "AppError",
  "code": 200,
  "codeName": "ErrMedicationNotFound",
  "message": "Medication with ID med-456 not found",
  "context": {
    "medicationId": "med-456",
    "requestId": "req-123"
  },
  "timestamp": "2025-10-23T14:30:00.000Z",
  "innerError": {
    "name": "Error",
    "message": "Database query failed"
  }
}
```

## Factory Methods

### Authentication

- `ErrorFactory.invalidToken(context?)` - Invalid auth token
- `ErrorFactory.expiredToken(context?)` - Expired auth token
- `ErrorFactory.insufficientPermissions(action, context?)` - Insufficient permissions

### Students

- `ErrorFactory.studentNotFound(studentId, context?)` - Student not found
- `ErrorFactory.studentNoConsent(studentId, context?)` - Missing consent

### Medications

- `ErrorFactory.medicationNotFound(medicationId, context?)` - Medication not found
- `ErrorFactory.medicationAlreadyAdministered(logId, context?)` - Already administered
- `ErrorFactory.medicationDosageInvalid(dosage, reason, context?)` - Invalid dosage

### Health Records

- `ErrorFactory.healthRecordNotFound(recordId, context?)` - Record not found
- `ErrorFactory.healthRecordLocked(recordId, context?)` - Record locked

### Contacts

- `ErrorFactory.contactNotFound(contactId, context?)` - Contact not found

### Permissions

- `ErrorFactory.permissionDenied(action, resource, context?)` - Permission denied

### Validation

- `ErrorFactory.validationFailed(field, reason, context?)` - Validation failed
- `ErrorFactory.missingField(field, context?)` - Missing required field

### Database

- `ErrorFactory.databaseError(operation, inner, context?)` - Database error

### Generic

- `ErrorFactory.notFound(resource, identifier, context?)` - Generic not found
- `ErrorFactory.internalError(message, inner?, context?)` - Internal error

## Best Practices

### 1. Always Use Factory Methods

```typescript
// ✅ Good
throw ErrorFactory.studentNotFound(studentId);

// ❌ Avoid
throw new Error('Student not found');
```

### 2. Provide Context

```typescript
// ✅ Good
throw ErrorFactory.medicationNotFound(medicationId, {
  requestId,
  userId,
  timestamp: Date.now()
});

// ❌ Missing context
throw ErrorFactory.medicationNotFound(medicationId);
```

### 3. Wrap Database Errors

```typescript
// ✅ Good
try {
  await Student.findByPk(id);
} catch (error) {
  throw ErrorFactory.databaseError('find student', error as Error, { studentId: id });
}

// ❌ Don't expose database errors directly
try {
  await Student.findByPk(id);
} catch (error) {
  throw error; // Exposes internal details
}
```

### 4. Check Error Types

```typescript
// ✅ Good
if (isAppError(error) && error.hasCode(ErrorCode.ErrStudentNotFound)) {
  // Handle specific error
}

// ❌ String matching
if (error.message.includes('not found')) {
  // Fragile
}
```

### 5. Return Proper HTTP Status

```typescript
// ✅ Good
if (isAppError(error)) {
  return h.response(error.toJSON()).code(error.getHttpStatus());
}

// ❌ Fixed status codes
return h.response({ error: error.message }).code(500);
```

## Migration Guide

### From Existing Code

**Before:**
```typescript
if (!student) {
  throw Boom.notFound('Student not found');
}
```

**After:**
```typescript
import { ErrorFactory } from '../shared/errors';

if (!student) {
  throw ErrorFactory.studentNotFound(studentId, { requestId });
}
```

### From Generic Errors

**Before:**
```typescript
throw new Error('Medication already administered');
```

**After:**
```typescript
import { ErrorFactory } from '../shared/errors';

throw ErrorFactory.medicationAlreadyAdministered(medicationLogId, {
  administeredAt: log.administeredAt,
  administeredBy: log.administeredBy
});
```

## Testing

```typescript
import { AppError, ErrorCode, isAppError, hasErrorCode } from '../shared/errors';

describe('AppError', () => {
  it('should create error with code', () => {
    const error = new AppError(
      ErrorCode.ErrStudentNotFound,
      'Student not found',
      undefined,
      { studentId: '123' }
    );
    
    expect(error.code).toBe(ErrorCode.ErrStudentNotFound);
    expect(error.message).toBe('Student not found');
    expect(error.context?.studentId).toBe('123');
  });
  
  it('should wrap errors', () => {
    const innerError = new Error('Database connection failed');
    const outerError = new AppError(
      ErrorCode.ErrDatabaseConnection,
      'Failed to connect',
      innerError
    );
    
    const chain = outerError.getErrorChain();
    expect(chain).toHaveLength(2);
    expect(chain[1]).toBe(innerError);
  });
  
  it('should detect error codes in chain', () => {
    const inner = new AppError(ErrorCode.ErrDatabaseConnection, 'DB error');
    const outer = new AppError(ErrorCode.ErrStudentNotFound, 'Not found', inner);
    
    expect(outer.hasCode(ErrorCode.ErrDatabaseConnection)).toBe(true);
    expect(outer.hasCode(ErrorCode.ErrMedicationNotFound)).toBe(false);
  });
});
```

## Next Steps

1. Update existing services to use new error codes
2. Add error codes to API documentation
3. Create error code reference guide for frontend
4. Add monitoring/alerting based on error codes
5. Create error analytics dashboard

## See Also

- [Error Handler Middleware](../middleware/error-handling/handlers/error-handler.middleware.ts)
- [Implementation Plan](../../../../IMPLEMENTATION_PLAN.md)
- [Berty Error Code Reference](https://github.com/berty/berty/tree/master/go/pkg/errcode)
