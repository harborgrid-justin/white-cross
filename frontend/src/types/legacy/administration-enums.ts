/**
 * WF-COMP-315 | administration-enums.ts - Administration Module Enums
 * Purpose: Centralized enum definitions for the administration module
 * Upstream: None | Dependencies: None
 * Downstream: All administration type modules | Called by: Administration components
 * Related: administration-*.ts files
 * Exports: All administration-related enums
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions for admin operations
 * LLM Context: Enum definitions for administration module, no dependencies
 */

/**
 * Administration Module Enums
 *
 * Centralized enum definitions for:
 * - System configuration categories and types
 * - Backup operations
 * - Performance metrics
 * - License management
 * - Training modules
 * - Audit logging
 * - User roles
 */

// ==================== CONFIGURATION ENUMS ====================

/**
 * Configuration category types
 */
export enum ConfigCategory {
  GENERAL = 'GENERAL',
  SECURITY = 'SECURITY',
  NOTIFICATION = 'NOTIFICATION',
  INTEGRATION = 'INTEGRATION',
  BACKUP = 'BACKUP',
  PERFORMANCE = 'PERFORMANCE',
  HEALTHCARE = 'HEALTHCARE',
  MEDICATION = 'MEDICATION',
  APPOINTMENTS = 'APPOINTMENTS',
  UI = 'UI',
  QUERY = 'QUERY',
  FILE_UPLOAD = 'FILE_UPLOAD',
  RATE_LIMITING = 'RATE_LIMITING',
  SESSION = 'SESSION',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

/**
 * Configuration value data types
 */
export enum ConfigValueType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  ARRAY = 'ARRAY',
  DATE = 'DATE',
  TIME = 'TIME',
  DATETIME = 'DATETIME',
  EMAIL = 'EMAIL',
  URL = 'URL',
  COLOR = 'COLOR',
  ENUM = 'ENUM',
}

/**
 * Configuration scope levels
 */
export enum ConfigScope {
  SYSTEM = 'SYSTEM',
  DISTRICT = 'DISTRICT',
  SCHOOL = 'SCHOOL',
  USER = 'USER',
}

// ==================== BACKUP ENUMS ====================

/**
 * Backup types
 */
export enum BackupType {
  AUTOMATIC = 'AUTOMATIC',
  MANUAL = 'MANUAL',
  SCHEDULED = 'SCHEDULED',
}

/**
 * Backup status
 */
export enum BackupStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// ==================== PERFORMANCE ENUMS ====================

/**
 * Performance metric types
 */
export enum MetricType {
  CPU_USAGE = 'CPU_USAGE',
  MEMORY_USAGE = 'MEMORY_USAGE',
  DISK_USAGE = 'DISK_USAGE',
  API_RESPONSE_TIME = 'API_RESPONSE_TIME',
  DATABASE_QUERY_TIME = 'DATABASE_QUERY_TIME',
  ACTIVE_USERS = 'ACTIVE_USERS',
  ERROR_RATE = 'ERROR_RATE',
  REQUEST_COUNT = 'REQUEST_COUNT',
}

// ==================== LICENSE ENUMS ====================

/**
 * License types
 */
export enum LicenseType {
  TRIAL = 'TRIAL',
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

/**
 * License status
 */
export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
}

// ==================== TRAINING ENUMS ====================

/**
 * Training module categories
 */
export enum TrainingCategory {
  HIPAA_COMPLIANCE = 'HIPAA_COMPLIANCE',
  MEDICATION_MANAGEMENT = 'MEDICATION_MANAGEMENT',
  EMERGENCY_PROCEDURES = 'EMERGENCY_PROCEDURES',
  SYSTEM_TRAINING = 'SYSTEM_TRAINING',
  SAFETY_PROTOCOLS = 'SAFETY_PROTOCOLS',
  DATA_SECURITY = 'DATA_SECURITY',
}

// ==================== AUDIT ENUMS ====================

/**
 * Audit log actions
 */
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  BACKUP = 'BACKUP',
  RESTORE = 'RESTORE',
}

// ==================== USER ENUMS ====================

/**
 * User roles
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  NURSE = 'NURSE',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  VIEWER = 'VIEWER',
  COUNSELOR = 'COUNSELOR',
}
