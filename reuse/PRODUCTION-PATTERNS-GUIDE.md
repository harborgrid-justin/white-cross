# White Cross Reuse Directory: Production-Ready Patterns & Conventions Guide

## Executive Summary

The `/home/user/white-cross/reuse` directory is a **production-grade, enterprise-wide reusable function library** containing:
- **3,186 TypeScript files** across 433+ utility kits
- **57,054+ lines of code** in the threat/composites/downstream directory alone
- **15,000+ exported functions**, classes, types, and interfaces
- **20 domain areas** covering healthcare, threat intelligence, construction, financial, and more
- **100% TypeScript 5.x + NestJS + Sequelize compatible**
- **HIPAA compliance** built into all patterns

---

## Part 1: File Organization & Naming Conventions

### 1.1 Root Directory Structure

```
reuse/
├── README.md                          # Main library documentation
├── FUNCTION-CATALOG.md                # Alphabetical listing of 15,000+ functions
├── NAVIGATION.md                      # Visual navigation guide
├── QUICK-REFERENCE.md                 # Copy-paste code examples
├── ORGANIZATION-PLAN.md               # Architecture overview
├── MASTER-INDEX.md                    # Catalog of all 433 kits
│
├── core/                              # Platform fundamentals
│   ├── api/                           # API design, versioning
│   ├── auth/                          # Authentication, RBAC
│   ├── cache/                         # Caching strategies
│   ├── config/                        # Configuration management
│   ├── database/                      # Sequelize patterns
│   ├── errors/                        # Error handling
│   └── validation/                    # Input validation
│
├── infrastructure/                    # Infrastructure services
│   ├── background-jobs/               # Job processing
│   ├── notifications/                 # Email, SMS, push
│   ├── payments/                      # Payment processing
│   ├── storage/                       # File storage (S3, Azure)
│   └── webhooks/                      # Webhook management
│
├── threat/                            # Threat intelligence domain
│   ├── threat-intelligence-kit.ts
│   ├── mitre-attack-kit.ts
│   ├── composites/
│   │   ├── advanced-threat-correlation-composite.ts
│   │   ├── anomaly-detection-core-composite.ts
│   │   └── downstream/                # Production-ready downstream services
│   │       ├── _production-patterns.ts
│   │       ├── _upgrade-templates.ts
│   │       └── [124 downstream service files].ts
│
├── construction/                      # Construction domain
│   ├── models/                        # 230 Sequelize models
│   ├── dto/                           # 50 Data Transfer Objects
│   ├── types/                         # 90 TypeScript type definitions
│   └── construction-project-management-kit.ts
│
├── education/                         # Education domain
│   └── composites/
│       └── downstream/                # Education-specific services
│
├── financial/                         # Financial services
│   ├── accounting/
│   ├── aml-compliance/
│   └── [40+ financial kits]
│
├── [domain-shared]/                   # Shared types and utilities
│   └── types/                         # Common TypeScript types
│
└── [20+ other domains]                # Healthcare, property, engineering, etc.
```

### 1.2 File Naming Conventions

#### TypeScript Files (Root Level)
**Pattern**: `{description}-kit.ts` or `{description}-utils.ts`

Examples:
- `sequelize-models-utils.ts` - Sequelize utilities
- `database-models-kit.ts` - Database model helpers
- `api-design-kit.ts` - API design patterns
- `api-documentation-kit.ts` - API documentation utilities
- `api-gateway-kit.ts` - API gateway patterns
- `rate-limiting-kit.ts` - Rate limiting implementation

#### Composite Files (Domain Level)
**Pattern**: `{description}-composite.ts`

Examples (in threat/composites/):
- `advanced-threat-correlation-composite.ts` - Core threat correlation logic
- `anomaly-detection-core-composite.ts` - Core anomaly detection algorithms
- `automated-response-orchestration-composite.ts` - Response automation

#### Downstream Service Files (Production-Ready)
**Pattern**: `{service-name}-{service-type}.ts` or `{domain}-{entity}-{function-type}.ts`

Examples (in threat/composites/downstream/):
- `advanced-correlation-api-controllers.ts` - REST API controllers
- `anomaly-detection-services.ts` - Service implementations
- `detection-engineering-services.ts` - Detection management services
- `api-gateway-services.ts` - API gateway services
- `_production-patterns.ts` - Shared production patterns

#### Model Files (Sequelize)
**Pattern**: `{entity-name}.model.ts`

