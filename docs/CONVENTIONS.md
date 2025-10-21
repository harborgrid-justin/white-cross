# Service Development Conventions

## Overview

This document defines the coding standards, patterns, and conventions for developing services in the White Cross healthcare platform. Following these conventions ensures consistency, maintainability, and quality across the codebase.

## File Structure & Naming

### Directory Organization

```
services/
├── modules/                   # Feature-specific services
│   ├── health/                # Domain-grouped services
│   │   ├── allergies.api.ts  # Individual service modules
│   │   └── index.ts          # Domain facade
│   └── [feature].api.ts      # Standalone services
├── core/                      # Base classes and utilities
├── types/                     # Shared TypeScript definitions
├── utils/                     # Helper functions
└── legacy/                    # Deprecated code (temporary)
```

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| **Files** | `camelCase.api.ts` | `allergies.api.ts` |
| **Classes** | `PascalCaseApiService` | `AllergiesApiService` |
| **Instances** | `camelCaseApi` | `allergiesApi` |
| **Interfaces** | `PascalCase` (no I prefix) | `Allergy`, `AllergyCreate` |
| **Types** | `PascalCase` | `AllergySeverity` |
| **Enums** | `PascalCase` | `HealthRecordType` |
| **Constants** | `UPPER_SNAKE_CASE` | `API_ENDPOINTS` |

## Service Class Pattern

### Basic Structure

```typescript
/**
 * [Service Name] API Service Module
 *
 * Purpose: [Clear description of service purpose]
 *
 * Features:
 * - [Feature 1]
 * - [Feature 2]
 *
 * @module services/modules/[path]
 */

import { BaseApiService } from '../../core/BaseApiService';
import { ApiClient } from '../../core/ApiClient';
import { z } from 'zod';
import type { ApiResponse } from '../../types';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface Entity {
  id: string;
  // ... properties
}

export interface EntityCreate {
  // ... creation properties
}

export interface EntityUpdate {
  // ... update properties (usually Partial<EntityCreate>)
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const entityCreateSchema = z.object({
  // ... validation rules
});

// ==========================================
// API SERVICE CLASS
// ==========================================

export class EntityApiService extends BaseApiService<
  Entity,
  EntityCreate,
  EntityUpdate
> {
  constructor() {
    const client = new ApiClient(apiInstance);
    super(client, '/api/entities', {
      createSchema: entityCreateSchema,
      updateSchema: entityUpdateSchema
    });
  }

  // Custom methods here
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const entityApi = new EntityApiService();
```

## Method Conventions

### Standard CRUD Methods

All services extending `BaseApiService` inherit these methods:

```typescript
// Get all with pagination and filters
getAll(filters?: FilterParams): Promise<PaginatedResponse<T>>

// Get single entity by ID
getById(id: string): Promise<T>

// Create new entity
create(data: TCreate): Promise<T>

// Update existing entity
update(id: string, data: TUpdate): Promise<T>

// Delete entity
delete(id: string): Promise<void>
```

### Custom Method Patterns

```typescript
// Student-specific resources
getStudent[Resource](
  studentId: string,
  filters?: FilterParams
): Promise<Resource[]>

// Latest/most recent
getLatest[Resource](identifier: string): Promise<Resource | null>

// Bulk operations
bulk[Operation](items: T[]): Promise<BulkResult>

// Export operations
export[Resource](options: ExportOptions): Promise<Blob>

// Import operations
import[Resource](file: File, format: string): Promise<ImportResult>

// Verification/validation
verify[Resource](id: string, data: VerifyData): Promise<Resource>

// Status checks
check[Condition](params: CheckParams): Promise<CheckResult>

// Report generation
generate[Report](params: ReportParams): Promise<Blob | ReportData>
```

## Type Definitions

### Interface Naming

```typescript
// Main entity
export interface Entity { }

// Creation DTO
export interface EntityCreate { }

// Update DTO (usually partial)
export interface EntityUpdate extends Partial<EntityCreate> { }

// Filter parameters
export interface EntityFilters extends PaginationParams { }

// Response types
export interface EntityResponse extends ApiResponse<Entity> { }

// Specialized types
export interface EntitySummary { }
export interface EntityDetails extends Entity { }
export interface EntityStatistics { }
```

