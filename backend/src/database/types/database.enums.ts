/**
 * Database Enumerations
 * Common enums used across database layer
 */

/**
 * Transaction isolation levels
 */
export enum TransactionIsolationLevel {
  ReadUncommitted = 'ReadUncommitted',
  ReadCommitted = 'ReadCommitted',
  RepeatableRead = 'RepeatableRead',
  Serializable = 'Serializable'
}

/**
 * Cache eviction policies
 */
export enum CacheEvictionPolicy {
  /**
   * Least Recently Used
   */
  LRU = 'LRU',

  /**
   * Least Frequently Used
   */
  LFU = 'LFU',

  /**
   * First In First Out
   */
  FIFO = 'FIFO',

  /**
   * Time To Live
   */
  TTL = 'TTL'
}

/**
 * Cache TTL (Time To Live) constants
 */
export enum CacheTTL {
  /**
   * 5 minutes
   */
  SHORT = 300,

  /**
   * 15 minutes
   */
  MEDIUM = 900,

  /**
   * 30 minutes
   */
  LONG = 1800,

  /**
   * 1 hour
   */
  HOUR = 3600,

  /**
   * 1 day
   */
  DAY = 86400
}

/**
 * Audit actions for logging
 */
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT',
  PRINT = 'PRINT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  IMPORT = 'IMPORT',
  BULK_DELETE = 'BULK_DELETE',
  BULK_UPDATE = 'BULK_UPDATE',
  TRANSACTION_COMMIT = 'TRANSACTION_COMMIT',
  TRANSACTION_ROLLBACK = 'TRANSACTION_ROLLBACK',
  CACHE_READ = 'CACHE_READ',
  CACHE_WRITE = 'CACHE_WRITE',
  CACHE_DELETE = 'CACHE_DELETE',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR = 'SERVER_ERROR',
  HEALTHCARE_ERROR = 'HEALTHCARE_ERROR',
  COMPLIANCE_ERROR = 'COMPLIANCE_ERROR',
  SECURITY_ERROR = 'SECURITY_ERROR',
  APPLICATION_ERROR = 'APPLICATION_ERROR'
}

/**
 * PHI (Protected Health Information) entity types
 * These require mandatory audit logging
 */
export const PHI_ENTITY_TYPES = [
  'HealthRecord',
  'Allergy',
  'ChronicCondition',
  'Student',
  'StudentMedication',
  'MedicationLog',
  'IncidentReport',
  'EmergencyContact',
  'Vaccination',
  'Screening',
  'VitalSigns',
  'GrowthMeasurement'
] as const;

export type PHIEntityType = (typeof PHI_ENTITY_TYPES)[number];

/**
 * Sensitive field names to redact in audit logs
 */
export const SENSITIVE_FIELDS = [
  'password',
  'ssn',
  'socialSecurityNumber',
  'taxId',
  'creditCard',
  'bankAccount',
  'apiKey',
  'secret',
  'token'
] as const;

/**
 * Entity-specific cache TTL configuration
 */
export const ENTITY_CACHE_TTL: Record<string, number> = {
  HealthRecord: CacheTTL.SHORT,
  Allergy: CacheTTL.LONG,
  ChronicCondition: CacheTTL.MEDIUM,
  Student: CacheTTL.LONG,
  StudentMedication: CacheTTL.SHORT,
  User: CacheTTL.LONG,
  Appointment: CacheTTL.SHORT,
  Vaccination: CacheTTL.MEDIUM,
  Screening: CacheTTL.MEDIUM,
  VitalSigns: CacheTTL.SHORT,
  District: CacheTTL.DAY,
  School: CacheTTL.DAY,
  Role: CacheTTL.DAY,
  Permission: CacheTTL.DAY
};

/**
 * Determines if an entity type contains Protected Health Information (PHI)
 */
export function isPHIEntity(entityType: string): boolean {
  return PHI_ENTITY_TYPES.includes(entityType as PHIEntityType);
}

/**
 * Retrieves the recommended cache TTL for a given entity type
 */
export function getCacheTTL(entityType: string): number {
  return ENTITY_CACHE_TTL[entityType] || CacheTTL.MEDIUM;
}