Examples (in construction/models/):
- `bid-solicitation.model.ts`
- `bid-submission.model.ts`
- `activity-relationship.model.ts`
- `change-order.model.ts`

#### DTO Files (Data Transfer Objects)
**Pattern**: `{entity-name}.dto.ts` or `{operation}-{entity}.dto.ts`

Examples (in construction/dto/):
- `create-construction-closeout.dto.ts`
- `update-punch-list-item.dto.ts`
- `create-closeout-document.dto.ts`

#### Type Definition Files
**Pattern**: `{domain}.types.ts` or `{entity}.types.ts`

Examples (in construction/types/):
- `bid.types.ts` - Bid-related type definitions
- `closeout.types.ts` - Closeout-related types

---

## Part 2: File Header Documentation Pattern

### 2.1 Standard File Header Format

Every production-ready file starts with a structured header:

```typescript
/**
 * LOC: {UNIQUE_CODE}
 * File: /reuse/{path}/{filename}.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - [other dependencies]
 *
 * DOWNSTREAM (imported by):
 *   - [Services that depend on this file]
 *   - [Controllers]
 *   - [Other composites]
 */

/**
 * File: /reuse/{path}/{filename}.ts
 * Locator: WC-{CATEGORY}-{CODE}-001
 * Purpose: {Clear description of what this file does}
 *
 * Upstream: [Direct dependencies]
 * Downstream: [Services that use this]
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger
 * Exports: [What is exported]
 *
 * LLM Context: [Comprehensive description for AI/LLM usage]
 * Includes patterns for [security, compliance, performance]
 */

// Standard imports follow
```

### 2.2 Locator Code Format

**Format**: `WC-{CATEGORY}-{CODE}-{VERSION}`

Examples:
- `WC-PRODPAT-001` - Production patterns
- `WC-DOWN-DETENG-001` - Downstream detection engineering
- `WC-DOWNSTREAM-ADVCORRAPI-001` - Advanced correlation API
- `WC-ADS-001` - Anomaly detection services
- `WC-UTL-SEQ-MOD-001` - Sequelize model utilities

---

## Part 3: TypeScript & NestJS Patterns

### 3.1 Controller Pattern

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('api/v1/threat-intelligence')
@ApiTags('Threat Intelligence')
@ApiBearerAuth()
export class ThreatIntelligenceController {
  @Get(':id')
  @ApiOperation({ summary: 'Get threat by ID' })
  @ApiResponse({ status: 200, description: 'Threat found' })
  @ApiResponse({ status: 404, description: 'Threat not found' })
  async getThreat(@Param('id', ParseUUIDPipe) id: string) {
    // Implementation
  }
}
```

**Key Patterns**:
- All controllers use `@Controller` with explicit route prefixes
- All endpoints documented with `@ApiTags`, `@ApiOperation`, `@ApiResponse`
- All path parameters validated with `ParseUUIDPipe`
- All request bodies validated with `ValidationPipe`
- API security marked with `@ApiBearerAuth()`

### 3.2 Service/Injectable Pattern

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ThreatIntelligenceService {
  private readonly logger = new Logger(ThreatIntelligenceService.name);

  async getThreat(id: string): Promise<Threat> {
    try {
      this.logger.log(`Fetching threat ${id}`);
      // Implementation
    } catch (error) {
      this.logger.error(`Failed to fetch threat: ${error.message}`, error.stack);
      throw new NotFoundException(`Threat ${id} not found`);
    }
  }
}
```

**Key Patterns**:
- All services marked with `@Injectable()`
- Logging on operation start and completion
- Try-catch blocks around all async operations
- Proper error handling and re-throwing

### 3.3 DTO (Data Transfer Object) Pattern

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateThreatDto {
  @ApiProperty({ description: 'Threat name', example: 'APT28' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] })
  @IsEnum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
  severity: string;

  @ApiPropertyOptional({ description: 'Optional description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  discoveredAt?: Date;
}

export class UpdateThreatDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
  severity?: string;
}
```

**Key Patterns**:
- All DTOs have `@ApiProperty` or `@ApiPropertyOptional` decorators
- All fields have validation decorators from `class-validator`
- Optional fields marked with `@IsOptional()`
- Date fields use `@Type(() => Date)` transformer
- Separate Create/Update DTOs for flexibility

### 3.4 Error Handling Pattern

All errors are standardized via `_production-patterns.ts`:

```typescript
// Standard error classes
export class BadRequestError extends HttpException { }
export class UnauthorizedError extends HttpException { }
export class ForbiddenError extends HttpException { }
export class NotFoundError extends HttpException { }
export class ConflictError extends HttpException { }
export class InternalServerError extends HttpException { }