### Enum Conventions

```typescript
// Use string enums for API compatibility
export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

// Or TypeScript enums when needed
export enum EntityType {
  TYPE_ONE = 'TYPE_ONE',
  TYPE_TWO = 'TYPE_TWO'
}
```

## Validation

### Using Zod Schemas

```typescript
import { z } from 'zod';

const schema = z.object({
  // Required fields
  name: z.string().min(1, 'Name is required').max(100),

  // Optional fields
  description: z.string().max(500).optional(),

  // Enums
  status: z.enum(['ACTIVE', 'INACTIVE']),

  // Numbers with constraints
  age: z.number().int().min(0).max(150),

  // Dates
  dateOfBirth: z.string().datetime(),

  // Arrays
  tags: z.array(z.string()).max(10),

  // Nested objects
  address: z.object({
    street: z.string(),
    city: z.string()
  }).optional(),

  // Custom validation
  email: z.string().email('Invalid email format'),

  // Regex patterns
  phoneNumber: z.string().regex(/^\d{3}-\d{3}-\d{4}$/)
});
```

## Error Handling

### Error Classes

```typescript
// Base error class
export class ServiceApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ServiceApiError';
  }
}

// Specific error types
export class UnauthorizedError extends ServiceApiError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ValidationError extends ServiceApiError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
```

### Error Handling Pattern

```typescript
async someMethod(): Promise<Result> {
  try {
    // Validate input
    schema.parse(input);

    // Make API call
    const response = await this.client.post('/endpoint', data);

    // Process and return
    return this.extractData(response);

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        `Validation failed: ${error.errors[0].message}`
      );
    }

    // Handle API errors
    if (error.response) {
      throw new ServiceApiError(
        error.response.data.message || 'API request failed',
        error.response.status
      );
    }

    // Re-throw sanitized error
    throw this.sanitizeError(error);
  }
}
```

## PHI/PII Protection

### Logging PHI Access

```typescript
private async logPHIAccess(
  action: string,
  studentId: string,
  recordType: string = 'DEFAULT',
  recordId?: string
): Promise<void> {
  try {
    await this.client.post('/api/audit/phi-access', {
      action,
      studentId,
      recordType,
      recordId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Log but don't throw - audit failures shouldn't break operations
    console.error('Failed to log PHI access:', error);
  }
}

// Use in methods
async getStudentData(studentId: string): Promise<Data> {
  const data = await this.fetchData(studentId);
  await this.logPHIAccess('VIEW_STUDENT_DATA', studentId);
  return data;
}
```

### Error Sanitization

```typescript
private sanitizeError(error: any): Error {
  // Never expose sensitive data in errors
  const message = this.extractSafeErrorMessage(error);

  // Remove any PHI/PII from error
  const sanitized = message
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
    .replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, '[NAME]')
    .replace(/\b\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd)\b/gi, '[ADDRESS]');

  return new Error(sanitized);
}
```

## Testing

### Unit Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { allergiesApi } from '../allergies.api';

describe('AllergiesApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStudentAllergies', () => {
    it('should fetch allergies for a student', async () => {
      // Arrange
      const studentId = 'test-student-123';
      const mockAllergies = [/* mock data */];

      vi.spyOn(allergiesApi, 'getStudentAllergies')
        .mockResolvedValue(mockAllergies);

      // Act
      const result = await allergiesApi.getStudentAllergies(studentId);

      // Assert
      expect(result).toEqual(mockAllergies);
      expect(allergiesApi.getStudentAllergies).toHaveBeenCalledWith(studentId);
    });

    it('should handle errors gracefully', async () => {
      // Test error scenarios
    });
  });
});
```

## Documentation

### JSDoc Comments

```typescript
/**
 * Get student allergies with optional filtering
 *
 * @param studentId - The student's unique identifier
 * @param filters - Optional filters to apply
 * @returns Promise resolving to array of allergies
 *
 * @example
 * ```typescript
 * const allergies = await allergiesApi.getStudentAllergies(
 *   'student-123',
 *   { severity: 'SEVERE', isActive: true }
 * );
 * ```
 *
 * @throws {UnauthorizedError} If user lacks permission
 * @throws {NotFoundError} If student doesn't exist
 */
