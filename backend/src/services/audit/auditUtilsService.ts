/**
 * LOC: 1935BD161A
 * WC-GEN-220 | auditUtilsService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (shared/logging/logger.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (services/audit/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/audit/index.ts)
 */

/**
 * WC-GEN-220 | auditUtilsService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../shared/logging/logger, ../../database/types/enums, ./types | Dependencies: ../../shared/logging/logger, ../../database/types/enums, ./types
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, constants | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { logger } from '../../shared/logging/logger';
import { AuditAction } from '../../database/types/enums';
import { PHIAccessType, PHIDataCategory } from './types';

/**
 * AuditUtilsService - Utility functions and helpers for audit operations
 * 
 * Provides common utility functions, validation helpers, constants,
 * and shared functionality used across all audit services.
 */
export class AuditUtilsService {
  /**
   * Validate audit log entry data
   *
   * @param entry - Audit log entry to validate
   * @returns Validation result with errors if any
   */
  static validateAuditEntry(entry: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!entry.action) {
      errors.push('Action is required');
    }

    if (!entry.entityType) {
      errors.push('Entity type is required');
    }

    // Validate action type
    if (entry.action && !Object.values(AuditAction).includes(entry.action) && typeof entry.action !== 'string') {
      errors.push('Invalid action type');
    }

    // Validate entity type
    if (entry.entityType && typeof entry.entityType !== 'string') {
      errors.push('Entity type must be a string');
    }

    // Validate user ID format if provided
    if (entry.userId && (typeof entry.userId !== 'string' || entry.userId.trim() === '')) {
      errors.push('User ID must be a non-empty string');
    }

