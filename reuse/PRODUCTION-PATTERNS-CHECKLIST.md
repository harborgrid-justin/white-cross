# Production-Ready Data Layer Functions Checklist

## Quick Reference for Creating New Reusable Functions

### Phase 1: File Setup

- [ ] Create file with proper naming convention:
  - Kit/Utils files: `{name}-kit.ts` or `{name}-utils.ts`
  - Composite files: `{name}-composite.ts`
  - Downstream services: `{service-name}-{type}.ts`
  - Models: `{entity}.model.ts`
  - DTOs: `{operation}-{entity}.dto.ts`
  - Types: `{domain}.types.ts`

- [ ] Add standard file header with:
  ```typescript
  /**
   * LOC: {UNIQUE_CODE}
   * File: /reuse/{path}/{filename}.ts
   *
   * UPSTREAM (imports from):
   *   - List all direct dependencies
   *
   * DOWNSTREAM (imported by):
   *   - List all consuming services
   */
  
  /**
   * File: /reuse/{path}/{filename}.ts
   * Locator: WC-{CATEGORY}-{CODE}-001
   * Purpose: Clear description
   * Upstream: Direct dependencies
   * Downstream: Services that use this
   * Dependencies: TypeScript 5.x, Node 18+, relevant packages
   * Exports: What is exported
   * LLM Context: Comprehensive description for AI/LLM usage
   */
  ```

### Phase 2: Imports & Structure

- [ ] Import from NestJS with proper structure:
  ```typescript
  import { Controller, Get, Post, Injectable, Logger } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  ```

- [ ] Controllers use `@Controller` with versioned routes:
  ```typescript
  @Controller('api/v1/resource-name')
  @ApiTags('Resource Category')
  @ApiBearerAuth()
  export class ResourceController { }
  ```

- [ ] Services use `@Injectable()` with logger:
  ```typescript
  @Injectable()
  export class ResourceService {
    private readonly logger = new Logger(ResourceService.name);
  }
  ```

### Phase 3: Data Transfer Objects (DTOs)

- [ ] Create separate DTOs for Create, Update, Response:
  ```typescript
  export class CreateResourceDto {
    @ApiProperty({ description: '', example: '' })
    @IsString()
    @IsNotEmpty()
    fieldName: string;
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    optionalField?: string;
  }
  ```

- [ ] Every field has:
  - [ ] `@ApiProperty` or `@ApiPropertyOptional` decorator
  - [ ] class-validator decorator (`@IsString`, `@IsNumber`, etc.)
  - [ ] `@IsOptional()` for optional fields
  - [ ] `@Type(() => Date)` for date fields

- [ ] DTOs extend `BaseDto` if needed:
  ```typescript
  export class CreateResourceDto extends BaseDto {
    // fields
  }
  ```

### Phase 4: Type Definitions

- [ ] Create `{entity}.types.ts` with:
  - [ ] Enums with database-compatible values:
    ```typescript
    export enum ResourceStatus {
      ACTIVE = 'active',
      INACTIVE = 'inactive',
    }
    ```
  - [ ] Interfaces for core types
  - [ ] Types for union types or complex structures

### Phase 5: Sequelize Models (if database)

- [ ] Create `{entity}.model.ts` with:
  ```typescript
  @Table({
    tableName: 'resources',
    timestamps: true,
    indexes: [{ fields: ['status'] }],
  })
  export class Resource extends Model<Resource> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;
    
    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;
    
    @AllowNull(false)
    @Default({})
    @Column(DataType.JSON)
    metadata: Record<string, any>;
  }
  ```

### Phase 6: Controller Methods

- [ ] Every endpoint documented with Swagger:
  ```typescript
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create resource' })
  @ApiBody({ type: CreateResourceDto })
  @ApiResponse({ status: 201, description: 'Resource created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body(ValidationPipe) dto: CreateResourceDto) {
    // Implementation
  }
  ```

- [ ] All endpoints use:
  - [ ] `@ApiOperation` with summary
  - [ ] `@ApiResponse` for all status codes (200, 201, 400, 401, 403, 404, 500)
  - [ ] `@ApiBody` for request body
  - [ ] `@ApiParam` for URL parameters
  - [ ] `@ApiQuery` for query parameters
  - [ ] `ValidationPipe` on body

### Phase 7: Service Implementation

- [ ] Every method has try-catch:
  ```typescript
  async create(dto: CreateResourceDto): Promise<Resource> {
    try {
      this.logger.log(`Creating resource: ${JSON.stringify(dto)}`);
      // Implementation
      this.logger.log(`Resource created successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create resource: ${error.message}`, error.stack);
      throw new BadRequestError('User-friendly message', { details: error });
    }
  }
  ```

- [ ] Logging includes:
  - [ ] Operation start with input metadata
  - [ ] Operation completion
  - [ ] Error logging with stack trace

- [ ] Error handling:
  - [ ] Import error classes from `_production-patterns`
  - [ ] Use appropriate error class (BadRequestError, NotFoundError, etc.)
  - [ ] Include user-friendly message
  - [ ] Log full error details internally

### Phase 8: Response Handling

- [ ] Single item responses use:
  ```typescript
  return createSuccessResponse(data, requestId);
  return createCreatedResponse(newData, requestId);
  ```

