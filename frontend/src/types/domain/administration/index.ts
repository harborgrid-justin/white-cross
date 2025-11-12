/**
 * WF-COMP-315 | administration/index.ts - Type definitions
 * Purpose: Central export point for all administration type definitions
 * Upstream: All administration module files | Dependencies: All administration types
 * Downstream: Application components | Called by: Import statements
 * Related: All administration type files
 * Exports: All types from administration module | Key Features: Re-export aggregation
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Main entry point for administration types
 * LLM Context: Central export file maintaining backward compatibility
 */

/**
 * Administration Module Types - Central Export
 *
 * This file re-exports all types from the administration module to maintain
 * backward compatibility and provide a single import point.
 *
 * Usage:
 *   import { District, School, License } from '@/types/domain/administration';
 */

// ==================== ENUMS ====================
export {
  ConfigCategory,
  ConfigValueType,
  ConfigScope,
  BackupType,
  BackupStatus,
  MetricType,
  LicenseType,
  LicenseStatus,
  TrainingCategory,
  AuditAction,
  UserRole,
} from './enums';

// ==================== DISTRICT & SCHOOL TYPES ====================
export type {
  District,
  CreateDistrictData,
  UpdateDistrictData,
  School,
  CreateSchoolData,
  UpdateSchoolData,
} from './districts';

// ==================== SYSTEM CONFIGURATION TYPES ====================
export type {
  SystemConfiguration,
  ConfigurationHistory,
  ConfigurationData,
  SystemSettings,
  SystemSettingItem,
} from './configuration';

// ==================== LICENSE MANAGEMENT TYPES ====================
export type {
  License,
  CreateLicenseData,
  UpdateLicenseData,
} from './licenses';

// ==================== BACKUP & RECOVERY TYPES ====================
export type {
  BackupLog,
  CreateBackupData,
} from './backups';

// ==================== PERFORMANCE MONITORING TYPES ====================
export type {
  PerformanceMetric,
  SystemHealth,
  RecordMetricData,
} from './performance';

// ==================== TRAINING MODULE TYPES ====================
export type {
  TrainingModule,
  TrainingCompletion,
  CreateTrainingModuleData,
  UpdateTrainingModuleData,
  RecordTrainingCompletionData,
  UserTrainingProgress,
} from './training';

// ==================== USER MANAGEMENT TYPES ====================
export type {
  User,
  CreateUserData,
  UpdateUserData,
} from './users';

// ==================== AUDIT LOGGING TYPES ====================
export type {
  AuditLog,
  CreateAuditLogData,
} from './audit';

// ==================== PAGINATION & FILTER TYPES ====================
export type {
  PaginationParams,
  PaginationResult,
  PaginatedResponse,
  UserFilters,
  AuditLogFilters,
  MetricFilters,
} from './shared';

// ==================== API RESPONSE TYPES ====================
export type {
  ApiResponse,
  SuccessResponse,
} from './shared';

// ==================== TYPE GUARDS ====================
export {
  isConfigCategory,
  isLicenseType,
  isTrainingCategory,
  isUserRole,
  isMetricType,
  isAuditAction,
} from './shared';