    // Validate IP address format if provided
    if (entry.ipAddress && !this.isValidIPAddress(entry.ipAddress)) {
      errors.push('Invalid IP address format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate PHI access log entry
   *
   * @param entry - PHI access log entry to validate
   * @returns Validation result with errors if any
   */
  static validatePHIEntry(entry: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // First validate as regular audit entry
    const baseValidation = this.validateAuditEntry(entry);
    errors.push(...baseValidation.errors);

    // PHI-specific validations
    if (!entry.studentId) {
      errors.push('Student ID is required for PHI access');
    }

    if (!entry.accessType) {
      errors.push('Access type is required for PHI access');
    } else if (!['READ', 'WRITE', 'DELETE', 'EXPORT'].includes(entry.accessType)) {
      errors.push('Invalid PHI access type');
    }

    if (!entry.dataCategory) {
      errors.push('Data category is required for PHI access');
    } else if (!this.isValidPHIDataCategory(entry.dataCategory)) {
      errors.push('Invalid PHI data category');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if a string is a valid IP address
   *
   * @param ip - IP address to validate
   * @returns True if valid IP address
   */
  static isValidIPAddress(ip: string): boolean {
    // IPv4 regex
    const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // IPv6 regex (simplified)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  /**
   * Check if a data category is valid for PHI
   *
   * @param category - Data category to validate
   * @returns True if valid PHI data category
   */
  static isValidPHIDataCategory(category: string): boolean {
    const validCategories: PHIDataCategory[] = [
      'HEALTH_RECORD',
      'MEDICATION',
      'ALLERGY',
      'VACCINATION',
      'DIAGNOSIS',
      'TREATMENT',
      'CHRONIC_CONDITION',
      'SCREENING',
      'VITAL_SIGNS',
      'GROWTH_MEASUREMENT'
    ];

    return validCategories.includes(category as PHIDataCategory);
  }

  /**
   * Check if an access type is valid for PHI
   *
   * @param accessType - Access type to validate
   * @returns True if valid PHI access type
   */
  static isValidPHIAccessType(accessType: string): boolean {
    const validTypes: PHIAccessType[] = ['READ', 'WRITE', 'DELETE', 'EXPORT'];
    return validTypes.includes(accessType as PHIAccessType);
  }

  /**
   * Sanitize audit log data for storage
   *
   * @param data - Raw audit data
   * @returns Sanitized audit data
   */
  static sanitizeAuditData(data: any): any {
    const sanitized = { ...data };

    // Remove or mask sensitive information
    if (sanitized.password) {
      delete sanitized.password;
    }

    if (sanitized.token) {
      sanitized.token = '***REDACTED***';
    }

    if (sanitized.apiKey) {
      sanitized.apiKey = '***REDACTED***';
    }

    // Truncate very long strings
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 1000) {
        sanitized[key] = sanitized[key].substring(0, 1000) + '... [TRUNCATED]';
      }
    });

    return sanitized;
  }

  /**
   * Generate audit log summary
   *
   * @param action - Action performed
   * @param entityType - Type of entity
   * @param entityId - ID of entity (optional)
   * @param userId - User who performed action (optional)
   * @returns Human-readable summary
   */
  static generateAuditSummary(
    action: string,
    entityType: string,
    entityId?: string,
    userId?: string
  ): string {
    const userText = userId ? ` by user ${userId}` : ' by system';
    const entityText = entityId ? ` ${entityType} (ID: ${entityId})` : ` ${entityType}`;
    
    return `${action} performed on${entityText}${userText}`;
  }

  /**
   * Calculate time elapsed between two dates
   *
   * @param start - Start date
   * @param end - End date
   * @returns Human-readable time elapsed
   */
  static calculateTimeElapsed(start: Date, end: Date): string {
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day(s), ${diffHours} hour(s)`;
    } else if (diffHours > 0) {
      return `${diffHours} hour(s), ${diffMinutes} minute(s)`;
    } else {
      return `${diffMinutes} minute(s)`;
    }
  }

  /**
   * Format audit log for display
   *
   * @param log - Audit log entry
   * @returns Formatted log entry
   */
  static formatAuditLog(log: any): any {
    return {
      id: log.id,
      timestamp: log.createdAt?.toISOString(),
      user: log.userId || 'SYSTEM',
      action: log.action,
      entity: log.entityType,
      entityId: log.entityId,
      summary: this.generateAuditSummary(log.action, log.entityType, log.entityId, log.userId),
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      success: log.changes?.success !== false,
      changes: this.sanitizeAuditData(log.changes || {})
    };
  }

  /**
   * Extract IP address from request-like object
   *
   * @param req - Request object or IP string
   * @returns IP address string
   */
  static extractIPAddress(req: any): string | undefined {
    if (typeof req === 'string') {
      return req;
    }

    // Try various common headers for IP address
    return req?.ip ||
           req?.connection?.remoteAddress ||
           req?.socket?.remoteAddress ||
           req?.headers?.['x-forwarded-for']?.split(',')[0] ||
           req?.headers?.['x-real-ip'] ||
           undefined;
  }

  /**
   * Extract user agent from request-like object
   *
   * @param req - Request object or user agent string
   * @returns User agent string
   */
  static extractUserAgent(req: any): string | undefined {
    if (typeof req === 'string') {
      return req;
    }

    return req?.headers?.['user-agent'] || req?.userAgent || undefined;
  }

  /**
   * Check if action requires PHI logging
   *
   * @param action - Action to check
   * @param entityType - Entity type being accessed
   * @returns True if action requires PHI logging
   */
  static requiresPHILogging(action: string, entityType: string): boolean {
    const phiEntityTypes = [
      'HealthRecord',
      'MedicalHistory',
      'Medication',
      'Allergy',
      'Vaccination',
      'ScreeningResult',
      'VitalSigns',
      'GrowthMeasurement',
      'ChronicCondition'
    ];

    return phiEntityTypes.includes(entityType);
  }

  /**
   * Get risk level for action
   *
   * @param action - Action performed
   * @param entityType - Entity type
   * @param changes - Changes made
   * @returns Risk level (LOW, MEDIUM, HIGH, CRITICAL)
   */
  static getRiskLevel(action: string, entityType: string, changes?: any): string {
    // Critical risk actions
    if (['DELETE', 'BULK_DELETE', 'EXPORT'].includes(action.toUpperCase())) {
      return 'CRITICAL';
    }

    // High risk actions
    if (['UPDATE', 'MODIFY', 'BULK_UPDATE'].includes(action.toUpperCase())) {
      return 'HIGH';
    }

    // Medium risk for PHI access
    if (this.requiresPHILogging(action, entityType)) {
      return 'MEDIUM';
    }

    // Low risk for read operations
    return 'LOW';
  }

  /**
   * Check if audit log entry indicates a security concern
   *
   * @param log - Audit log entry
   * @returns True if entry indicates security concern
   */
  static isSecurityConcern(log: any): boolean {
    const changes = log.changes || {};
    
    // Failed login attempts
    if (log.action === 'LOGIN' && changes.success === false) {
      return true;
    }

    // After hours access (outside 6 AM - 8 PM)
    const hour = log.createdAt?.getHours();
    if (hour && (hour < 6 || hour > 20)) {
      return true;
    }

    // Bulk operations
    if (log.action?.toUpperCase().includes('BULK')) {
      return true;
    }

    // Export operations
    if (log.action?.toUpperCase().includes('EXPORT')) {
      return true;
    }

    return false;
  }

  /**
   * Generate compliance-friendly audit summary
   *
   * @param logs - Array of audit logs
   * @param period - Time period for the summary
   * @returns Compliance summary
   */
  static generateComplianceSummary(logs: any[], period: { start: Date; end: Date }) {
    const totalLogs = logs.length;
    const phiLogs = logs.filter(log => log.changes?.isPHIAccess);
    const failedActions = logs.filter(log => log.changes?.success === false);
    const securityConcerns = logs.filter(log => this.isSecurityConcern(log));

    const uniqueUsers = new Set(logs.map(log => log.userId).filter(Boolean)).size;
    const uniqueEntities = new Set(logs.map(log => log.entityType)).size;

    return {
      period,
      summary: {
        totalAuditEntries: totalLogs,
        phiAccessEntries: phiLogs.length,
        failedActions: failedActions.length,
        securityConcerns: securityConcerns.length,
        uniqueUsers,
        uniqueEntityTypes: uniqueEntities,
        successRate: totalLogs > 0 ? ((totalLogs - failedActions.length) / totalLogs) * 100 : 0
      },
      complianceStatus: failedActions.length === 0 && securityConcerns.length === 0 ? 'COMPLIANT' : 'NEEDS_REVIEW'
    };
  }
}

/**
 * Audit-related constants
 */
export const AUDIT_CONSTANTS = {
  // Maximum number of audit logs to return in a single query
  MAX_QUERY_LIMIT: 1000,
  
  // Default pagination limit
  DEFAULT_PAGE_LIMIT: 50,
  
  // PHI access types
  PHI_ACCESS_TYPES: ['READ', 'WRITE', 'DELETE', 'EXPORT'] as const,
  
  // PHI data categories
  PHI_DATA_CATEGORIES: [
    'HEALTH_RECORD',
    'MEDICATION',
    'ALLERGY',
    'VACCINATION',
    'DIAGNOSIS',
    'TREATMENT',
    'CHRONIC_CONDITION',
    'SCREENING',
    'VITAL_SIGNS',
    'GROWTH_MEASUREMENT'
  ] as const,
  
  // Risk levels
  RISK_LEVELS: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const,
  
  // Retention periods (in days)
  RETENTION_PERIODS: {
    AUDIT_LOGS: 2555, // 7 years for HIPAA compliance
    PHI_ACCESS_LOGS: 2555, // 7 years for HIPAA compliance
    SECURITY_LOGS: 1095 // 3 years for security logs
  },
  
  // Business hours
  BUSINESS_HOURS: {
    START: 6, // 6 AM
    END: 20   // 8 PM
  },
  
  // Security thresholds
  SECURITY_THRESHOLDS: {
    FAILED_LOGIN_ATTEMPTS: 5,
    HIGH_VOLUME_ACCESS_PER_DAY: 50,
    WIDE_ACCESS_STUDENT_COUNT: 100,
    MULTIPLE_IP_THRESHOLD: 5,
    RAPID_EXPORT_THRESHOLD: 10
  }
};

/**
 * Common audit error messages
 */
export const AUDIT_ERRORS = {
  VALIDATION: {
    MISSING_ACTION: 'Action is required for audit logging',
    MISSING_ENTITY_TYPE: 'Entity type is required for audit logging',
    INVALID_USER_ID: 'Invalid user ID format',
    INVALID_IP_ADDRESS: 'Invalid IP address format',
    MISSING_STUDENT_ID: 'Student ID is required for PHI access logging',
    INVALID_ACCESS_TYPE: 'Invalid PHI access type',
    INVALID_DATA_CATEGORY: 'Invalid PHI data category'
  },
  OPERATION: {
    AUDIT_LOG_FAILED: 'Failed to create audit log entry',
    QUERY_FAILED: 'Failed to query audit logs',
    PERMISSION_DENIED: 'Insufficient permissions for audit operation',
    INVALID_DATE_RANGE: 'Invalid date range for audit query'
  },
  COMPLIANCE: {
    RETENTION_VIOLATION: 'Audit log retention period violation',
    PHI_ACCESS_UNAUTHORIZED: 'Unauthorized PHI access attempt',
    SECURITY_VIOLATION: 'Security policy violation detected'
  }
};
