import { Injectable } from '@nestjs/common';
import { PHIAccessType, PHIDataCategory, AuditAction } from '../enums';

/**
 * AuditUtilsService - Utility functions and helpers for audit operations
 *
 * Provides common utility functions, validation helpers, constants,
 * and shared functionality used across all audit services.
 */
@Injectable()
export class AuditUtilsService {
  /**
   * Validate audit log entry data
   *
   * @param entry - Audit log entry to validate
   * @returns Validation result with errors if any
   */
  validateAuditEntry(entry: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!entry.action) {
      errors.push('Action is required');
    }

    if (!entry.entityType) {
      errors.push('Entity type is required');
    }

    if (entry.ipAddress && !this.isValidIPAddress(entry.ipAddress)) {
      errors.push('Invalid IP address format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate PHI access log entry
   *
   * @param entry - PHI access log entry to validate
   * @returns Validation result with errors if any
   */
  validatePHIEntry(entry: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const baseValidation = this.validateAuditEntry(entry);
    errors.push(...baseValidation.errors);

    if (!entry.studentId) {
      errors.push('Student ID is required for PHI access');
    }

    if (!entry.accessType) {
      errors.push('Access type is required for PHI access');
    } else if (!Object.values(PHIAccessType).includes(entry.accessType)) {
      errors.push('Invalid PHI access type');
    }

    if (!entry.dataCategory) {
      errors.push('Data category is required for PHI access');
    } else if (!Object.values(PHIDataCategory).includes(entry.dataCategory)) {
      errors.push('Invalid PHI data category');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if a string is a valid IP address
   *
   * @param ip - IP address to validate
   * @returns True if valid IP address
   */
  isValidIPAddress(ip: string): boolean {
    // IPv4 regex
    const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // IPv6 regex (simplified)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  /**
   * Extract IP address from request object
   *
   * @param req - Request object
   * @returns IP address string
   */
  extractIPAddress(req: any): string | undefined {
    if (typeof req === 'string') {
      return req;
    }

    return (
      req?.ip ||
      req?.connection?.remoteAddress ||
      req?.socket?.remoteAddress ||
      req?.headers?.['x-forwarded-for']?.split(',')[0] ||
      req?.headers?.['x-real-ip'] ||
      undefined
    );
  }

  /**
   * Extract user agent from request object
   *
   * @param req - Request object
   * @returns User agent string
   */
  extractUserAgent(req: any): string | undefined {
    if (typeof req === 'string') {
      return req;
    }

    return req?.headers?.['user-agent'] || req?.userAgent || undefined;
  }

  /**
   * Sanitize audit data (remove sensitive information)
   *
   * @param data - Raw audit data
   * @returns Sanitized audit data
   */
  sanitizeAuditData(data: any): any {
    const sanitized = { ...data };

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
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 1000) {
        sanitized[key] = sanitized[key].substring(0, 1000) + '... [TRUNCATED]';
      }
    });

    return sanitized;
  }
}

/**
 * Audit-related constants
 */
export const AUDIT_CONSTANTS = {
  MAX_QUERY_LIMIT: 1000,
  DEFAULT_PAGE_LIMIT: 50,
  PHI_ACCESS_TYPES: Object.values(PHIAccessType),
  PHI_DATA_CATEGORIES: Object.values(PHIDataCategory),
  RETENTION_PERIODS: {
    AUDIT_LOGS: 2555, // 7 years for HIPAA compliance
    PHI_ACCESS_LOGS: 2555, // 7 years for HIPAA compliance
  },
  BUSINESS_HOURS: {
    START: 6, // 6 AM
    END: 20, // 8 PM
  },
};