// In services:
try {
  // Operation
} catch (error) {
  this.logger.error(`Operation failed: ${error.message}`, error.stack);
  throw new BadRequestError('User-friendly message', { details: error });
}
```

**Error Response Format**:
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
  path?: '/api/endpoint',
  requestId?: 'req_123_abc'
}
```

### 3.5 Success Response Pattern

```typescript
// Single item response
{
  success: true,
  statusCode: 200,
  data: { /* entity */ },
  timestamp: Date,
  requestId?: 'req_123_abc'
}

// Paginated response
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
  requestId?: 'req_123_abc'
}

// Helpers in code:
return createSuccessResponse(data, requestId);
return createPaginatedResponse(items, total, page, pageSize, requestId);
return createCreatedResponse(newEntity, requestId);
```

---

## Part 4: Sequelize Model Patterns

### 4.1 Basic Model Structure

```typescript
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';

@Table({
  tableName: 'bid_solicitations',
  timestamps: true,
  paranoid: false, // soft delete if true
  indexes: [
    { fields: ['projectId'] },
    { fields: ['status'] },
    { fields: ['createdAt'] },
  ],
})
export class BidSolicitation extends Model<BidSolicitation> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING(50))
  solicitationNumber: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  projectId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ProcurementMethod)),
  })
  procurementMethod: ProcurementMethod;

  @AllowNull(false)
  @Default(BidSolicitationStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(BidSolicitationStatus)),
  })
  status: BidSolicitationStatus;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  evaluationCriteria: any[];

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  createdBy: string;

  @Column(DataType.STRING(100))
  updatedBy?: string;

  // Associations
  @HasMany(() => BidSubmission)
  submissions: BidSubmission[];
}
```

**Key Patterns**:
- UUID primary keys with `DataType.UUIDV4`
- All non-nullable fields marked with `@AllowNull(false)`
- Enums stored as `DataType.ENUM(...Object.values(EnumType))`
- JSON fields for flexible data structures
- Timestamps always enabled via `timestamps: true`
- Indexes on frequently queried columns
- Association decorators for relationships
- Metadata field for extensibility

### 4.2 Type Definitions for Models

