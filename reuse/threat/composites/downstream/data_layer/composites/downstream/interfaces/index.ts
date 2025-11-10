/**
 * @fileoverview Barrel Export for All Interfaces
 * @module interfaces
 * @description Central export point for all type definitions, interfaces, enums, and DTOs
 */

// ============================================================================
// BASE ENTITY INTERFACES
// ============================================================================
export * from './models/base-entity.interface';

// ============================================================================
// DOMAIN MODEL INTERFACES
// ============================================================================
export * from './models/threat-intelligence.interface';
export * from './models/incident.interface';
export * from './models/vulnerability.interface';
export * from './models/user.interface';
export * from './models/audit-log.interface';
export * from './models/patient.interface';

// ============================================================================
// ENUMERATIONS
// ============================================================================
export * from './enums/threat-types.enum';
export * from './enums/incident-types.enum';
export * from './enums/vulnerability-types.enum';
export * from './enums/common-types.enum';

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================
export * from './dtos/query-options.dto';

/**
 * Type-safe model registry
 * Maps model names to their interface types
 */
export interface IModelRegistry {
  ThreatIntelligence: import('./models/threat-intelligence.interface').IThreatIntelligence;
  Incident: import('./models/incident.interface').IIncident;
  Vulnerability: import('./models/vulnerability.interface').IVulnerability;
  User: import('./models/user.interface').IUser;
  AuditLog: import('./models/audit-log.interface').IAuditLog;
  Patient: import('./models/patient.interface').IPatient;
}

/**
 * Model name type - ensures type safety when referencing models by name
 */
export type ModelName = keyof IModelRegistry;

/**
 * Generic model type - get the interface type from a model name
 */
export type ModelType<T extends ModelName> = IModelRegistry[T];

/**
 * Utility type for partial model updates
 */
export type PartialModel<T extends ModelName> = Partial<ModelType<T>>;

/**
 * Utility type for model creation (without base fields)
 */
export type CreateModel<T extends ModelName> = Omit<
  ModelType<T>,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'version' | 'createdBy' | 'updatedBy'
>;

/**
 * Utility type for model updates (without immutable fields)
 */
export type UpdateModel<T extends ModelName> = Partial<
  Omit<ModelType<T>, 'id' | 'createdAt' | 'createdBy'>
>;

/**
 * Type guard to check if a value is a valid ModelName
 */
export function isModelName(value: string): value is ModelName {
  const validModels: ModelName[] = [
    'ThreatIntelligence',
    'Incident',
    'Vulnerability',
    'User',
    'AuditLog',
    'Patient'
  ];
  return validModels.includes(value as ModelName);
}

/**
 * Helper type for API responses
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

/**
 * Helper type for paginated API responses
 */
export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Helper type for validation errors
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  constraints?: Record<string, string>;
}

/**
 * Helper type for bulk operations
 */
export interface BulkOperationResult<T = any> {
  successful: T[];
  failed: Array<{
    item: T;
    error: string;
  }>;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
}

/**
 * Helper type for entity relationships
 */
export interface EntityRelation {
  type: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  model: ModelName;
  foreignKey?: string;
  through?: string;
}

/**
 * Helper type for soft delete support
 */
export interface SoftDeletable {
  deletedAt?: Date | null;
  isDeleted?: boolean;
}

/**
 * Helper type for timestamped entities
 */
export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Helper type for versioned entities
 */
export interface Versioned {
  version: number;
}

/**
 * Helper type for tenant-scoped entities (multi-tenancy)
 */
export interface TenantScoped {
  tenantId: string;
}

/**
 * Helper type for user-tracked entities
 */
export interface UserTracked {
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Complete entity type combining common traits
 */
export interface CompleteEntity extends Timestamped, SoftDeletable, Versioned, UserTracked, TenantScoped {
  id: string | number;
  metadata?: Record<string, any>;
}
