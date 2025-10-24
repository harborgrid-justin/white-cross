# Centralized API Response Type System

## Overview

This directory contains the centralized API response type system for the White Cross Healthcare Platform frontend. It provides consistent, type-safe interfaces for all API interactions.

## Purpose

The centralized type system resolves ~200 TS2339 errors by ensuring all API responses have consistent properties like `data`, `errors`, `status`, `success`, and `message`.

## Files

### `responses.ts`
Core response type definitions:
- `ApiResponse<T>` - Standard API response wrapper
- `SuccessResponse<T>` - Type-safe success responses
- `ErrorResponse` - Structured error responses
- `PaginatedResponse<T>` - List responses with pagination
- Response wrapper utilities
- Specialized response types (file upload, export, health check)

### `mutations.ts`
GraphQL mutation response types:
- `CreateMutationResult<T>` - Create operation results
- `UpdateMutationResult<T>` - Update operation results
- `DeleteMutationResult<T>` - Delete operation results
- `BulkMutationResult<T>` - Bulk operation results
- Specialized mutations (transfer, activation, import)
- Optimistic update support
- Audit trail information

### `index.ts`
Centralized exports and type guards:
- Re-exports all types from `responses.ts` and `mutations.ts`
- Type guard functions for runtime type checking
- Convenient single import location

## Usage Patterns

### Standard API Response

```typescript
import { ApiResponse } from '@/types/api';

// Define a service method
async getStudent(id: string): Promise<ApiResponse<Student>> {
  const response = await apiClient.get<ApiResponse<Student>>(`/students/${id}`);
  return response.data;
}

// Use the response
const response = await studentsApi.getStudent('123');
if (response.success) {
  console.log(response.data); // Student object
} else {
  console.error(response.errors); // Error details
}
```

### Paginated Response

```typescript
import { PaginatedResponse } from '@/types/api';

// Define a list endpoint
async getStudents(filters: StudentFilters): Promise<PaginatedResponse<Student>> {
  const response = await apiClient.get<PaginatedResponse<Student>>('/students', {
    params: filters
  });
  return response.data;
}

// Use the paginated response
const response = await studentsApi.getStudents({ page: 1, limit: 10 });
console.log(response.data); // Student[]
console.log(response.pagination.total); // Total count
console.log(response.pagination.hasNext); // Has more pages?
```

### Error Handling with Type Guards

```typescript
import { isErrorResponse, isSuccessResponse } from '@/types/api';

try {
  const response = await studentsApi.createStudent(data);

  if (isSuccessResponse(response)) {
    // TypeScript knows response.success is true
    console.log('Created:', response.data);
  } else if (isErrorResponse(response)) {
    // TypeScript knows response has errors array
    response.errors.forEach(error => {
      console.error(`${error.field}: ${error.message}`);
    });
  }
} catch (error) {
  // Handle network errors, etc.
}
```

### Mutation Results

```typescript
import { CreateMutationResult, UpdateMutationResult } from '@/types/api';

// Create mutation
const createResult: CreateMutationResult<Student> = {
  id: '123',
  success: true,
  message: 'Student created successfully',
  data: { id: '123', firstName: 'John', lastName: 'Doe' },
  operation: 'create'
};

// Update mutation with change tracking
const updateResult: UpdateMutationResult<Student> = {
  id: '123',
  success: true,
  message: 'Student updated successfully',
  data: { id: '123', firstName: 'Jane', lastName: 'Doe' },
  previousData: { id: '123', firstName: 'John', lastName: 'Doe' },
  changedFields: ['firstName'],
  operation: 'update'
};
```

### Bulk Operations

```typescript
import { BulkMutationResult } from '@/types/api';

const result: BulkMutationResult<Student> = {
  success: true,
  message: 'Bulk update completed with 2 failures',
  successful: 48,
  failed: 2,
  total: 50,
  results: [
    { id: '1', success: true, message: 'Updated' },
    { id: '2', success: false, message: 'Not found', errors: [...] }
  ],
  successfulIds: ['1', '3', '4', ...],
  failedIds: ['2', '5'],
  operation: 'bulk'
};
```

### Response Wrapper Utilities

```typescript
import {
  wrapSuccessResponse,
  createErrorResponse,
  unwrapApiResponse
} from '@/types/api';

// Create mock responses for testing
const mockResponse = wrapSuccessResponse(
  { id: '123', name: 'John' },
  'Student retrieved successfully'
);

// Create error responses
const errorResponse = createErrorResponse(
  'Validation failed',
  [
    { field: 'email', message: 'Email is required', code: 'REQUIRED' },
    { field: 'grade', message: 'Invalid grade', code: 'INVALID' }
  ],
  400,
  'VALIDATION_ERROR'
);

// Safely extract data
try {
  const student = unwrapApiResponse(response);
  // student is of type Student
} catch (error) {
  // Handle error
}
```

### Type Guards

```typescript
import {
  isApiResponse,
  isPaginatedResponse,
  isMutationSuccess
} from '@/types/api';

// Check if object is an API response
if (isApiResponse(data)) {
  console.log(data.success, data.data);
}

// Check if response is paginated
if (isPaginatedResponse(data)) {
  console.log(data.pagination.total);
}

// Check if mutation succeeded
if (isMutationSuccess(result)) {
  console.log('Mutation succeeded:', result.data);
}
```

## Integration with Existing Code

### Backward Compatibility

