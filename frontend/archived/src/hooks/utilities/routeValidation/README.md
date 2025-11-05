# Route Validation Module

Enterprise-level route parameter validation system for Next.js App Router applications.

## Overview

This module provides comprehensive validation for route parameters and query strings, implementing security checks, type-safety, and error handling for the healthcare platform.

## Module Structure

The original 1251-line `routeValidation.ts` file has been broken down into focused modules:

### Core Files

| File | Lines | Purpose |
|------|-------|---------|
| `routeValidationTypes.ts` | 145 | Type definitions, interfaces, and custom error classes |
| `routeValidationSchemas.ts` | 253 | Zod validation schemas for route parameters |
| `routeValidationSecurity.ts` | 142 | Security utilities (XSS, SQL injection, path traversal detection) |
| `routeValidationTransformers.ts` | 155 | Parameter transformation utilities (dates, booleans, arrays, JSON) |
| `routeValidationUtils.ts` | 236 | Core validation functions and error handlers |
| `routeValidationHooks.ts` | 288 | React hooks for route parameter validation |
| `index.ts` | 221 | Central export hub (maintains backward compatibility) |

**Total:** 1440 lines (includes additional documentation and separation improvements)

## Features

- **Type Safety**: Zod schema-based validation with TypeScript inference
- **Security**: XSS prevention, SQL injection detection, path traversal protection
- **React Integration**: Custom hooks for seamless Next.js App Router integration
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Parameter Transformation**: Utilities for dates, booleans, arrays, and JSON parsing
- **HIPAA Compliance**: Logging and audit trail support

## Quick Start

### Basic UUID Validation

```typescript
import { useValidatedParams, IncidentIdParamSchema } from '@/hooks/utilities/routeValidation';

function IncidentDetailPage() {
  const { data, loading, error } = useValidatedParams(
    IncidentIdParamSchema,
    { fallbackRoute: '/incidents' }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage error={error.userMessage} />;

  return <IncidentDetails incidentId={data.id} />;
}
```

### Query Parameter Validation

```typescript
import { useValidatedQueryParams, PaginationParamSchema } from '@/hooks/utilities/routeValidation';

function IncidentListPage() {
  const { data } = useValidatedQueryParams(
    PaginationParamSchema,
    { silent: true }
  );

  const page = data?.page ?? 1;
  const limit = data?.limit ?? 20;

  return <IncidentList page={page} limit={limit} />;
}
```

### Custom Validation

```typescript
import { useParamValidator, RouteValidationError, parseDate } from '@/hooks/utilities/routeValidation';

function ReportGeneratorPage() {
  const { data, error } = useParamValidator((params) => {
    const startDate = parseDate(params.startDate);
    const endDate = parseDate(params.endDate);

    if (!startDate || !endDate) {
      return {
        success: false,
        error: new RouteValidationError('Invalid date range', 'dateRange', 'INVALID_DATE')
      };
    }

    const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 365) {
      return {
        success: false,
        error: new RouteValidationError('Date range cannot exceed 1 year', 'dateRange', 'OUT_OF_RANGE')
      };
    }

    return { success: true, data: { startDate, endDate } };
  });

  if (error) return <ErrorPage error={error.userMessage} />;
  return <Report startDate={data.startDate} endDate={data.endDate} />;
}
```

## Module Details

### routeValidationTypes.ts
Defines core types and the `RouteValidationError` class with user-friendly error messages.

**Key Exports:**
- `ParamValidator<T>` - Generic validator function type
- `ValidationResult<T>` - Success/error result type
- `ValidationHookOptions` - Configuration for validation hooks
- `RouteValidationError` - Custom error class with detailed information

### routeValidationSchemas.ts
Zod schemas for common route parameters and predefined entity schemas.

**Key Exports:**
- `UUIDParamSchema` - UUID validation
- `NumericParamSchema` - Numeric parameters
- `DateParamSchema` - ISO 8601 date validation
- `EnumParamSchema()` - Generic enum schema factory
- Predefined schemas for Students, Incidents, Medications, etc.
- `PaginationParamSchema` - Standard pagination validation

