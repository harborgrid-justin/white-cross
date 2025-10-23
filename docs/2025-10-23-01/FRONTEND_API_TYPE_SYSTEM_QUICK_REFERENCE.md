# API Response Type System - Quick Reference

## Import Statements

```typescript
// Core response types
import {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  PaginatedResponse
} from '@/types/api';

// Mutation types
import {
  CreateMutationResult,
  UpdateMutationResult,
  DeleteMutationResult,
  BulkMutationResult
} from '@/types/api';

// Utilities
import {
  wrapSuccessResponse,
  unwrapApiResponse,
  isSuccessResponse,
  isErrorResponse
} from '@/types/api';
```

## Common Patterns

### 1. Standard GET Request
```typescript
async getById(id: string): Promise<ApiResponse<Student>> {
  const response = await this.client.get<ApiResponse<Student>>(`/students/${id}`);
  return response.data;
}
```

### 2. Paginated List
```typescript
async getAll(filters: Filters): Promise<PaginatedResponse<Student>> {
  const response = await this.client.get<PaginatedResponse<Student>>('/students', {
    params: filters
  });
  return response.data;
}
```

### 3. POST/PUT/PATCH Request
```typescript
async create(data: CreateData): Promise<ApiResponse<Student>> {
  const response = await this.client.post<ApiResponse<Student>>('/students', data);
  return response.data;
}
```

### 4. Error Handling
```typescript
try {
  const response = await api.getStudent(id);
  if (isSuccessResponse(response)) {
    return response.data;
  } else if (isErrorResponse(response)) {
    console.error(response.errors);
  }
} catch (error) {
  handleError(error);
}
```

### 5. Unwrap Response
```typescript
const response = await api.getStudent(id);
const student = unwrapApiResponse(response); // Throws if not successful
```

## Type Definitions Quick Reference

### ApiResponse<T>
```typescript
{
  success: boolean;
  data: T;
  message?: string;
  status?: number;
  errors?: ErrorDetail[];
}
```

### PaginatedResponse<T>
```typescript
{
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### ErrorResponse
```typescript
{
  success: false;
  errors: ErrorDetail[];
  status: number;
  message: string;
  code?: string;
  traceId?: string;
}
```

### ErrorDetail
```typescript
{
  field?: string;
  message: string;
  code?: string;
  details?: unknown;
}
```

### CreateMutationResult<T>
```typescript
{
  id: string;
  success: boolean;
  message: string;
  data: T;
  operation: 'create';
  errors?: MutationError[];
}
```

### UpdateMutationResult<T>
```typescript
{
  id: string;
  success: boolean;
  message: string;
  data: T;
  previousData?: Partial<T>;
  changedFields?: string[];
  operation: 'update';
  errors?: MutationError[];
}
```

## Type Guards

```typescript
// Check if valid API response
if (isApiResponse(data)) {
  console.log(data.success, data.data);
}

// Check if success
if (isSuccessResponse(response)) {
  // response.data is guaranteed to exist
  return response.data;
}

// Check if error
if (isErrorResponse(response)) {
  // response.errors is guaranteed to exist
  console.error(response.errors);
}

// Check if paginated
if (isPaginatedResponse(data)) {
  console.log(data.pagination.total);
}

// Check mutation success
if (isMutationSuccess(result)) {
  console.log(result.data);
}

// Check mutation error
if (isMutationError(result)) {
  console.error(result.errors);
}
```

## Utilities

```typescript
// Create success response (for mocks/tests)
const response = wrapSuccessResponse(
  { id: '123', name: 'John' },
  'Retrieved successfully'
);

// Create error response (for mocks/tests)
const errorResponse = createErrorResponse(
  'Validation failed',
  [{ field: 'email', message: 'Required', code: 'REQUIRED' }],
  400,
  'VALIDATION_ERROR'
);

// Create paginated response (for mocks/tests)
const paginated = wrapPaginatedResponse(
  [item1, item2],
  1,  // page
  10, // limit
  50  // total
);

// Extract data safely (throws if not successful)
const student = unwrapApiResponse(response);
const students = unwrapPaginatedResponse(paginatedResponse);
```

## Migration Checklist

- [ ] Import types from `@/types/api`
- [ ] Update method return types to `ApiResponse<T>` or `PaginatedResponse<T>`
- [ ] Add generic type parameters to API calls
- [ ] Replace `response.data` with proper typing
- [ ] Add type guards for error handling
- [ ] Update tests to use wrapper utilities
- [ ] Remove `any` types
- [ ] Verify no TS2339 errors

## Common Issues

### Issue: TS2339 on response.data
**Solution:** Ensure method returns `ApiResponse<T>` not `any`
```typescript
// ❌ Wrong
async getStudent(id: string): Promise<any>

// ✅ Correct
async getStudent(id: string): Promise<ApiResponse<Student>>
```

### Issue: Type narrowing not working
**Solution:** Use type guards instead of direct boolean checks
```typescript
// ❌ Wrong
if (response.success) { /* TypeScript doesn't narrow */ }

// ✅ Correct
if (isSuccessResponse(response)) { /* Type narrowed */ }
```

### Issue: Can't access pagination properties
**Solution:** Use `PaginatedResponse<T>` not `ApiResponse<T[]>`
```typescript
// ❌ Wrong
async getAll(): Promise<ApiResponse<Student[]>>

// ✅ Correct
async getAll(): Promise<PaginatedResponse<Student>>
```

## Files Reference

- **Type Definitions:** `frontend/src/types/api/responses.ts`
- **Mutation Types:** `frontend/src/types/api/mutations.ts`
- **Exports & Guards:** `frontend/src/types/api/index.ts`
- **Full Documentation:** `frontend/src/types/api/README.md`
- **Type Guards:** `frontend/src/services/utils/typeGuards.ts`

## Examples Repository

See `studentsApi.ts` for complete implementation examples of:
- Standard CRUD operations
- Pagination handling
- Error handling patterns
- Audit logging integration
- Type-safe API calls
