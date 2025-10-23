# Frontend API Integration - Quick Reference
**For Developers Working on API Issues**

---

## Top Priority Issues (Fix First)

### 🔴 P0 - CRITICAL (Fix This Week)

#### 1. Missing Timeout Configuration
**File**: `frontend/src/services/modules/studentsApi.ts` (and others)
**Issue**: No explicit timeout for patient safety operations
**Fix**:
```typescript
// BEFORE
const response = await this.client.get('/api/students');

// AFTER
const response = await this.client.get('/api/students', { timeout: 10000 });
```
**Apply to**: All medication, emergency, and health record operations

#### 2. Type Mismatch - BackendApiResponse
**File**: `frontend/src/services/modules/studentsApi.ts:35-42`
**Issue**: Custom interface conflicts with global ApiResponse
**Fix**:
```typescript
// REMOVE this interface
interface BackendApiResponse<T> { ... }

// USE this instead
import { ApiResponse } from '@/services/core/ApiClient';
const response = await this.client.get<ApiResponse<StudentData>>(...);
```

#### 3. Hardcoded API Endpoints
**File**: `frontend/src/services/index.ts:328-444`
**Issue**: inventoryApi, vendorApi, purchaseOrderApi have hardcoded `/api` prefixes
**Fix**:
```typescript
// BEFORE
const response = await apiInstance.get('/api/inventory', { params });

// AFTER
const response = await apiInstance.get(API_ENDPOINTS.INVENTORY.BASE, { params });
```

---

## 🟠 P1 - HIGH PRIORITY (Fix This Sprint)

### 4. Broken inventoryApi Integration
**File**: `frontend/src/services/index.ts:317-444`
**Issue**: Bypasses ApiClient, no retry/circuit breaker
**Fix**: Refactor to proper API service class
```typescript
export class InventoryApi extends BaseApiService<InventoryItem, CreateInventoryRequest> {
  constructor(client: ApiClient) {
    super(client, API_ENDPOINTS.INVENTORY.BASE);
  }
  // Move all methods here
}
```

### 5. Missing Retry Logic for Medication Administration
**File**: `frontend/src/services/modules/medicationsApi.ts:586-632`
**Issue**: Critical operation has no explicit retry policy
**Fix**:
```typescript
const response = await withRetry(
  () => this.client.post(API_ENDPOINTS.MEDICATIONS.BASE + '/administration', logData),
  { maxRetries: 5, retryDelay: 2000, exponentialBackoff: true }
);
```

### 6. Unsafe Type Assertions (!)
**File**: `frontend/src/services/modules/healthRecordsApi.ts` (multiple lines)
**Issue**: Non-null assertion operator suppresses type safety
**Fix**:
```typescript
// BEFORE
return response.data.data!;

// AFTER
const data = response.data.data;
if (!data) {
  throw createApiError(new Error('No data returned'), 'Operation failed');
}
return data;
```

---

## 🟡 P2 - MEDIUM PRIORITY (Fix This Quarter)

### 7. Inconsistent Error Handling
**Pattern to Follow**:
```typescript
async someOperation(id: string): Promise<Data> {
  try {
    // 1. Validate input
    if (!id) throw createValidationError('ID required', 'id');

    // 2. Make API call with timeout
    const response = await this.client.get(`/endpoint/${id}`, { timeout: 10000 });

    // 3. Extract data safely
    const data = response.data.data;
    if (!data) throw createApiError(new Error('No data'), 'Fetch failed');

    // 4. Return
    return data;
  } catch (error) {
    // 5. Log for audit
    await auditService.logFailure(...);

    // 6. Create typed error
    throw createApiError(error, 'User-friendly message');
  }
}
```

### 8. Missing Runtime Validation
**Add Zod Validation**:
```typescript
import { z } from 'zod';

const responseSchema = z.object({
  students: z.array(studentSchema),
  pagination: paginationSchema
});

const response = await this.client.get(...);
const validated = responseSchema.parse(response.data.data);
return validated;
```

---

## Quick Fixes Checklist

When creating/modifying API service methods:

- [ ] Extends `BaseApiService<T, CreateDto, UpdateDto>`
- [ ] Uses `API_ENDPOINTS` constants (no hardcoded URLs)
- [ ] Specifies `timeout` for all operations
- [ ] Uses `createApiError()` for error handling
- [ ] Validates input parameters
- [ ] Implements audit logging for PHI operations
- [ ] Returns typed data (no `any`)
- [ ] No non-null assertions (`!`)
- [ ] Handles all error cases
- [ ] Includes JSDoc comments

---

## Code Templates