```typescript
// types/bid.types.ts
export enum BidSolicitationStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OPEN = 'open',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
  AWARDED = 'awarded',
}

export enum BidStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  WITHDRAWN = 'withdrawn',
  UNDER_EVALUATION = 'under_evaluation',
  QUALIFIED = 'qualified',
  DISQUALIFIED = 'disqualified',
  AWARDED = 'awarded',
  REJECTED = 'rejected',
}

export enum ProcurementMethod {
  COMPETITIVE_SEALED_BID = 'competitive_sealed_bid',
  COMPETITIVE_NEGOTIATION = 'competitive_negotiation',
  SMALL_PURCHASE = 'small_purchase',
  SOLE_SOURCE = 'sole_source',
  EMERGENCY = 'emergency',
}

export interface IBidSolicitation {
  id: string;
  solicitationNumber: string;
  projectId: string;
  title: string;
  status: BidSolicitationStatus;
  procurementMethod: ProcurementMethod;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Part 5: Swagger/API Documentation Pattern

### 5.1 Complete Swagger Documentation Example

```typescript
@Controller('api/v1/threat-intelligence')
@ApiTags('Threat Intelligence')
@ApiBearerAuth()
export class ThreatIntelligenceController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new threat intelligence record',
    description: 'Creates a new threat intelligence record with validation',
  })
  @ApiBody({ type: CreateThreatDto })
  @ApiResponse({
    status: 201,
    description: 'Threat created successfully',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        data: { id: 'uuid', name: 'APT28', severity: 'CRITICAL' },
        timestamp: '2025-11-10T10:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    schema: {
      example: {
        success: false,
        statusCode: 400,
        error: { code: 'BAD_REQUEST', message: 'Validation failed' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createThreat(@Body(ValidationPipe) dto: CreateThreatDto) {
    // Implementation
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get threat by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Threat found',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { id: 'uuid', name: 'APT28' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Threat not found' })
  async getThreat(@Param('id', ParseUUIDPipe) id: string) {
    // Implementation
  }

  @Get()
  @ApiOperation({ summary: 'List threats with pagination' })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'pageSize', type: 'number', required: false })
  @ApiQuery({ name: 'severity', type: 'string', required: false })
  @ApiResponse({
    status: 200,
    description: 'Threats listed',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [],
        pagination: {
          total: 100,
          page: 1,
          pageSize: 20,
          totalPages: 5,
          hasMore: true,
        },
      },
    },
  })
  async listThreats(@Query() query: ListThreatsDto) {
    // Implementation
  }
}
```

**Key Patterns**:
- `@ApiTags` groups related endpoints
- `@ApiBearerAuth()` indicates JWT authentication required
- `@ApiOperation` summarizes endpoint purpose
- `@ApiBody` documents request body structure
- `@ApiResponse` documents all possible response codes
- `@ApiParam` documents URL parameters
- `@ApiQuery` documents query parameters
- Response examples include full response envelope

---

## Part 6: Production Patterns (Threat Composites Example)

### 6.1 Threat Composites Directory Organization

```
reuse/threat/composites/
├── advanced-threat-correlation-composite.ts      # Upstream core functions
├── anomaly-detection-core-composite.ts           # Upstream core functions
├── threat-detection-validation-composite.ts      # Upstream core functions
│
└── downstream/                                    # 124 production-ready files
    ├── _production-patterns.ts                   # Shared patterns for ALL files
    ├── _upgrade-templates.ts                     # Template generator
    ├── PRODUCTION_AUDIT_REPORT.md               # Quality audit results
    │
    ├── [Core API Controllers/Services - 28 files]
    ├── advanced-correlation-api-controllers.ts
    ├── api-gateway-services.ts
    ├── detection-engineering-services.ts
    ├── anomaly-detection-services.ts
    │
    ├── [Security Operations - 20 files]
    ├── security-operations-center-automation-services.ts
    ├── security-orchestration-engines.ts
    ├── automated-response-services.ts
    │
    ├── [Executive Reporting - 15 files]
    ├── executive-dashboards.ts
    ├── board-presentation-generators.ts
    ├── c-level-reporting-modules.ts
    │
    ├── [Compliance & Healthcare - 12 files]
    ├── hipaa-compliance-monitoring.ts
    ├── patient-privacy-compliance-modules.ts
    ├── healthcare-threat-monitoring-systems.ts
    │
    └── [50+ other specialized services]
```

### 6.2 Production Patterns File (_production-patterns.ts)

This file exports standard patterns used by ALL downstream files:

```typescript
// Error Classes (HTTP Exception subclasses)
export class BadRequestError extends HttpException { }
export class UnauthorizedError extends HttpException { }
export class ForbiddenError extends HttpException { }
export class NotFoundError extends HttpException { }
export class ConflictError extends HttpException { }
export class InternalServerError extends HttpException { }

// Response Interfaces
export interface ApiErrorResponse { }
export interface ApiSuccessResponse<T> { }
export interface ApiPaginatedResponse<T> { }

// Response Helpers
export function createSuccessResponse<T>(data: T, requestId?: string): ApiSuccessResponse<T>
export function createCreatedResponse<T>(data: T, requestId?: string): ApiSuccessResponse<T>
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  requestId?: string,
): ApiPaginatedResponse<T>

// Logging Utilities
export function createLogger(className: string): Logger
export function logOperation(logger: Logger, operation: string, context?: string, metadata?: Record<string, any>): () => void
export function logError(logger: Logger, operation: string, error: Error, context?: string, metadata?: Record<string, any>): void

// Base DTOs
export abstract class BaseDto { requestId?: string; metadata?: Record<string, any>; }
export abstract class BaseEntity { id: string; createdAt: Date; updatedAt: Date; }
export class PaginationDto { page: number = 1; pageSize: number = 20; sortBy?: string; sortDirection?: 'ASC' | 'DESC' = 'DESC'; }
export class FilterDto { q?: string; status?: string; severity?: string; startDate?: Date; endDate?: Date; }

// HIPAA Compliance
export interface HIPAAAuditLog { timestamp: Date; userId: string; action: string; resourceType: string; resourceId: string; status: 'SUCCESS' | 'FAILURE'; result?: 'ALLOWED' | 'DENIED'; requestId: string; }
export function createHIPAALog(...): HIPAAAuditLog
export function sanitizeErrorForHIPAA(error: Error, requestId?: string): ApiErrorResponse