The centralized types are re-exported from `@/types/api.ts` and `@/types/common.ts` for backward compatibility:

```typescript
// Old import (still works)
import { ApiResponse, PaginatedResponse } from '@/types/common';

// New import (recommended)
import { ApiResponse, PaginatedResponse } from '@/types/api';
```

### Updating Existing Services

To update an existing service to use the centralized types:

1. **Import the types:**
```typescript
import { ApiResponse, PaginatedResponse } from '@/types/api';
```

2. **Update method signatures:**
```typescript
// Before
async getStudents(): Promise<any> {
  const response = await apiClient.get('/students');
  return response.data;
}

// After
async getStudents(): Promise<PaginatedResponse<Student>> {
  const response = await apiClient.get<PaginatedResponse<Student>>('/students');
  return response.data;
}
```

3. **Update response handling:**
```typescript
// Before
const response = await studentsApi.getStudents();
console.log(response.data); // TS2339 error

// After
const response = await studentsApi.getStudents();
console.log(response.data); // No error - properly typed as Student[]
```

## Type Safety Benefits

### 1. Compile-Time Error Detection
```typescript
const response: ApiResponse<Student> = await api.get('/students/123');

// ✅ TypeScript knows these properties exist
console.log(response.data.firstName);
console.log(response.success);
console.log(response.message);

// ❌ TypeScript catches typos
console.log(response.datta); // Error: Property 'datta' does not exist
```

### 2. IntelliSense Support
IDE autocomplete works correctly with properly typed responses:
- `response.` shows: `data`, `success`, `message`, `status`, `errors`
- `response.data.` shows all Student properties
- `response.pagination.` shows pagination properties

### 3. Refactoring Safety
Changing a type propagates through all usages:
```typescript
// If Student interface changes
interface Student {
  id: string;
  fullName: string; // Changed from firstName/lastName
  // ...
}

// TypeScript highlights all places that need updates
const response: ApiResponse<Student> = await api.get('/students/123');
console.log(response.data.firstName); // Error: Property does not exist
```

## Error Handling Patterns

### Pattern 1: Type Guard in Try-Catch
```typescript
try {
  const response = await api.post('/students', data);

  if (isSuccessResponse(response)) {
    toast.success(response.message);
    return response.data;
  } else if (isErrorResponse(response)) {
    showValidationErrors(response.errors);
  }
} catch (error) {
  if (isNetworkError(error)) {
    toast.error('Network connection failed');
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

### Pattern 2: Response Success Check
```typescript
const response = await api.get<ApiResponse<Student>>('/students/123');

if (!response.success) {
  throw new Error(response.errors?.[0]?.message || 'Request failed');
}

// TypeScript knows response.data exists here
return response.data;
```

### Pattern 3: Unwrap with Utility
```typescript
try {
  const response = await api.get<ApiResponse<Student>>('/students/123');
  const student = unwrapApiResponse(response); // Throws if not successful
  return student;
} catch (error) {
  handleError(error);
}
```

## Testing Examples

### Mock API Responses
```typescript
import { wrapSuccessResponse, wrapPaginatedResponse } from '@/types/api';

// Mock single item response
const mockStudent = { id: '123', firstName: 'John', lastName: 'Doe' };
const mockResponse = wrapSuccessResponse(mockStudent);

// Mock paginated response
const mockStudents = [mockStudent, /* ... */];
const mockPaginatedResponse = wrapPaginatedResponse(
  mockStudents,
  1,  // page
  10, // limit
  156 // total
);

// Use in tests
test('getStudent returns student data', async () => {
  apiClient.get = jest.fn().mockResolvedValue({ data: mockResponse });

  const result = await studentsApi.getStudent('123');
  expect(result.data).toEqual(mockStudent);
});
```

## Best Practices

1. **Always specify the generic type parameter:**
   ```typescript
   // ✅ Good
   const response: ApiResponse<Student> = await api.get('/students/123');

   // ❌ Avoid
   const response: ApiResponse = await api.get('/students/123');
   ```

2. **Use type guards for runtime checking:**
   ```typescript
   // ✅ Good
   if (isSuccessResponse(response)) {
     console.log(response.data);
   }

   // ❌ Avoid
   if (response.success) {
     console.log(response.data); // TypeScript can't narrow type
   }
   ```

3. **Leverage response utilities:**
   ```typescript
   // ✅ Good
   const student = unwrapApiResponse(response);

   // ❌ Avoid
   const student = response.success ? response.data : null;
   ```

4. **Document unusual response structures:**
   ```typescript
   /**
    * Get student with nested relationships
    * Response includes nested emergency contacts and medications
    */
   async getStudentDetails(id: string): Promise<ApiResponse<StudentWithRelations>> {
     // ...
   }
   ```

## Migration Checklist

When migrating a service to use centralized types:

- [ ] Import types from `@/types/api`
- [ ] Update all method return types
- [ ] Add generic type parameters to API calls
- [ ] Update response property access
- [ ] Add type guards for error handling
- [ ] Update tests to use type-safe mocks
- [ ] Remove `any` types
- [ ] Verify no TS2339 errors remain

## Additional Resources

- [TypeScript Handbook - Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [API Design Best Practices](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [Error Handling Patterns](https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript)

## Support

For questions or issues with the type system:
1. Check this documentation
2. Review example usage in `studentsApi.ts`
3. Consult the type definitions in `responses.ts` and `mutations.ts`
4. Ask in the development team channel
