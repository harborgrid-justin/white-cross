# Health Records Module - Enterprise TypeScript Service Contracts & Interfaces

**Document Version:** 1.0
**Date:** 2025-10-10
**Author:** Enterprise Architecture Team
**Status:** Design Proposal

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current Architecture Analysis](#current-architecture-analysis)
3. [Design Principles](#design-principles)
4. [Service Contract Architecture](#service-contract-architecture)
5. [Type System Design](#type-system-design)
6. [Implementation Guide](#implementation-guide)
7. [Migration Strategy](#migration-strategy)
8. [Best Practices](#best-practices)

---

## Executive Summary

This document defines comprehensive, enterprise-grade TypeScript service contracts and interfaces for the Health Records module, following Service-Oriented Architecture (SOA) best practices. The design ensures:

- **Type Safety**: Full compile-time type checking across service boundaries
- **Separation of Concerns**: Clear distinction between domain models, DTOs, and API contracts
- **Versioning Support**: Built-in API evolution capabilities
- **HIPAA Compliance**: Security-first design with audit logging
- **Scalability**: Contract-first approach supporting distributed systems
- **Maintainability**: Self-documenting types with comprehensive metadata

---

## Current Architecture Analysis

### Existing Implementation Assessment

**Strengths:**
1. Basic type definitions exist in frontend (`frontend/src/types/healthRecords.ts`)
2. Prisma schema provides strong database typing
3. Service layer separation (routes → controllers → services)
4. Some DTO patterns in backend service

**Weaknesses:**
1. **Type Inconsistency**: Frontend and backend types are not synchronized
2. **Missing Contract Definitions**: No formal service interface contracts
3. **Weak Type Safety**: Heavy use of `any` in route handlers
4. **No Versioning**: API contracts don't support evolution
5. **DTO Gaps**: Direct Prisma types used as DTOs in many places
6. **Limited Error Types**: Generic error handling without type-safe error responses
7. **No Repository Abstraction**: Service directly depends on Prisma

### Type Mapping Issues

```typescript
// Current inconsistency example:
// Frontend expects:
interface HealthRecord {
  type: RecordType  // 'PHYSICAL_EXAM'
}

// Backend Prisma enum:
enum HealthRecordType {
  PHYSICAL_EXAM    // Different naming convention
}

// API returns raw Prisma object - no transformation layer
```

---

## Design Principles

### 1. Contract-First Design

All service interactions begin with explicit contract definitions that serve as the single source of truth.

### 2. Domain-Driven Design (DDD)

- **Domain Models**: Pure business logic representations
- **DTOs**: Data transfer objects for API boundaries
- **Value Objects**: Immutable, validated types
- **Aggregates**: Consistency boundaries for related entities

### 3. Type-Safe Error Handling

Discriminated union types for all error scenarios with proper error codes.

### 4. Immutability by Design

All DTOs and value objects should be readonly to prevent accidental mutations.

### 5. Explicit Dependencies

Service interfaces declare all dependencies through constructor injection.

### 6. API Versioning

All contracts support versioning through namespace or type versioning.

---

## Service Contract Architecture

### Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (React Components, Hooks)                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   API Client Layer                       │
│           (Type-Safe HTTP Client Interface)              │
└─────────────────────┬───────────────────────────────────┘
                      │ DTOs (Request/Response)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  Service Interface                       │
│         (Contract Definition - Version Aware)            │
└─────────────────────┬───────────────────────────────────┘
                      │ Domain Commands/Queries
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Service Implementation Layer                │
│           (Business Logic, Validation)                   │
└─────────────────────┬───────────────────────────────────┘
                      │ Repository Interface
                      ▼
┌─────────────────────────────────────────────────────────┐
│                Repository Implementation                 │
│              (Data Access - Prisma)                      │
└─────────────────────────────────────────────────────────┘
```

---

## Type System Design

### Core Type Hierarchy

```typescript
/**
 * @file backend/src/modules/health-records/contracts/types/index.ts
 * Central type definitions for Health Records module
 */

// ============================================================================
// VALUE OBJECTS - Immutable, validated primitives
// ============================================================================

/**
 * Represents a validated Student ID
 * Ensures ID format compliance and prevents invalid references
 */
export type StudentId = string & { readonly __brand: 'StudentId' };

/**
 * Represents a validated Health Record ID
 */
export type HealthRecordId = string & { readonly __brand: 'HealthRecordId' };

/**
 * Represents a validated Allergy ID
 */
export type AllergyId = string & { readonly __brand: 'AllergyId' };

/**
 * Represents a validated Chronic Condition ID
 */
export type ChronicConditionId = string & { readonly __brand: 'ChronicConditionId' };

/**
 * Smart constructor for StudentId
 * @throws {ValidationError} if ID format is invalid
 */
export const createStudentId = (id: string): StudentId => {
  if (!id || typeof id !== 'string' || id.length === 0) {
    throw new ValidationError('Invalid student ID format', 'INVALID_STUDENT_ID');
  }
  return id as StudentId;
};

// ============================================================================
// ENUMERATIONS - Strict type-safe enums
// ============================================================================

/**
 * Health record type enumeration
 * Aligned with Prisma schema but provides type-safe API contract
 */
export enum HealthRecordType {
  CHECKUP = 'CHECKUP',
  VACCINATION = 'VACCINATION',
  ILLNESS = 'ILLNESS',
  INJURY = 'INJURY',
  SCREENING = 'SCREENING',
  PHYSICAL_EXAM = 'PHYSICAL_EXAM',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  DENTAL = 'DENTAL',
  VISION = 'VISION',
  HEARING = 'HEARING',
}

/**
 * Allergy severity levels
 * Clinical classification aligned with healthcare standards
 */
export enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING',
}

/**
 * Chronic condition status
 */
export enum ConditionStatus {
  ACTIVE = 'ACTIVE',
  MANAGED = 'MANAGED',
  RESOLVED = 'RESOLVED',
  MONITORING = 'MONITORING',
}

// ============================================================================
// DOMAIN MODELS - Internal business representations
// ============================================================================

/**
 * Vital signs value object
 * Immutable representation with validation
 */
export interface VitalSigns {
  readonly temperature?: {
    readonly value: number;
    readonly unit: 'celsius' | 'fahrenheit';
  };
  readonly bloodPressure?: {
    readonly systolic: number;
    readonly diastolic: number;
    readonly unit: 'mmHg';
  };
  readonly heartRate?: {
    readonly value: number;
    readonly unit: 'bpm';
  };
  readonly respiratoryRate?: {
    readonly value: number;
    readonly unit: 'breaths/min';
  };
  readonly oxygenSaturation?: {
    readonly value: number;
    readonly unit: 'percent';
  };
  readonly height?: {
    readonly value: number;
    readonly unit: 'cm' | 'inches';
  };
  readonly weight?: {
    readonly value: number;
    readonly unit: 'kg' | 'lbs';
  };
  readonly bmi?: {
    readonly value: number;
    readonly category: 'underweight' | 'normal' | 'overweight' | 'obese';
  };
}

/**
 * Health record domain model
 * Internal representation with full business rules
 */
export interface HealthRecordDomain {
  readonly id: HealthRecordId;
  readonly studentId: StudentId;
  readonly type: HealthRecordType;
  readonly date: Date;
  readonly description: string;
  readonly vital?: VitalSigns;
  readonly provider?: string;
  readonly notes?: string;
  readonly attachments: ReadonlyArray<string>;
  readonly metadata: {
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly createdBy: string;
    readonly version: number;
  };
  readonly hipaaFlags: {
    readonly isSensitive: boolean;
    readonly requiresConsent: boolean;
    readonly retentionPeriodYears: number;
  };
}

/**
 * Allergy domain model
 */
export interface AllergyDomain {
  readonly id: AllergyId;
  readonly studentId: StudentId;
  readonly allergen: string;
  readonly severity: AllergySeverity;
  readonly reaction?: string;
  readonly treatment?: string;
  readonly verification: {
    readonly isVerified: boolean;
    readonly verifiedBy?: string;
    readonly verifiedAt?: Date;
  };
  readonly metadata: {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };
}

/**
 * Chronic condition domain model
 */
export interface ChronicConditionDomain {
  readonly id: ChronicConditionId;
  readonly studentId: StudentId;
  readonly condition: string;
  readonly diagnosedDate: Date;
  readonly status: ConditionStatus;
  readonly severity?: AllergySeverity;
  readonly carePlan?: {
    readonly description: string;
    readonly medications: ReadonlyArray<string>;
    readonly restrictions: ReadonlyArray<string>;
    readonly triggers: ReadonlyArray<string>;
  };
  readonly reviewSchedule: {
    readonly lastReviewDate?: Date;
    readonly nextReviewDate?: Date;
    readonly reviewFrequencyMonths: number;
  };
  readonly provider?: {
    readonly name: string;
    readonly id?: string;
  };
  readonly metadata: {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };
}

// ============================================================================
// DATA TRANSFER OBJECTS (DTOs) - API Boundary Types
// ============================================================================

/**
 * Base response wrapper for all API responses
 * Provides consistent structure across all endpoints
 */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
  readonly metadata: {
    readonly timestamp: string;
    readonly requestId: string;
    readonly version: string;
  };
}

/**
 * Type-safe error response
 */
export interface ApiError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly validationErrors?: ReadonlyArray<ValidationErrorDetail>;
  readonly stackTrace?: string; // Only in development
}

/**
 * Error codes enumeration
 */
export enum ErrorCode {
  // Client errors (4xx)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',

  // Server errors (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Business logic errors
  STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND',
  DUPLICATE_ALLERGY = 'DUPLICATE_ALLERGY',
  INVALID_DATE_RANGE = 'INVALID_DATE_RANGE',
  HIPAA_VIOLATION = 'HIPAA_VIOLATION',
}

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  readonly field: string;
  readonly message: string;
  readonly code: string;
  readonly value?: unknown;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> extends ApiResponse<T> {
  readonly pagination: PaginationMetadata;
}

// ============================================================================
// REQUEST DTOs - Input validation schemas
// ============================================================================

/**
 * Create health record request DTO
 */
export interface CreateHealthRecordRequestDto {
  readonly studentId: string;
  readonly type: HealthRecordType;
  readonly date: string; // ISO 8601 format
  readonly description: string;
  readonly vital?: VitalSignsDto;
  readonly provider?: string;
  readonly notes?: string;
  readonly attachments?: ReadonlyArray<string>;
}

/**
 * Vital signs DTO for API transfer
 */
export interface VitalSignsDto {
  readonly temperature?: number;
  readonly temperatureUnit?: 'celsius' | 'fahrenheit';
  readonly bloodPressureSystolic?: number;
  readonly bloodPressureDiastolic?: number;
  readonly heartRate?: number;
  readonly respiratoryRate?: number;
  readonly oxygenSaturation?: number;
  readonly height?: number;
  readonly heightUnit?: 'cm' | 'inches';
  readonly weight?: number;
  readonly weightUnit?: 'kg' | 'lbs';
}

/**
 * Update health record request DTO
 */
export interface UpdateHealthRecordRequestDto {
  readonly type?: HealthRecordType;
  readonly date?: string;
  readonly description?: string;
  readonly vital?: VitalSignsDto;
  readonly provider?: string;
  readonly notes?: string;
  readonly attachments?: ReadonlyArray<string>;
}

/**
 * Health record filter request DTO
 */
export interface HealthRecordFilterDto {
  readonly type?: HealthRecordType;
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly provider?: string;
  readonly page?: number;
  readonly limit?: number;
  readonly sortBy?: 'date' | 'type' | 'createdAt';
  readonly sortOrder?: 'asc' | 'desc';
}

/**
 * Create allergy request DTO
 */
export interface CreateAllergyRequestDto {
  readonly studentId: string;
  readonly allergen: string;
  readonly severity: AllergySeverity;
  readonly reaction?: string;
  readonly treatment?: string;
  readonly verified?: boolean;
  readonly verifiedBy?: string;
}

/**
 * Update allergy request DTO
 */
export interface UpdateAllergyRequestDto {
  readonly allergen?: string;
  readonly severity?: AllergySeverity;
  readonly reaction?: string;
  readonly treatment?: string;
  readonly verified?: boolean;
  readonly verifiedBy?: string;
}

/**
 * Create chronic condition request DTO
 */
export interface CreateChronicConditionRequestDto {
  readonly studentId: string;
  readonly condition: string;
  readonly diagnosedDate: string;
  readonly status?: ConditionStatus;
  readonly severity?: AllergySeverity;
  readonly notes?: string;
  readonly carePlan?: string;
  readonly medications?: ReadonlyArray<string>;
  readonly restrictions?: ReadonlyArray<string>;
  readonly triggers?: ReadonlyArray<string>;
  readonly diagnosedBy?: string;
  readonly nextReviewDate?: string;
}

/**
 * Update chronic condition request DTO
 */
export interface UpdateChronicConditionRequestDto {
  readonly condition?: string;
  readonly diagnosedDate?: string;
  readonly status?: ConditionStatus;
  readonly severity?: AllergySeverity;
  readonly notes?: string;
  readonly carePlan?: string;
  readonly medications?: ReadonlyArray<string>;
  readonly restrictions?: ReadonlyArray<string>;
  readonly triggers?: ReadonlyArray<string>;
  readonly lastReviewDate?: string;
  readonly nextReviewDate?: string;
}

// ============================================================================
// RESPONSE DTOs - Output transformation schemas
// ============================================================================

/**
 * Health record response DTO
 * Optimized for client consumption
 */
export interface HealthRecordResponseDto {
  readonly id: string;
  readonly studentId: string;
  readonly student?: {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly studentNumber: string;
  };
  readonly type: HealthRecordType;
  readonly date: string;
  readonly description: string;
  readonly vital?: VitalSignsDto;
  readonly provider?: string;
  readonly notes?: string;
  readonly attachments: ReadonlyArray<string>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Allergy response DTO
 */
export interface AllergyResponseDto {
  readonly id: string;
  readonly studentId: string;
  readonly allergen: string;
  readonly severity: AllergySeverity;
  readonly reaction?: string;
  readonly treatment?: string;
  readonly verified: boolean;
  readonly verifiedBy?: string;
  readonly verifiedAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Chronic condition response DTO
 */
export interface ChronicConditionResponseDto {
  readonly id: string;
  readonly studentId: string;
  readonly condition: string;
  readonly diagnosedDate: string;
  readonly status: ConditionStatus;
  readonly severity?: AllergySeverity;
  readonly notes?: string;
  readonly carePlan?: string;
  readonly medications: ReadonlyArray<string>;
  readonly restrictions: ReadonlyArray<string>;
  readonly triggers: ReadonlyArray<string>;
  readonly diagnosedBy?: string;
  readonly lastReviewDate?: string;
  readonly nextReviewDate?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Health summary response DTO
 * Aggregated view of student health data
 */
export interface HealthSummaryResponseDto {
  readonly student: {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly studentNumber: string;
    readonly dateOfBirth: string;
    readonly gender: string;
  };
  readonly allergies: ReadonlyArray<AllergyResponseDto>;
  readonly chronicConditions: ReadonlyArray<ChronicConditionResponseDto>;
  readonly recentVitals: ReadonlyArray<{
    readonly date: string;
    readonly vital: VitalSignsDto;
    readonly type: HealthRecordType;
    readonly provider?: string;
  }>;
  readonly recentVaccinations: ReadonlyArray<HealthRecordResponseDto>;
  readonly recordCounts: Record<HealthRecordType, number>;
  readonly alerts: ReadonlyArray<{
    readonly type: string;
    readonly severity: 'low' | 'medium' | 'high';
    readonly message: string;
  }>;
}

/**
 * Growth chart data response DTO
 */
export interface GrowthChartDataResponseDto {
  readonly dataPoints: ReadonlyArray<{
    readonly date: string;
    readonly height?: number;
    readonly weight?: number;
    readonly bmi?: number;
    readonly recordType: HealthRecordType;
  }>;
  readonly percentiles?: {
    readonly height: number;
    readonly weight: number;
    readonly bmi: number;
  };
}

/**
 * Bulk operation result DTO
 */
export interface BulkOperationResultDto {
  readonly total: number;
  readonly successful: number;
  readonly failed: number;
  readonly errors: ReadonlyArray<{
    readonly id: string;
    readonly error: string;
  }>;
}

// ============================================================================
// AUDIT & SECURITY DTOs
// ============================================================================

/**
 * Audit log entry DTO
 */
export interface AuditLogEntryDto {
  readonly id: string;
  readonly userId: string;
  readonly userRole: string;
  readonly action: AuditAction;
  readonly resourceType: 'HEALTH_RECORD' | 'ALLERGY' | 'CHRONIC_CONDITION';
  readonly resourceId: string;
  readonly studentId: string;
  readonly changes?: Record<string, unknown>;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly timestamp: string;
  readonly success: boolean;
  readonly errorMessage?: string;
}

/**
 * Audit actions enumeration
 */
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  BULK_DELETE = 'BULK_DELETE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  VERIFY = 'VERIFY',
  SHARE = 'SHARE',
}

/**
 * Access log request DTO
 */
export interface LogAccessRequestDto {
  readonly action: AuditAction;
  readonly studentId: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly details?: Record<string, unknown>;
}

// ============================================================================
// CUSTOM EXCEPTIONS
// ============================================================================

/**
 * Base domain exception
 */
export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DomainException';
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}

/**
 * Validation exception
 */
export class ValidationError extends DomainException {
  constructor(
    message: string,
    code: string = 'VALIDATION_ERROR',
    public readonly validationErrors?: ReadonlyArray<ValidationErrorDetail>
  ) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, { code });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Resource not found exception
 */
export class ResourceNotFoundError extends DomainException {
  constructor(resourceType: string, resourceId: string) {
    super(
      `${resourceType} with ID ${resourceId} not found`,
      ErrorCode.RESOURCE_NOT_FOUND,
      404,
      { resourceType, resourceId }
    );
    this.name = 'ResourceNotFoundError';
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
}

/**
 * Conflict exception
 */
export class ConflictError extends DomainException {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.CONFLICT, 409, details);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * HIPAA violation exception
 */
export class HipaaViolationError extends DomainException {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorCode.HIPAA_VIOLATION, 403, details);
    this.name = 'HipaaViolationError';
    Object.setPrototypeOf(this, HipaaViolationError.prototype);
  }
}
```

### Service Interface Contracts

```typescript
/**
 * @file backend/src/modules/health-records/contracts/services/IHealthRecordService.ts
 * Service interface contract for Health Records operations
 */

import {
  HealthRecordId,
  StudentId,
  AllergyId,
  ChronicConditionId,
  HealthRecordDomain,
  AllergyDomain,
  ChronicConditionDomain,
  CreateHealthRecordRequestDto,
  UpdateHealthRecordRequestDto,
  HealthRecordFilterDto,
  CreateAllergyRequestDto,
  UpdateAllergyRequestDto,
  CreateChronicConditionRequestDto,
  UpdateChronicConditionRequestDto,
  PaginationMetadata,
  BulkOperationResultDto,
  AuditLogEntryDto,
  LogAccessRequestDto,
} from '../types';

/**
 * Result type for service operations
 * Discriminated union for type-safe error handling
 */
export type ServiceResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: ServiceError };

/**
 * Service error type
 */
export interface ServiceError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

/**
 * Health Record Service Contract
 * Defines all operations for managing student health records
 *
 * @version 1.0
 * @since 2025-01-01
 */
export interface IHealthRecordService {
  // ============================================================================
  // HEALTH RECORDS OPERATIONS
  // ============================================================================

  /**
   * Retrieves health records for a specific student with filtering
   *
   * @param studentId - The student identifier
   * @param filters - Optional filtering criteria
   * @returns Promise resolving to paginated health records or error
   *
   * @throws {ResourceNotFoundError} if student not found
   * @throws {HipaaViolationError} if user lacks access rights
   *
   * @audit Logs READ action for HIPAA compliance
   */
  getStudentHealthRecords(
    studentId: StudentId,
    filters: HealthRecordFilterDto
  ): Promise<ServiceResult<{
    records: ReadonlyArray<HealthRecordDomain>;
    pagination: PaginationMetadata;
  }>>;

  /**
   * Retrieves a single health record by ID
   *
   * @param recordId - The health record identifier
   * @returns Promise resolving to health record or error
   *
   * @throws {ResourceNotFoundError} if record not found
   * @throws {HipaaViolationError} if user lacks access rights
   *
   * @audit Logs READ action for HIPAA compliance
   */
  getHealthRecordById(
    recordId: HealthRecordId
  ): Promise<ServiceResult<HealthRecordDomain>>;

  /**
   * Creates a new health record
   *
   * @param data - Health record creation data
   * @returns Promise resolving to created record or error
   *
   * @throws {ValidationError} if data is invalid
   * @throws {ResourceNotFoundError} if student not found
   *
   * @audit Logs CREATE action with full record data
   */
  createHealthRecord(
    data: CreateHealthRecordRequestDto
  ): Promise<ServiceResult<HealthRecordDomain>>;

  /**
   * Updates an existing health record
   *
   * @param recordId - The health record identifier
   * @param data - Health record update data
   * @returns Promise resolving to updated record or error
   *
   * @throws {ValidationError} if data is invalid
   * @throws {ResourceNotFoundError} if record not found
   * @throws {HipaaViolationError} if user lacks modification rights
   *
   * @audit Logs UPDATE action with before/after values
   */
  updateHealthRecord(
    recordId: HealthRecordId,
    data: UpdateHealthRecordRequestDto
  ): Promise<ServiceResult<HealthRecordDomain>>;

  /**
   * Deletes a health record
   *
   * @param recordId - The health record identifier
   * @returns Promise resolving to void or error
   *
   * @throws {ResourceNotFoundError} if record not found
   * @throws {HipaaViolationError} if user lacks deletion rights
   *
   * @audit Logs DELETE action with record snapshot
   */
  deleteHealthRecord(
    recordId: HealthRecordId
  ): Promise<ServiceResult<void>>;

  /**
   * Bulk deletes multiple health records
   *
   * @param recordIds - Array of health record identifiers
   * @returns Promise resolving to operation result or error
   *
   * @throws {HipaaViolationError} if user lacks deletion rights
   *
   * @audit Logs BULK_DELETE action with all record IDs
   */
  bulkDeleteHealthRecords(
    recordIds: ReadonlyArray<HealthRecordId>
  ): Promise<ServiceResult<BulkOperationResultDto>>;

  // ============================================================================
  // ALLERGIES OPERATIONS
  // ============================================================================

  /**
   * Retrieves all allergies for a student
   *
   * @param studentId - The student identifier
   * @returns Promise resolving to allergies or error
   *
   * @throws {ResourceNotFoundError} if student not found
   *
   * @audit Logs READ action
   */
  getStudentAllergies(
    studentId: StudentId
  ): Promise<ServiceResult<ReadonlyArray<AllergyDomain>>>;

  /**
   * Adds a new allergy for a student
   *
   * @param data - Allergy creation data
   * @returns Promise resolving to created allergy or error
   *
   * @throws {ValidationError} if data is invalid
   * @throws {ResourceNotFoundError} if student not found
   * @throws {ConflictError} if allergy already exists
   *
   * @audit Logs CREATE action
   */
  addAllergy(
    data: CreateAllergyRequestDto
  ): Promise<ServiceResult<AllergyDomain>>;

  /**
   * Updates an existing allergy
   *
   * @param allergyId - The allergy identifier
   * @param data - Allergy update data
   * @returns Promise resolving to updated allergy or error
   *
   * @throws {ValidationError} if data is invalid
   * @throws {ResourceNotFoundError} if allergy not found
   *
   * @audit Logs UPDATE action
   */
  updateAllergy(
    allergyId: AllergyId,
    data: UpdateAllergyRequestDto
  ): Promise<ServiceResult<AllergyDomain>>;

  /**
   * Verifies an allergy
   *
   * @param allergyId - The allergy identifier
   * @param verifiedBy - User ID performing verification
   * @returns Promise resolving to verified allergy or error
   *
   * @throws {ResourceNotFoundError} if allergy not found
   *
   * @audit Logs VERIFY action
   */
  verifyAllergy(
    allergyId: AllergyId,
    verifiedBy: string
  ): Promise<ServiceResult<AllergyDomain>>;

  /**
   * Deletes an allergy
   *
   * @param allergyId - The allergy identifier
   * @returns Promise resolving to void or error
   *
   * @throws {ResourceNotFoundError} if allergy not found
   *
   * @audit Logs DELETE action
   */
  deleteAllergy(
    allergyId: AllergyId
  ): Promise<ServiceResult<void>>;

  // ============================================================================
  // CHRONIC CONDITIONS OPERATIONS
  // ============================================================================

  /**
   * Retrieves all chronic conditions for a student
   *
   * @param studentId - The student identifier
   * @returns Promise resolving to chronic conditions or error
   *
   * @throws {ResourceNotFoundError} if student not found
   *
   * @audit Logs READ action
   */
  getStudentChronicConditions(
    studentId: StudentId
  ): Promise<ServiceResult<ReadonlyArray<ChronicConditionDomain>>>;

  /**
   * Adds a new chronic condition for a student
   *
   * @param data - Chronic condition creation data
   * @returns Promise resolving to created condition or error
   *
   * @throws {ValidationError} if data is invalid
   * @throws {ResourceNotFoundError} if student not found
   *
   * @audit Logs CREATE action
   */
  addChronicCondition(
    data: CreateChronicConditionRequestDto
  ): Promise<ServiceResult<ChronicConditionDomain>>;

  /**
   * Updates an existing chronic condition
   *
   * @param conditionId - The chronic condition identifier
   * @param data - Chronic condition update data
   * @returns Promise resolving to updated condition or error
   *
   * @throws {ValidationError} if data is invalid
   * @throws {ResourceNotFoundError} if condition not found
   *
   * @audit Logs UPDATE action
   */
  updateChronicCondition(
    conditionId: ChronicConditionId,
    data: UpdateChronicConditionRequestDto
  ): Promise<ServiceResult<ChronicConditionDomain>>;

  /**
   * Deletes a chronic condition
   *
   * @param conditionId - The chronic condition identifier
   * @returns Promise resolving to void or error
   *
   * @throws {ResourceNotFoundError} if condition not found
   *
   * @audit Logs DELETE action
   */
  deleteChronicCondition(
    conditionId: ChronicConditionId
  ): Promise<ServiceResult<void>>;

  // ============================================================================
  // SPECIALIZED QUERIES
  // ============================================================================

  /**
   * Retrieves vaccination records for a student
   *
   * @param studentId - The student identifier
   * @returns Promise resolving to vaccination records or error
   */
  getVaccinationRecords(
    studentId: StudentId
  ): Promise<ServiceResult<ReadonlyArray<HealthRecordDomain>>>;

  /**
   * Retrieves growth chart data for a student
   *
   * @param studentId - The student identifier
   * @returns Promise resolving to growth data or error
   */
  getGrowthChartData(
    studentId: StudentId
  ): Promise<ServiceResult<unknown>>;

  /**
   * Retrieves recent vital signs for a student
   *
   * @param studentId - The student identifier
   * @param limit - Maximum number of records to return
   * @returns Promise resolving to vital signs records or error
   */
  getRecentVitals(
    studentId: StudentId,
    limit: number
  ): Promise<ServiceResult<ReadonlyArray<unknown>>>;

  /**
   * Retrieves comprehensive health summary for a student
   *
   * @param studentId - The student identifier
   * @returns Promise resolving to health summary or error
   */
  getHealthSummary(
    studentId: StudentId
  ): Promise<ServiceResult<unknown>>;

  /**
   * Searches health records across all students
   *
   * @param query - Search query string
   * @param filters - Optional filtering criteria
   * @returns Promise resolving to matching records or error
   *
   * @audit Logs READ action with search terms
   */
  searchHealthRecords(
    query: string,
    filters: HealthRecordFilterDto
  ): Promise<ServiceResult<{
    records: ReadonlyArray<HealthRecordDomain>;
    pagination: PaginationMetadata;
  }>>;

  // ============================================================================
  // IMPORT/EXPORT OPERATIONS
  // ============================================================================

  /**
   * Exports health history for a student
   *
   * @param studentId - The student identifier
   * @returns Promise resolving to export data or error
   *
   * @audit Logs EXPORT action
   */
  exportHealthHistory(
    studentId: StudentId
  ): Promise<ServiceResult<unknown>>;

  /**
   * Imports health records for a student
   *
   * @param studentId - The student identifier
   * @param importData - Health records import data
   * @returns Promise resolving to import result or error
   *
   * @audit Logs IMPORT action with record count
   */
  importHealthRecords(
    studentId: StudentId,
    importData: unknown
  ): Promise<ServiceResult<BulkOperationResultDto>>;

  // ============================================================================
  // AUDIT & COMPLIANCE
  // ============================================================================

  /**
   * Logs an access event for HIPAA compliance
   *
   * @param data - Access log data
   * @returns Promise resolving to log entry or error
   */
  logAccessEvent(
    data: LogAccessRequestDto
  ): Promise<ServiceResult<AuditLogEntryDto>>;
}
```

### Repository Interface Contract

```typescript
/**
 * @file backend/src/modules/health-records/contracts/repositories/IHealthRecordRepository.ts
 * Repository interface contract for data access abstraction
 */

import {
  HealthRecordId,
  StudentId,
  AllergyId,
  ChronicConditionId,
  HealthRecordDomain,
  AllergyDomain,
  ChronicConditionDomain,
  HealthRecordFilterDto,
  PaginationMetadata,
} from '../types';

/**
 * Repository result type
 * Provides optional error handling at repository layer
 */
export type RepositoryResult<T> =
  | { readonly found: true; readonly data: T }
  | { readonly found: false };

/**
 * Health Record Repository Contract
 * Abstracts all data access operations
 *
 * @version 1.0
 * @since 2025-01-01
 */
export interface IHealthRecordRepository {
  // ============================================================================
  // HEALTH RECORDS DATA ACCESS
  // ============================================================================

  /**
   * Finds health records by student ID with filters
   */
  findByStudentId(
    studentId: StudentId,
    filters: HealthRecordFilterDto
  ): Promise<{
    records: ReadonlyArray<HealthRecordDomain>;
    pagination: PaginationMetadata;
  }>;

  /**
   * Finds a single health record by ID
   */
  findById(
    recordId: HealthRecordId
  ): Promise<RepositoryResult<HealthRecordDomain>>;

  /**
   * Creates a new health record
   */
  create(
    data: Omit<HealthRecordDomain, 'id' | 'metadata'>
  ): Promise<HealthRecordDomain>;

  /**
   * Updates an existing health record
   */
  update(
    recordId: HealthRecordId,
    data: Partial<HealthRecordDomain>
  ): Promise<HealthRecordDomain>;

  /**
   * Deletes a health record by ID
   */
  delete(recordId: HealthRecordId): Promise<boolean>;

  /**
   * Bulk deletes multiple health records
   */
  bulkDelete(recordIds: ReadonlyArray<HealthRecordId>): Promise<number>;

  // ============================================================================
  // ALLERGIES DATA ACCESS
  // ============================================================================

  /**
   * Finds all allergies for a student
   */
  findAllergiesByStudentId(
    studentId: StudentId
  ): Promise<ReadonlyArray<AllergyDomain>>;

  /**
   * Finds an allergy by allergen name and student ID (for duplicate check)
   */
  findAllergyByAllergenAndStudent(
    studentId: StudentId,
    allergen: string
  ): Promise<RepositoryResult<AllergyDomain>>;

  /**
   * Creates a new allergy
   */
  createAllergy(
    data: Omit<AllergyDomain, 'id' | 'metadata'>
  ): Promise<AllergyDomain>;

  /**
   * Updates an existing allergy
   */
  updateAllergy(
    allergyId: AllergyId,
    data: Partial<AllergyDomain>
  ): Promise<AllergyDomain>;

  /**
   * Deletes an allergy by ID
   */
  deleteAllergy(allergyId: AllergyId): Promise<boolean>;

  // ============================================================================
  // CHRONIC CONDITIONS DATA ACCESS
  // ============================================================================

  /**
   * Finds all chronic conditions for a student
   */
  findChronicConditionsByStudentId(
    studentId: StudentId
  ): Promise<ReadonlyArray<ChronicConditionDomain>>;

  /**
   * Creates a new chronic condition
   */
  createChronicCondition(
    data: Omit<ChronicConditionDomain, 'id' | 'metadata'>
  ): Promise<ChronicConditionDomain>;

  /**
   * Updates an existing chronic condition
   */
  updateChronicCondition(
    conditionId: ChronicConditionId,
    data: Partial<ChronicConditionDomain>
  ): Promise<ChronicConditionDomain>;

  /**
   * Deletes a chronic condition by ID
   */
  deleteChronicCondition(conditionId: ChronicConditionId): Promise<boolean>;

  // ============================================================================
  // SPECIALIZED QUERIES
  // ============================================================================

  /**
   * Searches health records by query string
   */
  searchRecords(
    query: string,
    filters: HealthRecordFilterDto
  ): Promise<{
    records: ReadonlyArray<HealthRecordDomain>;
    pagination: PaginationMetadata;
  }>;

  /**
   * Finds vaccination records for a student
   */
  findVaccinationsByStudentId(
    studentId: StudentId
  ): Promise<ReadonlyArray<HealthRecordDomain>>;

  /**
   * Finds records with vital signs for growth chart
   */
  findRecordsWithVitals(
    studentId: StudentId
  ): Promise<ReadonlyArray<HealthRecordDomain>>;

  /**
   * Checks if a student exists
   */
  studentExists(studentId: StudentId): Promise<boolean>;
}
```

---

## Implementation Guide

### Directory Structure

```
backend/src/modules/health-records/
├── contracts/
│   ├── types/
│   │   ├── index.ts                 # Core types, DTOs, domain models
│   │   ├── value-objects.ts         # Branded types, value objects
│   │   ├── errors.ts                # Custom exceptions
│   │   └── validators.ts            # Type guards and validators
│   ├── services/
│   │   ├── IHealthRecordService.ts  # Service interface contract
│   │   └── IAuditService.ts         # Audit service contract
│   └── repositories/
│       └── IHealthRecordRepository.ts # Repository interface contract
├── domain/
│   ├── models/
│   │   ├── HealthRecord.ts          # Domain model with business logic
│   │   ├── Allergy.ts
│   │   └── ChronicCondition.ts
│   ├── services/
│   │   └── HealthRecordDomainService.ts # Domain logic
│   └── validators/
│       └── HealthRecordValidator.ts  # Domain validation rules
├── application/
│   ├── services/
│   │   ├── HealthRecordService.ts   # Service implementation
│   │   └── HealthRecordMapper.ts    # DTO ↔ Domain mapping
│   └── use-cases/
│       ├── CreateHealthRecord.ts    # Use case handlers
│       ├── UpdateHealthRecord.ts
│       └── DeleteHealthRecord.ts
├── infrastructure/
│   ├── repositories/
│   │   └── PrismaHealthRecordRepository.ts # Prisma implementation
│   └── mappers/
│       └── PrismaHealthRecordMapper.ts     # Prisma ↔ Domain mapping
└── presentation/
    ├── routes/
    │   └── healthRecords.routes.ts  # Route definitions
    ├── controllers/
    │   └── HealthRecordController.ts # HTTP controllers
    └── validators/
        └── RequestValidators.ts      # Joi/Zod request validation
```

### Frontend Structure

```
frontend/src/modules/health-records/
├── types/
│   ├── index.ts                     # Re-export shared types from contracts
│   └── ui-types.ts                  # UI-specific types
├── services/
│   ├── healthRecordsApi.ts          # API client implementation
│   └── healthRecordsApiContract.ts  # API client interface
├── hooks/
│   ├── useHealthRecords.ts          # React Query hooks
│   └── useHealthRecordMutations.ts
├── components/
│   ├── HealthRecordList/
│   ├── HealthRecordForm/
│   └── HealthRecordDetail/
└── utils/
    ├── mappers.ts                   # DTO ↔ UI model mapping
    └── validators.ts                # Client-side validation
```

### Type Mapper Implementation

```typescript
/**
 * @file backend/src/modules/health-records/application/services/HealthRecordMapper.ts
 * Maps between DTOs and domain models
 */

import {
  HealthRecordDomain,
  HealthRecordResponseDto,
  CreateHealthRecordRequestDto,
  VitalSignsDto,
  VitalSigns,
  HealthRecordId,
  StudentId,
  createStudentId,
} from '../../contracts/types';

export class HealthRecordMapper {
  /**
   * Maps domain model to response DTO
   */
  static toResponseDto(domain: HealthRecordDomain): HealthRecordResponseDto {
    return {
      id: domain.id,
      studentId: domain.studentId,
      type: domain.type,
      date: domain.date.toISOString(),
      description: domain.description,
      vital: domain.vital ? this.mapVitalSignsToDto(domain.vital) : undefined,
      provider: domain.provider,
      notes: domain.notes,
      attachments: [...domain.attachments],
      createdAt: domain.metadata.createdAt.toISOString(),
      updatedAt: domain.metadata.updatedAt.toISOString(),
    };
  }

  /**
   * Maps request DTO to domain creation data
   */
  static toCreateDomain(
    dto: CreateHealthRecordRequestDto,
    createdBy: string
  ): Omit<HealthRecordDomain, 'id' | 'metadata'> {
    return {
      studentId: createStudentId(dto.studentId),
      type: dto.type,
      date: new Date(dto.date),
      description: dto.description,
      vital: dto.vital ? this.mapVitalSignsToDomain(dto.vital) : undefined,
      provider: dto.provider,
      notes: dto.notes,
      attachments: dto.attachments ? [...dto.attachments] : [],
      hipaaFlags: {
        isSensitive: this.determineSensitivity(dto.type),
        requiresConsent: this.determineConsentRequirement(dto.type),
        retentionPeriodYears: 7, // HIPAA default
      },
    };
  }

  /**
   * Maps vital signs from domain to DTO
   */
  private static mapVitalSignsToDto(vitals: VitalSigns): VitalSignsDto {
    return {
      temperature: vitals.temperature?.value,
      temperatureUnit: vitals.temperature?.unit,
      bloodPressureSystolic: vitals.bloodPressure?.systolic,
      bloodPressureDiastolic: vitals.bloodPressure?.diastolic,
      heartRate: vitals.heartRate?.value,
      respiratoryRate: vitals.respiratoryRate?.value,
      oxygenSaturation: vitals.oxygenSaturation?.value,
      height: vitals.height?.value,
      heightUnit: vitals.height?.unit,
      weight: vitals.weight?.value,
      weightUnit: vitals.weight?.unit,
    };
  }

  /**
   * Maps vital signs from DTO to domain
   */
  private static mapVitalSignsToDomain(dto: VitalSignsDto): VitalSigns {
    const vitals: VitalSigns = {};

    if (dto.temperature !== undefined) {
      vitals.temperature = {
        value: dto.temperature,
        unit: dto.temperatureUnit || 'celsius',
      };
    }

    if (dto.bloodPressureSystolic !== undefined && dto.bloodPressureDiastolic !== undefined) {
      vitals.bloodPressure = {
        systolic: dto.bloodPressureSystolic,
        diastolic: dto.bloodPressureDiastolic,
        unit: 'mmHg',
      };
    }

    if (dto.heartRate !== undefined) {
      vitals.heartRate = {
        value: dto.heartRate,
        unit: 'bpm',
      };
    }

    if (dto.height !== undefined && dto.weight !== undefined) {
      const heightInMeters = dto.heightUnit === 'inches'
        ? dto.height * 0.0254
        : dto.height / 100;
      const weightInKg = dto.weightUnit === 'lbs'
        ? dto.weight * 0.453592
        : dto.weight;

      const bmi = weightInKg / (heightInMeters * heightInMeters);

      vitals.height = {
        value: dto.height,
        unit: dto.heightUnit || 'cm',
      };

      vitals.weight = {
        value: dto.weight,
        unit: dto.weightUnit || 'kg',
      };

      vitals.bmi = {
        value: Math.round(bmi * 10) / 10,
        category: this.getBmiCategory(bmi),
      };
    }

    return vitals;
  }

  private static getBmiCategory(bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  private static determineSensitivity(type: string): boolean {
    return ['MENTAL_HEALTH', 'PHYSICAL_EXAM'].includes(type);
  }

  private static determineConsentRequirement(type: string): boolean {
    return ['VACCINATION', 'PHYSICAL_EXAM'].includes(type);
  }
}
```

### Service Implementation Example

```typescript
/**
 * @file backend/src/modules/health-records/application/services/HealthRecordService.ts
 * Implementation of IHealthRecordService contract
 */

import {
  IHealthRecordService,
  ServiceResult,
} from '../../contracts/services/IHealthRecordService';
import {
  IHealthRecordRepository,
} from '../../contracts/repositories/IHealthRecordRepository';
import {
  HealthRecordId,
  StudentId,
  HealthRecordDomain,
  CreateHealthRecordRequestDto,
  UpdateHealthRecordRequestDto,
  HealthRecordFilterDto,
  ResourceNotFoundError,
  ValidationError,
  createStudentId,
} from '../../contracts/types';
import { HealthRecordMapper } from './HealthRecordMapper';
import { HealthRecordValidator } from '../../domain/validators/HealthRecordValidator';
import { IAuditService } from '../../contracts/services/IAuditService';
import { injectable, inject } from 'tsyringe';

/**
 * Health Record Service Implementation
 * Orchestrates business logic and data access
 */
@injectable()
export class HealthRecordService implements IHealthRecordService {
  constructor(
    @inject('IHealthRecordRepository')
    private readonly repository: IHealthRecordRepository,
    @inject('IAuditService')
    private readonly auditService: IAuditService,
    private readonly mapper: HealthRecordMapper,
    private readonly validator: HealthRecordValidator
  ) {}

  /**
   * Get student health records with filtering
   */
  async getStudentHealthRecords(
    studentId: StudentId,
    filters: HealthRecordFilterDto
  ): Promise<ServiceResult<{
    records: ReadonlyArray<HealthRecordDomain>;
    pagination: any;
  }>> {
    try {
      // Validate student exists
      const studentExists = await this.repository.studentExists(studentId);
      if (!studentExists) {
        throw new ResourceNotFoundError('Student', studentId);
      }

      // Fetch records
      const result = await this.repository.findByStudentId(studentId, filters);

      // Audit log
      await this.auditService.logAccess({
        action: 'READ',
        resourceType: 'HEALTH_RECORD',
        studentId,
        details: { filters, recordCount: result.records.length },
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error instanceof DomainException ? error.details : undefined,
        },
      };
    }
  }

  /**
   * Create new health record
   */
  async createHealthRecord(
    data: CreateHealthRecordRequestDto
  ): Promise<ServiceResult<HealthRecordDomain>> {
    try {
      // Validate input
      const validationResult = this.validator.validateCreateRequest(data);
      if (!validationResult.isValid) {
        throw new ValidationError(
          'Invalid health record data',
          'VALIDATION_ERROR',
          validationResult.errors
        );
      }

      // Verify student exists
      const studentId = createStudentId(data.studentId);
      const studentExists = await this.repository.studentExists(studentId);
      if (!studentExists) {
        throw new ResourceNotFoundError('Student', data.studentId);
      }

      // Map to domain
      const domainData = this.mapper.toCreateDomain(data, 'current-user-id'); // TODO: Get from auth context

      // Create record
      const record = await this.repository.create(domainData);

      // Audit log
      await this.auditService.logCreate({
        resourceType: 'HEALTH_RECORD',
        resourceId: record.id,
        studentId,
        data: record,
      });

      return {
        success: true,
        data: record,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error instanceof DomainException ? error.details : undefined,
        },
      };
    }
  }

  // ... Additional method implementations
}
```

---

## Migration Strategy

### Phase 1: Type Foundation (Week 1-2)

1. **Create Type Definitions**
   - Define all contract types in `backend/src/modules/health-records/contracts/types/`
   - Define service interfaces in `backend/src/modules/health-records/contracts/services/`
   - Define repository interfaces in `backend/src/modules/health-records/contracts/repositories/`

2. **Share Types with Frontend**
   - Create shared types package or symlink contracts directory
   - Update frontend to import types from contracts
   - Ensure build process includes type generation

### Phase 2: Repository Abstraction (Week 3-4)

1. **Create Repository Interface**
   - Define `IHealthRecordRepository` contract
   - Implement `PrismaHealthRecordRepository` with mapper

2. **Update Service Layer**
   - Inject repository interface instead of direct Prisma usage
   - Add dependency injection container (e.g., TSyringe, InversifyJS)

### Phase 3: Service Contract Implementation (Week 5-6)

1. **Implement Service Interface**
   - Create `HealthRecordService` implementing `IHealthRecordService`
   - Add comprehensive error handling with typed errors
   - Implement audit logging

2. **Create Mappers**
   - DTO to Domain mappers
   - Domain to DTO mappers
   - Prisma to Domain mappers

### Phase 4: Controller/Route Updates (Week 7-8)

1. **Update Controllers**
   - Remove `any` types from route handlers
   - Use DTOs for request/response
   - Add proper TypeScript error handling

2. **Update Validation**
   - Align Joi schemas with DTO types
   - Add runtime validation that matches type contracts

### Phase 5: Frontend Integration (Week 9-10)

1. **Update API Client**
   - Use typed DTOs for all API calls
   - Implement typed error handling
   - Update React Query hooks with proper types

2. **Update Components**
   - Use domain types in UI components
   - Add type-safe form handling
   - Implement typed state management

### Phase 6: Testing & Documentation (Week 11-12)

1. **Add Type Tests**
   - Create type-only tests to verify contract adherence
   - Add integration tests for type safety

2. **Update Documentation**
   - Generate API documentation from types
   - Create developer guides
   - Add migration examples

---

## Best Practices

### 1. Branded Types for IDs

**Why**: Prevents mixing up different ID types at compile time

```typescript
// Bad - can accidentally pass wrong ID type
function getRecord(studentId: string, recordId: string) {}

// Good - compiler catches type errors
function getRecord(studentId: StudentId, recordId: HealthRecordId) {}
```

### 2. Readonly Properties

**Why**: Prevents accidental mutations, enforces immutability

```typescript
// Bad
interface HealthRecord {
  id: string;
  data: VitalSigns;
}

// Good
interface HealthRecord {
  readonly id: HealthRecordId;
  readonly data: Readonly<VitalSigns>;
}
```

### 3. Discriminated Unions for Results

**Why**: Forces exhaustive error handling, type-safe success/failure

```typescript
// Bad
async function getRecord(): Promise<HealthRecord | null> {}

// Good
async function getRecord(): Promise<ServiceResult<HealthRecord>> {}

// Usage
const result = await service.getRecord(id);
if (result.success) {
  // TypeScript knows result.data exists
  console.log(result.data.type);
} else {
  // TypeScript knows result.error exists
  console.error(result.error.message);
}
```

### 4. Smart Constructors

**Why**: Centralizes validation, prevents invalid state

```typescript
// Instead of allowing direct creation
const id: StudentId = "123" as StudentId; // Bad

// Use factory function
const id = createStudentId("123"); // Validates and throws if invalid
```

### 5. Explicit Dependency Injection

**Why**: Testable, loosely coupled, follows SOLID principles

```typescript
// Bad - hard-coded dependencies
class HealthRecordService {
  private repo = new PrismaHealthRecordRepository();
}

// Good - injected dependencies
class HealthRecordService {
  constructor(
    @inject('IHealthRecordRepository')
    private readonly repo: IHealthRecordRepository
  ) {}
}
```

### 6. Separate DTOs from Domain Models

**Why**: API contracts can evolve independently of domain logic

```typescript
// Domain model - internal representation
interface HealthRecordDomain {
  readonly id: HealthRecordId;
  readonly metadata: ComplexMetadata;
  // Business logic methods
}

// DTO - API contract
interface HealthRecordResponseDto {
  readonly id: string;
  readonly createdAt: string;
  // Simple, serializable data
}
```

### 7. Version API Contracts

**Why**: Allows backward compatibility during API evolution

```typescript
// Version 1
namespace HealthRecordsV1 {
  export interface HealthRecordResponseDto { /* ... */ }
}

// Version 2 with breaking changes
namespace HealthRecordsV2 {
  export interface HealthRecordResponseDto { /* ... */ }
}
```

### 8. Type Guards for Runtime Validation

**Why**: Bridges compile-time and runtime type safety

```typescript
export function isHealthRecordType(value: unknown): value is HealthRecordType {
  return typeof value === 'string' &&
    Object.values(HealthRecordType).includes(value as HealthRecordType);
}

// Usage
if (isHealthRecordType(input.type)) {
  // TypeScript knows input.type is HealthRecordType
}
```

### 9. Audit Everything

**Why**: HIPAA compliance requires comprehensive audit logs

```typescript
// Every service method should log access
await this.auditService.logAccess({
  action: 'READ',
  resourceType: 'HEALTH_RECORD',
  resourceId: record.id,
  studentId: record.studentId,
  details: { /* context */ },
});
```

### 10. Error Type Hierarchy

**Why**: Type-safe error handling with specific error types

```typescript
// Define error hierarchy
class DomainException extends Error {}
class ValidationError extends DomainException {}
class ResourceNotFoundError extends DomainException {}
class HipaaViolationError extends DomainException {}

// Type-safe error handling
try {
  await service.getRecord(id);
} catch (error) {
  if (error instanceof ResourceNotFoundError) {
    // Handle 404
  } else if (error instanceof HipaaViolationError) {
    // Handle security violation
  }
}
```

---

## Conclusion

This design provides a comprehensive, enterprise-grade type system for the Health Records module with:

- **Full type safety** from database to UI
- **Clear contracts** between all layers
- **HIPAA-compliant** audit logging
- **Scalable architecture** supporting future growth
- **Maintainable codebase** with self-documenting types

Implementation should follow the phased migration strategy to minimize disruption while progressively improving type safety across the entire module.

---

## Appendix A: Type Cheat Sheet

```typescript
// Creating branded types
type BrandedId = string & { __brand: 'BrandedId' };

// Readonly arrays
ReadonlyArray<T> or readonly T[]

// Readonly objects
Readonly<T> or { readonly key: value }

// Discriminated unions
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

// Type guards
function isType(value: unknown): value is Type {
  // validation logic
  return true;
}

// Utility types
Partial<T>           // All properties optional
Required<T>          // All properties required
Pick<T, K>          // Select specific properties
Omit<T, K>          // Exclude specific properties
Record<K, T>        // Key-value mapping
```

---

## Appendix B: File Organization Checklist

- [ ] Create `contracts/types/index.ts`
- [ ] Create `contracts/services/IHealthRecordService.ts`
- [ ] Create `contracts/repositories/IHealthRecordRepository.ts`
- [ ] Create `domain/models/` directory
- [ ] Create `application/services/` directory
- [ ] Create `infrastructure/repositories/` directory
- [ ] Create `presentation/controllers/` directory
- [ ] Setup dependency injection container
- [ ] Configure TypeScript strict mode
- [ ] Add ESLint rules for type safety
- [ ] Create type-only test files
- [ ] Generate API documentation from types

---

**End of Document**