// Enums
export enum SeverityLevel { CRITICAL, HIGH, MEDIUM, LOW, INFO }
export enum StatusType { PENDING, IN_PROGRESS, COMPLETED, FAILED, CANCELLED }
export enum ResultType { SUCCESS, FAILURE, PARTIAL, UNKNOWN }

// Utilities
export function generateRequestId(): string
export function parseValidationErrors(errors: ValidationError[]): ValidationErrorResponse[]
export function isValidUUID(value: string): boolean
export function safeStringify(obj: any, maxDepth?: number): string
```

---

## Part 7: Threat Composites Patterns (Key Data Operations)

### 7.1 Domains & Entities in Threat Composites

The 124 downstream threat composite files handle:

#### Core Threat Intelligence Operations:
- Advanced correlation analysis
- IOC (Indicator of Compromise) discovery
- Threat relationship mapping
- Graph-based analysis
- Behavioral pattern detection
- Attribution analysis

#### Detection & Response:
- Detection rule engineering
- Threat validation
- Anomaly detection
- Automated response orchestration
- Purple team operations
- Attack simulation

#### Executive & Compliance:
- Executive dashboards
- Board presentation generation
- Regulatory monitoring
- Compliance reporting
- Risk forecasting
- KPI calculation

#### Healthcare-Specific:
- Patient privacy compliance (HIPAA)
- Clinical system protection
- PHI monitoring
- Healthcare threat monitoring
- Medical device security

### 7.2 Common Data Patterns in Downstream

**Correlation Requests**:
```typescript
export class CorrelationRequestDto {
  threats: any[];
  dimensions: string[];
  algorithm?: 'pearson' | 'cosine' | 'jaccard' | 'euclidean';
  threshold?: number;
  normalize?: boolean;
}
```

**IOC Relationship Requests**:
```typescript
export class IOCRelationshipRequestDto {
  iocs: string[];
  depth?: number;
}
```

**Temporal Analysis Requests**:
```typescript
export class TemporalAnalysisRequestDto {
  events: any[];
  window: {
    start: Date;
    end: Date;
    duration: number;
    unit: string;
  };
}
```

**Spatial Correlation Requests**:
```typescript
export class SpatialCorrelationRequestDto {
  entityLocations: Record<string, any>;
  radiusKm: number;
}
```

---

## Part 8: Quality Standards & Metrics

### 8.1 Production-Grade Checklist

From the PRODUCTION_AUDIT_REPORT.md, files must have:

- **File Header Documentation** ✓
  - LOC identifier
  - File path
  - UPSTREAM imports
  - DOWNSTREAM consumers
  - Locator code
  - Purpose statement
  - LLM context

- **Error Handling** ✓
  - Minimum 1 try-catch block per service method
  - Proper exception throwing
  - Error logging with context

- **API Documentation** ✓
  - @ApiTags on controller
  - @ApiOperation on endpoints
  - @ApiResponse for each status code
  - @ApiBody, @ApiParam, @ApiQuery documentation

- **Logging** ✓
  - Logger instance creation
  - Operation start/completion logging
  - Error logging with stack traces
  - Metadata inclusion for debugging

- **Validation** ✓
  - Input validation decorators
  - DTO with @ApiProperty annotations
  - ValidationPipe on controllers

- **TypeScript Safety** ✓
  - Full type annotations
  - No `any` types (unless necessary)
  - Interface definitions for all data structures

### 8.2 Production Audit Results

From 124 threat downstream files analyzed:
- **24/28 (82%) fully compliant** with production standards
- **4 critical files** need error handling improvements
- **Average file size**: 900-1500 LOC
- **Total lines analyzed**: 56,089 LOC
- **Standards**: 100% TypeScript, 100% NestJS compatible, 100% Swagger documented

---

## Part 9: Import & Export Patterns

### 9.1 Barrel Export Pattern

```typescript
// reuse/threat/composites/downstream/index.ts
export * from './advanced-correlation-api-controllers';
export * from './anomaly-detection-services';
export * from './detection-engineering-services';
export * from './api-gateway-services';
// ... more exports
```

### 9.2 Import Patterns

```typescript
// Method 1: Direct import
import {
  advancedCorrelationService,
  detectAnomalies,
} from '/reuse/threat/composites/downstream/anomaly-detection-services';

// Method 2: Namespace import
import * as AnomalyDetection from '/reuse/threat/composites/downstream/anomaly-detection-services';
await AnomalyDetection.detectAnomalies(...);

