# Validation and Error Handling - File Index

Quick reference for all files created.

## Exception Handling (9 files)

### Filters
- `/nestjs-backend/src/common/exceptions/filters/http-exception.filter.ts`
- `/nestjs-backend/src/common/exceptions/filters/all-exceptions.filter.ts`

### Custom Exceptions
- `/nestjs-backend/src/common/exceptions/exceptions/business.exception.ts`
- `/nestjs-backend/src/common/exceptions/exceptions/validation.exception.ts`
- `/nestjs-backend/src/common/exceptions/exceptions/healthcare.exception.ts`

### Types and Constants
- `/nestjs-backend/src/common/exceptions/types/error-response.types.ts`
- `/nestjs-backend/src/common/exceptions/constants/error-codes.ts`

### Exports
- `/nestjs-backend/src/common/exceptions/index.ts`

### Documentation
- `/nestjs-backend/src/common/exceptions/docs/ERROR_CODES.md`
- `/nestjs-backend/src/common/exceptions/docs/VALIDATION_IMPLEMENTATION_GUIDE.md`

## Custom Validators (8 files)

### Decorators
- `/nestjs-backend/src/common/validators/decorators/is-phone.decorator.ts`
- `/nestjs-backend/src/common/validators/decorators/is-ssn.decorator.ts`
- `/nestjs-backend/src/common/validators/decorators/is-mrn.decorator.ts`
- `/nestjs-backend/src/common/validators/decorators/is-npi.decorator.ts`
- `/nestjs-backend/src/common/validators/decorators/is-icd10.decorator.ts`
- `/nestjs-backend/src/common/validators/decorators/is-dosage.decorator.ts`
- `/nestjs-backend/src/common/validators/decorators/sanitize-html.decorator.ts`

### Utilities
- `/nestjs-backend/src/common/validators/validators/healthcare.validator.ts`

### Exports
- `/nestjs-backend/src/common/validators/index.ts`

## Interceptors (4 files)

- `/nestjs-backend/src/common/interceptors/logging.interceptor.ts`
- `/nestjs-backend/src/common/interceptors/sanitization.interceptor.ts`
- `/nestjs-backend/src/common/interceptors/timeout.interceptor.ts`
- `/nestjs-backend/src/common/interceptors/index.ts`

## Summary Documents (2 files)

- `/VALIDATION_AND_ERROR_HANDLING_SUMMARY.md` (Complete implementation summary)
- `/VALIDATION_FILES_INDEX.md` (This file)

## Total: 23 files created

## Quick Import Examples

```typescript
// Exception handling
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  BusinessException,
  ValidationException,
  HealthcareException,
  ErrorCodes,
} from './common/exceptions';

// Validators
import {
  IsPhone,
  IsSSN,
  IsMRN,
  IsNPI,
  IsICD10,
  IsDosage,
  SanitizeHtml,
  SanitizeText,
} from './common/validators';

// Interceptors
import {
  LoggingInterceptor,
  SanitizationInterceptor,
  TimeoutInterceptor,
} from './common/interceptors';
```
