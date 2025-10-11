# Route Parameter Validation System - Complete Guide

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Core Concepts](#core-concepts)
4. [Validation Schemas](#validation-schemas)
5. [Security Features](#security-features)
6. [React Hooks](#react-hooks)
7. [Advanced Usage](#advanced-usage)
8. [Best Practices](#best-practices)
9. [API Reference](#api-reference)
10. [Examples](#examples)

---

## Overview

The Route Parameter Validation System provides enterprise-grade validation for React Router v6 route parameters and query strings in the White Cross healthcare platform. It ensures data integrity, prevents security vulnerabilities, and provides type-safe parameter handling.

### Key Features

- **Type-Safe Validation**: Zod-based schemas with TypeScript inference
- **Security First**: XSS prevention, SQL injection detection, path traversal protection
- **React Integration**: Custom hooks for seamless React Router v6 integration
- **User-Friendly Errors**: Healthcare-specific error messages for better UX
- **Parameter Transformation**: Built-in parsers for dates, booleans, arrays, JSON
- **HIPAA Compliance**: Audit logging and secure parameter handling

---

## Installation

The validation system is already integrated into the project. Import what you need:

```typescript
import {
  // Schemas
  UUIDParamSchema,
  IncidentIdParamSchema,
  PaginationParamSchema,

  // Hooks
  useValidatedParams,
  useValidatedQueryParams,

  // Utilities
  validateRouteParams,
  sanitizeParams,
  parseDate,
  parseBoolean,

  // Error handling
  RouteValidationError,
  handleValidationError,
} from '@/utils/routeValidation';
```

---

## Core Concepts

### 1. Schema-Based Validation

All validation is based on Zod schemas that define expected parameter types and constraints:

```typescript
import { z } from 'zod';
import { UUIDParamSchema } from '@/utils/routeValidation';

// Define a schema for your route
const schema = z.object({
  id: UUIDParamSchema,
});
```

### 2. Automatic Sanitization

All parameters are automatically sanitized before validation to prevent security vulnerabilities:

```typescript
// Input:  "  <script>alert(1)</script>  "
// Output: "&lt;script&gt;alert(1)&lt;/script&gt;" (and throws XSS error)
```

### 3. Type Inference

TypeScript automatically infers types from Zod schemas:

```typescript
const result = validateRouteParams(params, schema);
if (result.success) {
  // TypeScript knows result.data.id is a string (UUID)
  const id: string = result.data.id;
}
```

---

## Validation Schemas

### Built-in Schemas

#### UUID Parameters

```typescript
import { UUIDParamSchema, IncidentIdParamSchema } from '@/utils/routeValidation';

// Basic UUID
const schema = z.object({
  id: UUIDParamSchema,
});

// Named schemas for clarity
const incidentSchema = z.object({
  incidentId: IncidentIdParamSchema,
});
```

#### Numeric Parameters

```typescript
import { NumericParamSchema, PositiveIntegerParamSchema } from '@/utils/routeValidation';

// Any positive number
const schema = z.object({
  page: NumericParamSchema,
});

// Positive integers only (for pagination, counts)
const paginationSchema = z.object({
  page: PositiveIntegerParamSchema,
});
```

#### Date Parameters

```typescript
import { DateParamSchema, DateRangeParamSchema } from '@/utils/routeValidation';

// Single date
const schema = z.object({
  appointmentDate: DateParamSchema,
});

// Date range with validation
const rangeSchema = DateRangeParamSchema; // Ensures startDate <= endDate
```

#### Enum Parameters

```typescript
import { EnumParamSchema, IncidentTypeParamSchema } from '@/utils/routeValidation';
import { IncidentType, IncidentSeverity } from '@/types/incidents';

// Generic enum schema
const typeSchema = z.object({
  type: EnumParamSchema(IncidentType, 'Incident Type'),
});

// Predefined incident schemas
const incidentFilterSchema = z.object({
  type: IncidentTypeParamSchema,
  severity: EnumParamSchema(IncidentSeverity, 'Severity'),
});
```

#### Pagination Parameters

```typescript
import { PaginationParamSchema } from '@/utils/routeValidation';

// Includes page and limit with defaults and validation
const result = validateQueryParams(searchParams, PaginationParamSchema);
// result.data.page: number (default: 1, min: 1)
// result.data.limit: number (default: 20, min: 1, max: 100)
```

### Creating Custom Schemas

#### Simple Custom Schema

```typescript
import { z } from 'zod';

const CustomParamSchema = z.object({
  studentNumber: z.string()
    .regex(/^STU\d{6}$/, { message: 'Must be format STU######' }),
  grade: z.string()
    .regex(/^(K|[1-9]|1[0-2])$/, { message: 'Must be K-12' }),
});
```

#### Composite Schema

```typescript
import { CompositeParamSchema, UUIDParamSchema } from '@/utils/routeValidation';

const StudentIncidentSchema = CompositeParamSchema({
  studentId: UUIDParamSchema,
  incidentId: UUIDParamSchema,
  type: IncidentTypeParamSchema,
});
```

#### Schema with Refinements

```typescript
const AdvancedSchema = z.object({
  startDate: DateParamSchema,
  endDate: DateParamSchema,
  maxResults: PositiveIntegerParamSchema,
}).refine(
  (data) => data.startDate < data.endDate,
  { message: 'Start date must be before end date' }
).refine(
  (data) => data.maxResults <= 1000,
  { message: 'Maximum 1000 results allowed' }
);
```

---

## Security Features

### XSS Prevention

Automatically detects and blocks XSS attack patterns:

```typescript
// These will throw RouteValidationError with code 'XSS_DETECTED'
validateRouteParams({ input: '<script>alert(1)</script>' }, schema);
validateRouteParams({ url: 'javascript:alert(1)' }, schema);
validateRouteParams({ html: '<img onerror="alert(1)">' }, schema);
```

### SQL Injection Prevention

Detects common SQL injection patterns:

```typescript
// These will throw RouteValidationError with code 'SQL_INJECTION_DETECTED'
validateRouteParams({ query: "'; DROP TABLE users; --" }, schema);
validateRouteParams({ filter: "UNION SELECT * FROM passwords" }, schema);
validateRouteParams({ where: "OR 1=1 --" }, schema);
```

### Path Traversal Prevention

Blocks directory traversal attempts:

```typescript
// These will throw RouteValidationError with code 'PATH_TRAVERSAL_DETECTED'
validateRouteParams({ path: '../../../etc/passwd' }, schema);
validateRouteParams({ file: '%2e%2e/sensitive' }, schema);
```

### Manual Security Checks

```typescript
import {
  performSecurityChecks,
  detectXSS,
  detectSQLInjection,
  detectPathTraversal
} from '@/utils/routeValidation';

// Check individual patterns
if (detectXSS(userInput)) {
  // Handle XSS attempt
}

// Comprehensive check (throws on threat)
try {
  performSecurityChecks(userInput, 'fieldName');
} catch (error) {
  if (error instanceof RouteValidationError) {
    console.error('Security threat detected:', error.code);
  }
}
```

---

## React Hooks

### useValidatedParams

Validates route parameters with automatic error handling and redirects.

```typescript
import { useValidatedParams, IncidentIdParamSchema } from '@/utils/routeValidation';

function IncidentDetailPage() {
  const { data, loading, error } = useValidatedParams(
    IncidentIdParamSchema,
    {
      fallbackRoute: '/incidents',
      onError: (error) => {
        console.error('Invalid incident ID:', error);
        toast.error(error.userMessage);
      },
    }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error.userMessage} />;

  return <IncidentDetails incidentId={data.id} />;
}
```

### useValidatedQueryParams

Validates query string parameters from URL search params.

```typescript
import { useValidatedQueryParams } from '@/utils/routeValidation';
import { z } from 'zod';

function IncidentListPage() {
  const filterSchema = z.object({
    page: z.coerce.number().min(1).optional(),
    type: IncidentTypeParamSchema.optional(),
    severity: IncidentSeverityParamSchema.optional(),
    search: z.string().optional(),
  });

  const { data, loading, error } = useValidatedQueryParams(filterSchema, {
    silent: true, // Don't show errors for invalid filters
  });

  const filters = data || { page: 1 };

  return (
    <div>
      <IncidentFilters
        type={filters.type}
        severity={filters.severity}
        search={filters.search}
      />
      <IncidentList
        page={filters.page}
        type={filters.type}
        severity={filters.severity}
      />
    </div>
  );
}
```

### useParamValidator

Custom validation with business logic.

```typescript
import { useParamValidator, RouteValidationError } from '@/utils/routeValidation';

function ReportGeneratorPage() {
  const { data, loading, error, revalidate } = useParamValidator(
    (params) => {
      const startDate = parseDate(params.startDate);
      const endDate = parseDate(params.endDate);

      if (!startDate || !endDate) {
        return {
          success: false,
          error: new RouteValidationError(
            'Invalid date range',
            'dateRange',
            'INVALID_DATE'
          ),
        };
      }

      // Business rule: Max 1 year date range
      const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 365) {
        return {
          success: false,
          error: new RouteValidationError(
            'Date range cannot exceed 1 year',
            'dateRange',
            'OUT_OF_RANGE'
          ),
        };
      }

      return { success: true, data: { startDate, endDate } };
    },
    { fallbackRoute: '/reports' }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error.userMessage} />;

  return (
    <div>
      <Report startDate={data.startDate} endDate={data.endDate} />
      <button onClick={revalidate}>Refresh</button>
    </div>
  );
}
```

---

## Advanced Usage

### Parameter Transformation

#### Dates

```typescript
import { parseDate } from '@/utils/routeValidation';

// ISO 8601 dates
const date1 = parseDate('2024-03-15T10:30:00Z'); // Date object
const date2 = parseDate('2024-03-15'); // Date object
const invalid = parseDate('not-a-date'); // null
```

#### Booleans

```typescript
import { parseBoolean } from '@/utils/routeValidation';

// Flexible boolean parsing
parseBoolean('true');  // true
parseBoolean('1');     // true
parseBoolean('yes');   // true
parseBoolean('on');    // true

parseBoolean('false'); // false
parseBoolean('0');     // false
parseBoolean('no');    // false
parseBoolean('off');   // false

parseBoolean('maybe'); // null
```

#### Arrays

```typescript
import { parseArray } from '@/utils/routeValidation';

// Comma-separated (default)
parseArray('tag1,tag2,tag3'); // ['tag1', 'tag2', 'tag3']

// Custom delimiter
parseArray('id1|id2|id3', '|'); // ['id1', 'id2', 'id3']

// Auto-trimming
parseArray(' item1 , item2 , item3 '); // ['item1', 'item2', 'item3']

// Empty handling
parseArray('item1,,item2,'); // ['item1', 'item2']
```

#### JSON

```typescript
import { parseJSON } from '@/utils/routeValidation';

// Parse JSON parameters
const filters = parseJSON<{ type: string; severity: string }>(
  '{"type":"INJURY","severity":"HIGH"}'
);

if (filters) {
  console.log(filters.type, filters.severity);
}
```

#### Batch Transformation

```typescript
import { parseParams } from '@/utils/routeValidation';

const params = {
  page: '2',
  active: 'true',
  tags: 'red,blue,green',
  date: '2024-03-15T10:30:00Z',
  filters: '{"type":"INJURY"}',
};

const parsed = parseParams(params, {
  page: 'number',
  active: 'boolean',
  tags: 'array',
  date: 'date',
  filters: 'json',
});

// Result:
// {
//   page: 2,
//   active: true,
//   tags: ['red', 'blue', 'green'],
//   date: Date object,
//   filters: { type: 'INJURY' }
// }
```

### Manual Validation

For non-React contexts or more control:

```typescript
import { validateRouteParams, validateQueryParams } from '@/utils/routeValidation';

// Validate route params
function processIncident(params: Record<string, string>) {
  const result = validateRouteParams(params, IncidentIdParamSchema);

  if (!result.success) {
    handleValidationError(result.error);
    return;
  }

  // Use validated data
  fetchIncident(result.data.id);
}

// Validate query params
function processFilters(searchParams: URLSearchParams) {
  const result = validateQueryParams(searchParams, filterSchema);

  if (result.success) {
    applyFilters(result.data);
  }
}
```

### Error Handling

#### Basic Error Handling

```typescript
import { RouteValidationError, handleValidationError } from '@/utils/routeValidation';

try {
  const result = validateRouteParams(params, schema);
  if (!result.success) {
    throw result.error;
  }
  // Use result.data
} catch (error) {
  if (error instanceof RouteValidationError) {
    handleValidationError(error, 'MyComponent');
    // Show user-friendly message
    toast.error(error.userMessage);
  }
}
```

#### Redirect on Error

```typescript
import { redirectOnInvalidParams } from '@/utils/routeValidation';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  const params = useParams();

  const result = validateRouteParams(params, schema);
  if (!result.success) {
    redirectOnInvalidParams(result.error, '/fallback', navigate);
    return null;
  }

  return <div>Valid params: {result.data.id}</div>;
}
```

---

## Best Practices

### 1. Always Validate Route Parameters

```typescript
// BAD: Using raw params
function IncidentPage() {
  const { id } = useParams();
  // id is string | undefined, not validated
  return <IncidentDetails id={id!} />; // Unsafe!
}

// GOOD: Validated params
function IncidentPage() {
  const { data, loading, error } = useValidatedParams(IncidentIdParamSchema);
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage />;
  return <IncidentDetails id={data.id} />; // Type-safe and validated!
}
```

### 2. Use Appropriate Schemas

```typescript
// BAD: Generic validation
const schema = z.object({ id: z.string() });

// GOOD: Specific validation
const schema = z.object({ id: UUIDParamSchema });
```

### 3. Handle Loading and Error States

```typescript
function MyComponent() {
  const { data, loading, error } = useValidatedParams(schema);

  // Always handle all states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBoundary error={error} />;

  return <Content data={data} />;
}
```

### 4. Provide Fallback Routes

```typescript
// Prevent users from getting stuck on error pages
const { data, loading, error } = useValidatedParams(
  IncidentIdParamSchema,
  { fallbackRoute: '/incidents' } // Redirect to list on error
);
```

### 5. Silent Validation for Optional Filters

```typescript
// For search/filter params, don't show errors
const { data } = useValidatedQueryParams(
  filterSchema,
  { silent: true } // Invalid filters won't show error messages
);

// Use default values
const filters = data || { page: 1, limit: 20 };
```

### 6. Log Security Events

```typescript
const { data, error } = useValidatedParams(schema, {
  onError: (error) => {
    // Log security threats for audit trail
    if (['XSS_DETECTED', 'SQL_INJECTION_DETECTED'].includes(error.code)) {
      logSecurityEvent({
        type: error.code,
        url: window.location.href,
        timestamp: error.timestamp,
      });
    }
  },
});
```

---

## API Reference

### Schemas

| Schema | Purpose | Example |
|--------|---------|---------|
| `UUIDParamSchema` | Validates UUID v4 format | `123e4567-e89b-12d3-a456-426614174000` |
| `NumericParamSchema` | Validates and parses integers | `"42"` → `42` |
| `PositiveIntegerParamSchema` | Validates positive integers | `"10"` → `10` |
| `DateParamSchema` | Validates ISO 8601 dates | `"2024-03-15"` → `Date` |
| `EnumParamSchema(enum, name)` | Validates enum values | `"INJURY"` |
| `CompositeParamSchema(shape)` | Combines multiple schemas | Multiple params |
| `PaginationParamSchema` | Page and limit with defaults | `{ page: 1, limit: 20 }` |
| `DateRangeParamSchema` | Start and end dates | Validates range |

### Validation Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `validateRouteParams(params, schema)` | Validates route parameters | `ValidationResult<T>` |
| `validateQueryParams(searchParams, schema)` | Validates query parameters | `ValidationResult<T>` |
| `sanitizeParams(params)` | Sanitizes parameters | `Record<string, string>` |

### Security Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `detectXSS(value)` | Checks for XSS patterns | `boolean` |
| `detectSQLInjection(value)` | Checks for SQL injection | `boolean` |
| `detectPathTraversal(value)` | Checks for path traversal | `boolean` |
| `performSecurityChecks(value, field)` | All security checks | `void` (throws on threat) |
| `sanitizeSpecialCharacters(value)` | Encodes HTML entities | `string` |

### Transformation Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `parseDate(param)` | Parses date string | `Date \| null` |
| `parseBoolean(param)` | Parses boolean string | `boolean \| null` |
| `parseArray(param, delimiter)` | Parses delimited array | `string[]` |
| `parseJSON<T>(param)` | Parses JSON string | `T \| null` |
| `parseParams(params, types)` | Batch transformation | `Record<string, any>` |

### React Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| `useValidatedParams<T>(schema, options)` | Validates route params | `{ data, loading, error }` |
| `useValidatedQueryParams<T>(schema, options)` | Validates query params | `{ data, loading, error }` |
| `useParamValidator<T>(validator, options)` | Custom validation | `{ data, loading, error, revalidate }` |

### Error Handling

| Function | Purpose | Returns |
|----------|---------|---------|
| `handleValidationError(error, context)` | Logs and processes error | `void` |
| `redirectOnInvalidParams(error, fallback, navigate)` | Redirects on error | `void` |

---

## Examples

### Example 1: Incident Detail Page

```typescript
import { useValidatedParams, IncidentIdParamSchema } from '@/utils/routeValidation';
import { useQuery } from '@tanstack/react-query';

function IncidentDetailPage() {
  const { data: params, loading, error } = useValidatedParams(
    IncidentIdParamSchema,
    { fallbackRoute: '/incidents' }
  );

  const { data: incident, isLoading } = useQuery({
    queryKey: ['incident', params?.id],
    queryFn: () => fetchIncident(params!.id),
    enabled: !!params,
  });

  if (loading || isLoading) return <LoadingSpinner />;
  if (error) return <ErrorPage error={error.userMessage} />;
  if (!incident) return <NotFound />;

  return <IncidentDetails incident={incident} />;
}
```

### Example 2: Filtered List with Pagination

```typescript
import { useValidatedQueryParams } from '@/utils/routeValidation';
import { z } from 'zod';

function IncidentListPage() {
  const filterSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    type: IncidentTypeParamSchema.optional(),
    severity: IncidentSeverityParamSchema.optional(),
    search: z.string().optional(),
    dateFrom: DateParamSchema.optional(),
    dateTo: DateParamSchema.optional(),
  });

  const { data: filters } = useValidatedQueryParams(filterSchema, {
    silent: true,
  });

  const { data: incidents, isLoading } = useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => fetchIncidents(filters),
  });

  return (
    <div>
      <IncidentFilters filters={filters} />
      <IncidentList
        incidents={incidents}
        page={filters?.page ?? 1}
        loading={isLoading}
      />
    </div>
  );
}
```

### Example 3: Multi-Parameter Route

```typescript
import { useValidatedParams, CompositeParamSchema, UUIDParamSchema } from '@/utils/routeValidation';

// Route: /students/:studentId/incidents/:incidentId

function StudentIncidentPage() {
  const schema = CompositeParamSchema({
    studentId: UUIDParamSchema,
    incidentId: UUIDParamSchema,
  });

  const { data, loading, error } = useValidatedParams(schema, {
    fallbackRoute: '/students',
    onError: (error) => {
      console.error('Invalid route params:', error);
      toast.error(error.userMessage);
    },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage error={error.userMessage} />;

  return (
    <div>
      <StudentInfo studentId={data.studentId} />
      <IncidentDetails
        studentId={data.studentId}
        incidentId={data.incidentId}
      />
    </div>
  );
}
```

### Example 4: Custom Business Logic Validation

```typescript
import { useParamValidator, parseDate, RouteValidationError } from '@/utils/routeValidation';

// Route: /reports/:startDate/:endDate

function ReportGeneratorPage() {
  const { data, loading, error } = useParamValidator((params) => {
    const startDate = parseDate(params.startDate);
    const endDate = parseDate(params.endDate);

    // Validate dates exist
    if (!startDate || !endDate) {
      return {
        success: false,
        error: new RouteValidationError(
          'Invalid date format',
          'dates',
          'INVALID_DATE'
        ),
      };
    }

    // Business rule: Start before end
    if (startDate >= endDate) {
      return {
        success: false,
        error: new RouteValidationError(
          'Start date must be before end date',
          'dateRange',
          'INVALID_RANGE'
        ),
      };
    }

    // Business rule: Max 1 year range
    const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 365) {
      return {
        success: false,
        error: new RouteValidationError(
          'Date range cannot exceed 1 year',
          'dateRange',
          'OUT_OF_RANGE'
        ),
      };
    }

    // Business rule: No future dates
    if (endDate > new Date()) {
      return {
        success: false,
        error: new RouteValidationError(
          'Cannot generate reports for future dates',
          'endDate',
          'FUTURE_DATE'
        ),
      };
    }

    return { success: true, data: { startDate, endDate } };
  }, { fallbackRoute: '/reports' });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage message={error.userMessage} />;

  return (
    <ReportGenerator
      startDate={data.startDate}
      endDate={data.endDate}
    />
  );
}
```

### Example 5: Search with Multiple Filters

```typescript
import { useValidatedQueryParams, parseArray, parseBoolean } from '@/utils/routeValidation';
import { z } from 'zod';

// URL: /incidents?types=INJURY,ILLNESS&severities=HIGH,CRITICAL&resolved=true&tags=urgent,reviewed

function AdvancedSearchPage() {
  const [searchParams] = useSearchParams();

  const schema = z.object({
    types: z.string().transform(val => parseArray(val)).optional(),
    severities: z.string().transform(val => parseArray(val)).optional(),
    resolved: z.string().transform(val => parseBoolean(val)).optional(),
    tags: z.string().transform(val => parseArray(val)).optional(),
    search: z.string().optional(),
  });

  const { data: filters } = useValidatedQueryParams(schema, { silent: true });

  const { data: results } = useQuery({
    queryKey: ['search', filters],
    queryFn: () => searchIncidents(filters),
  });

  return (
    <div>
      <SearchFilters filters={filters} />
      <SearchResults results={results} />
    </div>
  );
}
```

---

## Troubleshooting

### Common Issues

#### Issue: "Module not found" error

**Solution**: Ensure you're using the `@/` path alias:

```typescript
// Correct
import { useValidatedParams } from '@/utils/routeValidation';

// Incorrect
import { useValidatedParams } from '../utils/routeValidation';
```

#### Issue: TypeScript errors with Zod schemas

**Solution**: Ensure you have the latest Zod version and proper TypeScript types:

```bash
npm install zod@latest
```

#### Issue: Validation passes but data is wrong type

**Solution**: Use `.transform()` in your schema to convert types:

```typescript
const schema = z.object({
  page: z.string().transform(val => parseInt(val, 10)),
});
```

#### Issue: Hook causes infinite re-renders

**Solution**: Memoize schema definitions outside component or use `useMemo`:

```typescript
// Outside component (preferred)
const schema = IncidentIdParamSchema;

function MyComponent() {
  const { data } = useValidatedParams(schema);
  // ...
}

// Or with useMemo
function MyComponent() {
  const schema = useMemo(() => IncidentIdParamSchema, []);
  const { data } = useValidatedParams(schema);
  // ...
}
```

---

## Contributing

When adding new validation schemas or utilities:

1. Add comprehensive JSDoc comments
2. Include usage examples
3. Write unit tests in `__tests__/routeValidation.test.ts`
4. Update this documentation
5. Consider security implications
6. Follow existing naming conventions

---

## Support

For issues or questions:

1. Check this documentation first
2. Review existing examples in the codebase
3. Check the test file for more examples
4. Consult the team's technical lead

---

## License

Internal use only - White Cross Healthcare Platform