### New API Service Class
```typescript
import { BaseApiService } from '@/services/core/BaseApiService';
import { ApiClient, ApiResponse } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { createApiError } from '@/services/core/errors';
import { z } from 'zod';

// Define schemas
const createSchema = z.object({
  name: z.string().min(2),
  // ...
});

const updateSchema = createSchema.partial();

// Define interfaces
export interface Entity {
  id: string;
  name: string;
  // ...
}

export interface CreateEntityDto {
  name: string;
  // ...
}

// Create API service
export class EntityApi extends BaseApiService<Entity, CreateEntityDto> {
  constructor(client: ApiClient) {
    super(client, API_ENDPOINTS.ENTITY.BASE, {
      createSchema,
      updateSchema
    });
  }

  /**
   * Custom operation example
   */
  async customOperation(id: string): Promise<Entity> {
    try {
      // Validate
      if (!id) throw createValidationError('ID required', 'id');

      // API call with timeout
      const response = await this.client.post<ApiResponse<Entity>>(
        `${this.baseEndpoint}/${id}/action`,
        {},
        { timeout: 10000 }
      );

      // Extract data
      const data = response.data.data;
      if (!data) throw createApiError(new Error('No data'), 'Operation failed');

      // Audit log
      await this.logSuccess(AuditAction.CUSTOM_OP, id);

      return data;
    } catch (error) {
      await this.logFailure(AuditAction.CUSTOM_OP, id, error);
      throw createApiError(error, 'Custom operation failed');
    }
  }
}

// Export singleton
export const entityApi = new EntityApi(apiClient);
```

### Error Handling Template
```typescript
try {
  // Operation
  const response = await this.client.get(...);

  // Success audit
  await auditService.log({
    action: AuditAction.VIEW_RESOURCE,
    resourceType: AuditResourceType.ENTITY,
    resourceId: id,
    status: AuditStatus.SUCCESS
  });

  return response.data.data;
} catch (error) {
  // Failure audit
  await auditService.log({
    action: AuditAction.VIEW_RESOURCE,
    resourceType: AuditResourceType.ENTITY,
    resourceId: id,
    status: AuditStatus.FAILURE,
    context: { error: error.message }
  });

  // Re-throw as typed error
  throw createApiError(error, 'Failed to fetch resource');
}
```

---

## Testing Checklist

### Unit Tests
```typescript
describe('EntityApi', () => {
  it('should handle successful response', async () => {
    mockClient.get.mockResolvedValue({
      data: { success: true, data: mockEntity }
    });

    const result = await entityApi.getById('123');
    expect(result).toEqual(mockEntity);
  });

  it('should handle timeout error', async () => {
    mockClient.get.mockRejectedValue(new Error('Timeout'));

    await expect(entityApi.getById('123')).rejects.toThrow('Timeout');
  });

  it('should validate input', async () => {
    await expect(entityApi.getById('')).rejects.toThrow('ID required');
  });
});
```

### Integration Tests
```typescript
describe('EntityApi Integration', () => {
  it('should match backend contract', async () => {
    const response = await entityApi.getAll();
    expect(response).toMatchSchema(entityListSchema);
  });

  it('should handle rate limiting', async () => {
    // Make 100 rapid requests
    const promises = Array(100).fill(null).map(() => entityApi.getAll());

    // Should handle gracefully
    await expect(Promise.all(promises)).resolves.not.toThrow();
  });
});
```

---

## Common Patterns

### Pagination
```typescript
async getAll(filters: Filters): Promise<PaginatedResponse<Entity>> {
  const queryString = this.buildQueryParams(filters);
  const response = await this.client.get(`${this.baseEndpoint}?${queryString}`);
  return response.data.data;
}
```

### Search with Debounce
```typescript
import { debounce } from '@/services/utils/apiUtils';

const debouncedSearch = debounce(async (query: string) => {
  const response = await this.client.get(`${this.baseEndpoint}/search`, {
    params: { q: query },
    signal: abortController.signal
  });
  return response.data.data;
}, 300);
```

### Bulk Operations
```typescript
async bulkCreate(entities: CreateEntityDto[]): Promise<Entity[]> {
  // Validate all
  entities.forEach(entity => createSchema.parse(entity));

  // Batch API call
  const response = await this.client.post(
    `${this.baseEndpoint}/bulk`,
    { entities },
    { timeout: 30000 } // Longer timeout for bulk
  );

  return response.data.data.entities;
}
```

---

## Reference Links

- **Full Report**: `FRONTEND_API_INTEGRATION_REVIEW.md`
- **Tracking Files**: `.temp/completed/task-status-A9P1X5.json`
- **Integration Map**: `.temp/completed/integration-map-A9P1X5.json`

---

## Questions?

For detailed explanations, code examples, and architecture diagrams, see:
- `FRONTEND_API_INTEGRATION_REVIEW.md` - Complete findings
- `.temp/completed/completion-summary-A9P1X5.md` - Executive summary

**Agent**: API Architect (A9P1X5)
**Review Date**: October 23, 2025
