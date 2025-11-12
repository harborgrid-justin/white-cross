/**
 * WF-COMP-319 | common.ts - Common Types Re-export Module
 * Purpose: Backward-compatible barrel export for refactored common types
 * Upstream: Modular type files | Dependencies: All type modules
 * Downstream: Legacy imports | Called by: Existing components
 * Related: All type modules
 * Exports: All common types | Key Features: Backward compatibility
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Import resolution → Type availability
 * LLM Context: Barrel export for backward compatibility after refactoring
 */

/**
 * Common Types Module - Barrel Export
 *
 * This file has been refactored to improve maintainability.
 * The original 742-line file has been split into smaller, focused modules:
 *
 * - api-responses.ts - API response wrappers, pagination, search parameters
 * - enumerations.ts - All enumeration type aliases
 * - base-entities.ts - Base entity interfaces (BaseEntity, BasePersonEntity, etc.)
 * - utility-types.ts - Type transformation helpers (CreateRequest, UpdateRequest, etc.)
 * - user-types.ts - User entity and authentication types
 * - healthcare-entities.ts - Healthcare-specific entities (Student, EmergencyContact, etc.)
 * - communication-types.ts - Notification and communication types
 * - document-types.ts - File upload and document reference types
 * - system-types.ts - Audit, permission, configuration, and integration types
 *
 * This file now serves as a barrel export to maintain backward compatibility
 * with existing imports. You can continue importing from './common' or switch
 * to importing directly from the specific modules.
 *
 * @module types/core/common
 * @category Types
 */

// ============================================================================
// API RESPONSE AND SEARCH TYPES
// ============================================================================
export type {
  ApiResponse,
  PaginatedResponse,
  PaginationResponse,
  PaginationParams,
  DateRangeFilter,
  SearchParams,
  BaseFilters,
  PersonFilters,
  SortParams,
  PaginatedRequest,
  ValidationError,
  ApiError,
} from './api-responses';

// ============================================================================
// ENUMERATION TYPES
// ============================================================================
export type {
  UserRole,
  Gender,
  ContactPriority,
  AllergySeverity,
  MedicationRoute,
  IncidentType,
  InventoryTransactionType,
  PurchaseOrderStatus,
  ComplianceStatus,
  MessagePriority,
  MessageCategory,
  DeliveryStatus,
  RecipientType,
  NotificationMethod,
  Priority,
  Status,
} from './enumerations';

// ============================================================================
// BASE ENTITY INTERFACES
// ============================================================================
export type {
  BaseEntity,
  BasePersonEntity,
  BaseAddressEntity,
  BaseAuditEntity,
} from './base-entities';

// ============================================================================
// UTILITY TYPES
// ============================================================================
export type {
  CreateRequest,
  UpdateRequest,
  EntityWithOptionalDates,
} from './utility-types';

// ============================================================================
// USER TYPES
// ============================================================================
export type {
  User,
} from './user-types';

// ============================================================================
// HEALTHCARE ENTITY TYPES
// ============================================================================
export type {
  HealthcareProvider,
  EmergencyContact,
  Student,
} from './healthcare-entities';

// ============================================================================
// COMMUNICATION TYPES
// ============================================================================
export type {
  NotificationPreferences,
  CommunicationLog,
} from './communication-types';

// ============================================================================
// DOCUMENT TYPES
// ============================================================================
export type {
  FileUpload,
  DocumentReference,
} from './document-types';

// ============================================================================
// SYSTEM TYPES
// ============================================================================
export type {
  AuditLog,
  PermissionCheck,
  SystemSettings,
  IntegrationStatus,
} from './system-types';