async getStudentAllergies(
  studentId: string,
  filters?: AllergyFilters
): Promise<Allergy[]> {
  // Implementation
}
```

## Performance

### Caching Strategy

```typescript
import { withCache } from '../../utils/cache';

// Cache frequently accessed data
async getStaticData(): Promise<Data> {
  return withCache(
    'static-data-key',
    () => this.fetchStaticData(),
    { ttl: 3600 } // 1 hour
  );
}
```

### Pagination

```typescript
// Always use pagination for lists
async getAll(params: PaginationParams = {}): Promise<PaginatedResponse<T>> {
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'desc'
  } = params;

  // Apply limits
  const safeLimit = Math.min(limit, 100); // Max 100 items

  return this.fetch({ page, limit: safeLimit, sort, order });
}
```

## Service Registration

### With Service Registry

```typescript
import { serviceRegistry } from '../../core/ServiceRegistry';
import { RegisterService } from '../../core/ServiceRegistry';

// Manual registration
serviceRegistry.registerService(
  'allergiesApi',
  allergiesApi,
  {
    name: 'allergiesApi',
    version: '1.0.0',
    description: 'Allergy management service',
    endpoint: '/api/health-records/allergies',
    category: 'HEALTH',
    dependencies: ['authApi']
  }
);

// Or use decorator
@RegisterService({
  name: 'allergiesApi',
  version: '1.0.0',
  // ... metadata
})
export class AllergiesApiService {
  // ...
}
```

## Migration Guidelines

### From Monolithic to Modular

```typescript
// Step 1: Identify the domain
// OLD: healthRecordsApi.getAllergies()
// NEW: allergiesApi.getStudentAllergies()

// Step 2: Create compatibility layer
export class HealthRecordsApi {
  // Delegate to new services
  getAllergies = allergiesApi.getStudentAllergies.bind(allergiesApi);
}

// Step 3: Add deprecation warning
/**
 * @deprecated Use allergiesApi.getStudentAllergies() instead
 */
getAllergies() {
  console.warn('[DEPRECATED] Use allergiesApi.getStudentAllergies()');
  return allergiesApi.getStudentAllergies();
}
```

## Code Review Checklist

Before submitting a service for review:

- [ ] Extends BaseApiService where appropriate
- [ ] Has comprehensive TypeScript types
- [ ] Includes Zod validation schemas
- [ ] Implements error handling
- [ ] Logs PHI access where needed
- [ ] Sanitizes errors properly
- [ ] Has JSDoc comments
- [ ] Includes unit tests
- [ ] Follows naming conventions
- [ ] Registered with ServiceRegistry
- [ ] Has backward compatibility if replacing existing service
- [ ] Performance optimizations applied (caching, pagination)
- [ ] No console.log statements (use proper logging)
- [ ] No hardcoded values (use config)
- [ ] No exposed sensitive data

## Common Pitfalls to Avoid

1. **Don't expose PHI in errors**
2. **Don't skip validation**
3. **Don't forget to log PHI access**
4. **Don't use any type**
5. **Don't ignore error handling**
6. **Don't create massive service files (>500 lines)**
7. **Don't mix UI components with services**
8. **Don't use synchronous operations for I/O**
9. **Don't forget pagination for lists**
10. **Don't hardcode configuration values**

## Resources

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Zod Documentation](https://zod.dev/)
- [HIPAA Compliance Guidelines](https://www.hhs.gov/hipaa/for-professionals/security/guidance/index.html)
- [REST API Best Practices](https://restfulapi.net/resource-naming/)
- [Service-Oriented Architecture Patterns](https://martinfowler.com/eaaCatalog/)