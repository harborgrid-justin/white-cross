# Route Validation Quick Reference

## Import

```typescript
import {
  useValidatedParams,
  useValidatedQueryParams,
  IncidentIdParamSchema,
  PaginationParamSchema,
} from '@/utils/routeValidation';
```

---

## Common Patterns

### 1. Validate UUID Route Param

```typescript
// Route: /incidents/:id
function IncidentPage() {
  const { data, loading, error } = useValidatedParams(
    IncidentIdParamSchema,
    { fallbackRoute: '/incidents' }
  );

  if (loading) return <Spinner />;
  if (error) return <Error />;

  return <Details id={data.id} />;
}
```

### 2. Validate Query Params

```typescript
// URL: /list?page=2&type=INJURY
const schema = z.object({
  page: z.coerce.number().min(1).default(1),
  type: IncidentTypeParamSchema.optional(),
});

const { data } = useValidatedQueryParams(schema, { silent: true });
```

### 3. Multiple Route Params

```typescript
// Route: /students/:studentId/incidents/:incidentId
const schema = CompositeParamSchema({
  studentId: UUIDParamSchema,
  incidentId: UUIDParamSchema,
});

const { data } = useValidatedParams(schema);
```

### 4. Custom Validation

```typescript
const { data } = useParamValidator((params) => {
  const date = parseDate(params.date);
  if (!date) return { success: false, error: new RouteValidationError(...) };
  if (date > new Date()) return { success: false, error: ... };
  return { success: true, data: { date } };
});
```

---

## Available Schemas

| Schema | Use Case | Example |
|--------|----------|---------|
| `UUIDParamSchema` | IDs | `123e4567-e89b-...` |
| `NumericParamSchema` | Numbers | `"42"` → `42` |
| `PositiveIntegerParamSchema` | Page, count | `"10"` → `10` |
| `DateParamSchema` | Dates | `"2024-03-15"` |
| `IncidentTypeParamSchema` | Incident type | `"INJURY"` |
| `IncidentSeverityParamSchema` | Severity | `"HIGH"` |
| `PaginationParamSchema` | Pagination | `{page:1,limit:20}` |

---

## Transformation Functions

```typescript
parseDate('2024-03-15')           // Date object
parseBoolean('true')              // true
parseArray('a,b,c')               // ['a','b','c']
parseJSON('{"key":"value"}')      // object
```

---

## Security

All params automatically checked for:
- XSS attacks (`<script>`, `javascript:`)
- SQL injection (`'; DROP TABLE`)
- Path traversal (`../../../`)

---

## Error Handling

```typescript
const { data, error } = useValidatedParams(schema, {
  fallbackRoute: '/home',           // Redirect on error
  silent: false,                     // Show console errors
  onError: (err) => {                // Custom handler
    toast.error(err.userMessage);
  },
});
```

---

## Common Hook Options

```typescript
{
  fallbackRoute: '/home',    // Where to redirect on error
  silent: true,              // Suppress error logs
  onError: (error) => {...}, // Custom error handler
}
```

---

## Creating Custom Schema

```typescript
const CustomSchema = z.object({
  id: UUIDParamSchema,
  type: EnumParamSchema(MyEnum, 'Type Name'),
  date: DateParamSchema,
  optional: z.string().optional(),
}).refine(
  (data) => data.date < new Date(),
  { message: 'Date must be in the past' }
);
```

---

## Best Practices

✅ **DO**
- Always validate route params
- Handle loading and error states
- Provide fallback routes
- Use silent validation for filters
- Log security events

❌ **DON'T**
- Use raw `useParams()` without validation
- Ignore error states
- Skip type checking
- Trust user input

---

## Quick Examples

### Basic Route

```typescript
// Route: /student/:id
const { data } = useValidatedParams(
  z.object({ id: UUIDParamSchema })
);
```

### Query Params

```typescript
// URL: /list?page=1&search=query
const { data } = useValidatedQueryParams(
  z.object({
    page: z.coerce.number().default(1),
    search: z.string().optional(),
  })
);
```

### Manual Validation

```typescript
const result = validateRouteParams(params, schema);
if (result.success) {
  // Use result.data
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| `INVALID_UUID` | Invalid UUID format |
| `INVALID_DATE` | Invalid date |
| `INVALID_ENUM` | Invalid enum value |
| `XSS_DETECTED` | XSS attack attempt |
| `SQL_INJECTION_DETECTED` | SQL injection attempt |
| `PATH_TRAVERSAL_DETECTED` | Path traversal attempt |

---

## See Also

- Full Guide: `ROUTE_VALIDATION_GUIDE.md`
- Examples: `examples/routeValidationExamples.tsx`
- Tests: `__tests__/routeValidation.test.ts`