- [ ] List responses use:
  ```typescript
  return createPaginatedResponse(items, total, page, pageSize, requestId);
  ```

- [ ] Error responses use standard format:
  ```typescript
  throw new BadRequestError('message', { details });
  ```

### Phase 9: Documentation

- [ ] Add JSDoc comments to public functions:
  ```typescript
  /**
   * Create a new resource
   * @param dto - Data transfer object with resource details
   * @returns Created resource
   * @throws BadRequestError if validation fails
   * @throws ConflictError if resource already exists
   */
  async create(dto: CreateResourceDto): Promise<Resource> { }
  ```

- [ ] Include examples in JSDoc for complex operations

### Phase 10: HIPAA Compliance (Healthcare)

- [ ] Errors use `sanitizeErrorForHIPAA()` to prevent PHI leakage
- [ ] Audit logging uses `createHIPAALog()`:
  ```typescript
  const auditLog = createHIPAALog(userId, 'READ', 'Patient', patientId, 'SUCCESS', requestId, 'ALLOWED');
  ```

- [ ] Sensitive data marked in metadata

### Phase 11: Testing & Validation

- [ ] File passes production audit checklist:
  - [ ] File header present and complete
  - [ ] Error handling (minimum 1 try-catch per method)
  - [ ] API documentation (@ApiTags, @ApiOperation, @ApiResponse)
  - [ ] Logging (logger creation, operation logging)
  - [ ] Validation (input validators, DTOs)

- [ ] TypeScript compilation successful:
  ```bash
  tsc --noEmit
  ```

- [ ] No ESLint violations:
  ```bash
  npm run lint
  ```

### Phase 12: Exports & Integration

- [ ] Export all public classes/functions:
  ```typescript
  export { ResourceController };
  export { ResourceService };
  export { CreateResourceDto, UpdateResourceDto };
  export { Resource };
  export type { IResource };
  ```

- [ ] Add to barrel export if needed:
  ```typescript
  // index.ts
  export * from './resource.controller';
  export * from './resource.service';
  ```

---

## Common Patterns Quick Lookup

### Error Response Template
```typescript
{
  success: false,
  statusCode: 400,
  error: {
    code: 'BAD_REQUEST',
    message: 'User-friendly error message',
    details: { field: 'value' },
    context: 'requestId'
  },
  timestamp: Date,
  path: '/api/endpoint',
  requestId: 'req_123_abc'
}
```

### Success Response Template
```typescript
{
  success: true,
  statusCode: 200,
  data: { /* entity data */ },
  timestamp: Date,
  requestId: 'req_123_abc'
}
```

### Pagination Response Template
```typescript
{
  success: true,
  statusCode: 200,
  data: [ /* items */ ],
  pagination: {
    total: 100,
    page: 1,
    pageSize: 20,
    totalPages: 5,
    hasMore: true
  },
  timestamp: Date,
  requestId: 'req_123_abc'
}
```

### Standard HTTP Status Codes to Document
- 200: Success (GET, PUT, PATCH)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request (validation failed)
- 401: Unauthorized (authentication failed)
- 403: Forbidden (authorization failed)
- 404: Not Found (resource doesn't exist)
- 409: Conflict (resource already exists)
- 500: Internal Server Error (unexpected error)

### File Structure Template
```typescript
/**
 * LOC: XYZ001
 * File: /reuse/domain/resource.ts
 * UPSTREAM: @nestjs/common, @nestjs/swagger
 * DOWNSTREAM: controllers, services, gateways
 */

import { /* NestJS imports */ } from '@nestjs/common';
import { /* Swagger imports */ } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface IResource { }
export enum ResourceStatus { }

// ============================================================================
// DTOS
// ============================================================================

export class CreateResourceDto { }
export class UpdateResourceDto { }

// ============================================================================
// SERVICE
// ============================================================================

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  async create(dto: CreateResourceDto): Promise<IResource> {
    try {
      // Implementation
      return result;
    } catch (error) {
      this.logger.error(`Failed: ${error.message}`, error.stack);
      throw new BadRequestError('Message', { details: error });
    }
  }
}

// ============================================================================
// CONTROLLER
// ============================================================================

@Controller('api/v1/resources')
@ApiTags('Resources')
@ApiBearerAuth()
export class ResourceController {
  constructor(private readonly service: ResourceService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create' })
  @ApiBody({ type: CreateResourceDto })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Body(ValidationPipe) dto: CreateResourceDto) {
    const result = await this.service.create(dto);
    return createCreatedResponse(result);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ResourceController };
export { ResourceService };
export { CreateResourceDto, UpdateResourceDto };
```

---

## Quick Validation Commands

```bash
# Check TypeScript compilation
npm run build

# Check linting
npm run lint

# Run tests
npm run test

# Generate API documentation
npm run generate:docs

# Validate DTOs
npm run validate:dtos
```

---

## Reference Files to Study

- **_production-patterns.ts** - Base patterns, error classes, response helpers
- **anomaly-detection-services.ts** - Good example of service + controller
- **advanced-correlation-api-controllers.ts** - Comprehensive API documentation
- **detection-engineering-services.ts** - Large production service (900+ LOC)
- **bid-solicitation.model.ts** - Sequelize model example
- **create-construction-closeout.dto.ts** - DTO example

All located in `/home/user/white-cross/reuse/`