// Method 3: From barrel export
import { advancedCorrelationService, detectAnomalies } from '/reuse/threat/composites/downstream';

// Method 4: Selective from shared patterns
import {
  createSuccessResponse,
  createLogger,
  BadRequestError,
  SeverityLevel,
} from './_production-patterns';
```

---

## Part 10: Best Practices Summary

### 10.1 Essential Patterns to Follow

1. **Always start with file header** - LOC, UPSTREAM, DOWNSTREAM
2. **Use shared _production-patterns.ts** - Don't duplicate error handling
3. **Document all Swagger decorators** - @ApiTags, @ApiOperation, @ApiResponse
4. **Validate all inputs** - Use class-validator decorators
5. **Handle all errors** - Try-catch with logging
6. **Use proper logging** - Start, completion, errors with metadata
7. **Type everything** - Full TypeScript for type safety
8. **Create separate DTOs** - For Create, Update, Response operations
9. **Use enums for constants** - With database-compatible values
10. **Include request tracking** - requestId through response chain

### 10.2 File Naming Quick Reference

| File Type | Pattern | Example |
|-----------|---------|---------|
| Root Utility Kit | `{name}-kit.ts` | `api-design-kit.ts` |
| Root Utility | `{name}-utils.ts` | `sequelize-models-utils.ts` |
| Upstream Composite | `{name}-composite.ts` | `advanced-threat-correlation-composite.ts` |
| Downstream Controller | `{name}-api-controllers.ts` | `advanced-correlation-api-controllers.ts` |
| Downstream Service | `{name}-services.ts` | `anomaly-detection-services.ts` |
| Sequelize Model | `{entity}.model.ts` | `bid-solicitation.model.ts` |
| DTO | `{operation}-{entity}.dto.ts` | `create-construction-closeout.dto.ts` |
| Type Definition | `{domain}.types.ts` | `bid.types.ts` |
| Shared Patterns | `_production-patterns.ts` | (core patterns) |
| Templates | `_upgrade-templates.ts` | (code templates) |

### 10.3 Directory Structure for New Domains

```
reuse/newdomain/
├── README.md                          # Domain overview
├── index.ts                           # Barrel export
├── newdomain-kit.ts                   # Main kit file
├── models/                            # Sequelize models
│   ├── entity1.model.ts
│   ├── entity2.model.ts
│   └── [more models].ts
├── dto/                               # Data Transfer Objects
│   ├── create-entity1.dto.ts
│   ├── update-entity1.dto.ts
│   └── [more DTOs].ts
├── types/                             # TypeScript types
│   ├── entity1.types.ts
│   ├── entity2.types.ts
│   └── [more types].ts
└── composites/
    ├── [upstream composite files].ts
    └── downstream/
        ├── _production-patterns.ts
        ├── [downstream services].ts
        └── [124+ production files].ts
```

---

## Summary Table: Key Patterns at a Glance

| Aspect | Pattern | Key Files | Purpose |
|--------|---------|-----------|---------|
| **File Headers** | LOC + UPSTREAM/DOWNSTREAM | All TS files | Documentation & traceability |
| **Naming** | `{name}-{type}.ts` | All files | Clear file purpose |
| **Controllers** | @Controller + @ApiTags | downstream/*.ts | RESTful APIs |
| **Services** | @Injectable + Logger | downstream/*.ts | Business logic |
| **DTOs** | class + validators | dto/*.ts | Input validation |
| **Models** | @Table + Decorators | models/*.ts | Database persistence |
| **Types** | enum + interface | types/*.ts | Type safety |
| **Errors** | Custom HttpException classes | _production-patterns.ts | Standardized errors |
| **Responses** | Success/Error envelopes | _production-patterns.ts | Consistent API responses |
| **Logging** | Logger + metadata | All services | Debugging & audit |
| **Validation** | class-validator decorators | All DTOs | Input security |
| **Swagger** | @Api* decorators | All controllers | API documentation |

---

## Conclusion

The White Cross reuse library follows **enterprise-grade production patterns** with:
- ✅ 3,186 TypeScript files organized by domain
- ✅ Comprehensive NestJS + Sequelize patterns
- ✅ Standardized error handling and logging
- ✅ Full Swagger API documentation
- ✅ HIPAA-compliant patterns
- ✅ Type-safe DTOs and models
- ✅ 82%+ production audit compliance

All new functions should follow these patterns for consistency and maintainability.