### routeValidationSecurity.ts
Security checks to prevent XSS, SQL injection, and path traversal attacks.

**Key Exports:**
- `detectXSS()` - XSS pattern detection
- `detectSQLInjection()` - SQL injection detection
- `detectPathTraversal()` - Path traversal detection
- `performSecurityChecks()` - Comprehensive security validation
- `sanitizeSpecialCharacters()` - HTML entity encoding

### routeValidationTransformers.ts
Utilities for transforming string parameters into typed values.

**Key Exports:**
- `parseDate()` - String to Date conversion
- `parseBoolean()` - String to boolean conversion
- `parseArray()` - Delimited string to array
- `parseJSON()` - JSON string parsing with security checks
- `parseParams()` - Bulk parameter transformation

### routeValidationUtils.ts
Core validation functions and error handling utilities.

**Key Exports:**
- `sanitizeParams()` - Parameter sanitization with security checks
- `validateRouteParams()` - Schema-based route parameter validation
- `validateQueryParams()` - URLSearchParams validation
- `handleValidationError()` - Error logging and reporting
- `redirectOnInvalidParams()` - Automatic error redirect

### routeValidationHooks.ts
React hooks for integrating validation into components.

**Key Exports:**
- `useValidatedParams()` - Route parameter validation hook
- `useValidatedQueryParams()` - Query parameter validation hook
- `useParamValidator()` - Custom validator function hook

## Migration Guide

### From Original File

All imports remain unchanged due to the `index.ts` re-export:

```typescript
// Before (still works)
import { useValidatedParams, UUIDParamSchema } from '@/hooks/utilities/routeValidation';

// After (same import, no changes needed)
import { useValidatedParams, UUIDParamSchema } from '@/hooks/utilities/routeValidation';
```

### Direct Module Imports (Optional)

For more explicit imports or tree-shaking benefits:

```typescript
// Import from specific modules
import { RouteValidationError } from '@/hooks/utilities/routeValidation/routeValidationTypes';
import { UUIDParamSchema } from '@/hooks/utilities/routeValidation/routeValidationSchemas';
import { useValidatedParams } from '@/hooks/utilities/routeValidation/routeValidationHooks';
```

## Backward Compatibility

The `index.ts` file re-exports all public APIs from the original module, ensuring 100% backward compatibility. Existing code requires no changes.

## Testing

Each module can be tested independently:

```typescript
// Test schemas
import { UUIDParamSchema } from './routeValidationSchemas';

// Test security
import { detectXSS } from './routeValidationSecurity';

// Test transformers
import { parseDate } from './routeValidationTransformers';

// Test hooks
import { useValidatedParams } from './routeValidationHooks';
```

## Performance

- **Reduced Bundle Size**: Tree-shaking can now exclude unused modules
- **Faster Parsing**: Smaller individual files compile faster
- **Better Caching**: Changes to one module don't invalidate others

## Future Enhancements

- Additional schema validators for new entity types
- Enhanced security patterns for emerging threats
- Performance optimizations for large-scale validation
- Integration with monitoring/analytics services

## Contributing

When adding new validation logic:

1. **Types** → Add to `routeValidationTypes.ts`
2. **Schemas** → Add to `routeValidationSchemas.ts`
3. **Security** → Add to `routeValidationSecurity.ts`
4. **Transformers** → Add to `routeValidationTransformers.ts`
5. **Utilities** → Add to `routeValidationUtils.ts`
6. **Hooks** → Add to `routeValidationHooks.ts`
7. **Exports** → Update `index.ts`

Keep files under 300 lines. If a module grows too large, consider further subdivision.

## Related Documentation

- [Next.js App Router Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Zod Schema Validation](https://zod.dev/)
- [React Router v6 Hooks](https://reactrouter.com/en/main/hooks)

## License

Internal use only - Healthcare Platform
