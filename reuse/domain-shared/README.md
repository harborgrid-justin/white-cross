# Domain Shared Types and Utilities

## Overview
This directory contains shared type definitions, interfaces, and utilities used across all domain-specific kits (construction, consulting, and engineer). These shared resources ensure consistency, reduce code duplication, and provide a foundation for type-safe domain development.

## Contents

### Type Definitions (`types/`)

#### base-entity.ts
Foundational entity types and interfaces:
- `BaseEntity` - Base interface with common fields (id, audit metadata)
- `AuditMetadata` - Timestamp and user tracking for all entities
- `CommonStatus` - Standard status enum values
- `Priority` - Priority levels (critical, high, medium, low)
- `ApprovalStatus` - Workflow approval states
- `ApprovableEntity` - Interface for approval workflows
- `VersionedEntity` - Interface for versioned entities
- `EntityWithAttachments` - Interface for entities with file attachments
- `Attachment` - File attachment metadata
- `Address` - Standard address information
- `ContactInfo` - Contact information structure
- `MoneyAmount` - Currency and amount representation
- `DateRange` - Start and end date pairs
- `PaginationParams` - Pagination query parameters
- `PaginationMeta` - Pagination metadata
- `PaginatedResponse<T>` - Generic paginated response wrapper
- `SortParams` - Sorting parameters
- `FilterOperator` - Query filter operators
- `FilterCondition` - Generic filter conditions
- `ListQueryParams` - Combined list query parameters

#### validation-dtos.ts
Common validation DTO base classes:
- `BaseDTO` - Base DTO with audit fields
- `CreateDTO` - Base for create operations
- `UpdateDTO` - Base for update operations
- `AddressDTO` - Validated address DTO
- `ContactInfoDTO` - Validated contact information DTO
- `MoneyAmountDTO` - Validated money amount DTO
- `DateRangeDTO` - Validated date range DTO
- `PaginationQueryDTO` - Pagination query validation
- `SortQueryDTO` - Sort query validation
- `SearchQueryDTO` - Search query validation
- `ListQueryDTO` - Combined list query with pagination, sorting, and search
- `AttachmentDTO` - File attachment validation
- `BulkOperationDTO` - Bulk operation validation
- `BulkDeleteDTO` - Bulk delete validation

## Usage

### TypeScript Path Alias
Import shared types using the `@domain-shared` alias:

```typescript
import {
  BaseEntity,
  CommonStatus,
  Priority,
  PaginatedResponse,
  BaseDTO,
  ListQueryDTO,
  AddressDTO
} from '@domain-shared';
```

### Direct Import
Alternatively, import directly from the module:

```typescript
import { BaseEntity } from '../domain-shared/types/base-entity';
import { BaseDTO } from '../domain-shared/types/validation-dtos';
```

## Examples

### Using Base Entity
```typescript
import { BaseEntity, CommonStatus } from '@domain-shared';

interface Project extends BaseEntity {
  name: string;
  status: CommonStatus;
  budget: number;
}

const project: Project = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Hospital Renovation',
  status: CommonStatus.IN_PROGRESS,
  budget: 2000000,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'user-123',
  updatedBy: 'user-123',
  isActive: true
};
```

### Using Pagination
```typescript
import { PaginatedResponse, PaginationParams } from '@domain-shared';

async function getProjects(
  params: PaginationParams
): Promise<PaginatedResponse<Project>> {
  const { page, limit } = params;
  const offset = (page - 1) * limit;

  const { rows, count } = await ProjectModel.findAndCountAll({
    limit,
    offset
  });

  return {
    data: rows,
    meta: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      hasNextPage: page < Math.ceil(count / limit),
      hasPreviousPage: page > 1
    }
  };
}
```

### Using Validation DTOs
```typescript
import { CreateDTO, AddressDTO, MoneyAmountDTO } from '@domain-shared';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateProjectDTO extends CreateDTO {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Project location' })
  @ValidateNested()
  @Type(() => AddressDTO)
  location: AddressDTO;

  @ApiProperty({ description: 'Project budget' })
  @ValidateNested()
  @Type(() => MoneyAmountDTO)
  budget: MoneyAmountDTO;
}
```

### Using List Query DTO
```typescript
import { ListQueryDTO, PaginatedResponse } from '@domain-shared';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('projects')
export class ProjectController {
  @Get()
  async findAll(
    @Query() query: ListQueryDTO
  ): Promise<PaginatedResponse<Project>> {
    const { page = 1, limit = 20, sortBy, sortOrder, search } = query;

    // Use query parameters to filter, sort, and paginate results
    return this.projectService.findAll({ page, limit, sortBy, sortOrder, search });
  }
}
```

## Integration with Domains

### Construction Domain
Used in construction project management, bid management, contract administration, etc.

### Consulting Domain
Used in strategic planning, business transformation, risk management, etc.

### Engineer Domain
Used in asset lifecycle, project tracking, work orders, etc.

## Benefits

1. **Type Safety**: Consistent interfaces across all domains
2. **Code Reuse**: Avoid duplicating common type definitions
3. **Maintainability**: Single source of truth for shared types
4. **Consistency**: Standardized patterns across all domain kits
5. **Documentation**: Well-documented types with examples
6. **Validation**: Reusable DTO validation patterns

## Dependencies

- TypeScript 5.x
- class-validator ^0.14.1
- class-transformer ^0.5.1
- @nestjs/swagger ^8.1.0

## Version History

- **1.0.0** (2025-11-08): Initial release with base entity types and validation DTOs
