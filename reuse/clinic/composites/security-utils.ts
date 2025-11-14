/**
 * File: /reuse/clinic/composites/security-utils.ts
 * Locator: WC-CLINIC-SECURITY-UTILS-001
 * Purpose: Security utilities for HIPAA-compliant clinic composites
 *
 * Provides:
 * - Input validation and sanitization
 * - SQL injection prevention
 * - HIPAA-compliant audit logging
 * - PHI data masking
 * - Rate limiting helpers
 * - Authorization checks
 */

import { BadRequestException, Logger } from '@nestjs/common';

const logger = new Logger('ClinicSecurityUtils');

/**
 * Input validation utilities
 */
export class InputValidator {
  /**
   * Validates and sanitizes a UUID
   */
  static validateUUID(value: string, fieldName: string): string {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException(`${fieldName} is required`);
    }

    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(value)) {
      throw new BadRequestException(`Invalid ${fieldName} format`);
    }

    return value;
  }

  /**
   * Validates and sanitizes a search term to prevent SQL injection
   */
  static sanitizeSearchTerm(searchTerm: string, minLength: number = 2, maxLength: number = 100): string {
    if (!searchTerm || typeof searchTerm !== 'string') {
      throw new BadRequestException('Search term is required');
    }

    // Remove SQL metacharacters and dangerous patterns
    const sanitized = searchTerm
      .replace(/[%;'"\\]/g, '') // Remove SQL metacharacters
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove block comment start
      .replace(/\*\//g, '') // Remove block comment end
      .replace(/<script/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .trim();

    if (sanitized.length < minLength) {
      throw new BadRequestException(`Search term must be at least ${minLength} characters`);
    }

    if (sanitized.length > maxLength) {
      throw new BadRequestException(`Search term must not exceed ${maxLength} characters`);
    }

    return sanitized;
  }

  /**
   * Validates a string field with length constraints
   */
  static validateString(value: string, fieldName: string, minLength: number = 1, maxLength: number = 500): string {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException(`${fieldName} is required`);
    }

    const trimmed = value.trim();

    if (trimmed.length < minLength) {
      throw new BadRequestException(`${fieldName} must be at least ${minLength} characters`);
    }

    if (trimmed.length > maxLength) {
      throw new BadRequestException(`${fieldName} must not exceed ${maxLength} characters`);
    }

    // Remove potential XSS attempts
    const sanitized = trimmed
      .replace(/<script/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');

    return sanitized;
  }

  /**
   * Validates an email address
   */
  static validateEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException('Email is required');
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    return email.toLowerCase().trim();
  }

  /**
   * Validates a phone number
   */
  static validatePhone(phone: string): string {
    if (!phone || typeof phone !== 'string') {
      throw new BadRequestException('Phone number is required');
    }

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    if (digits.length < 10 || digits.length > 15) {
      throw new BadRequestException('Invalid phone number');
    }

    return digits;
  }

  /**
   * Validates a date range
   */
  static validateDateRange(startDate: Date, endDate: Date, maxRangeDays: number = 365): void {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      throw new BadRequestException('Invalid date format');
    }

    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > maxRangeDays) {
      throw new BadRequestException(`Date range cannot exceed ${maxRangeDays} days`);
    }
  }

  /**
   * Validates an enum value
   */
  static validateEnum<T>(value: T, enumType: any, fieldName: string): T {
    if (!Object.values(enumType).includes(value)) {
      throw new BadRequestException(`Invalid ${fieldName}. Must be one of: ${Object.values(enumType).join(', ')}`);
    }
    return value;
  }

  /**
   * Validates a numeric value within a range
   */
  static validateNumber(value: number, fieldName: string, min: number, max: number): number {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new BadRequestException(`${fieldName} must be a valid number`);
    }

    if (value < min || value > max) {
      throw new BadRequestException(`${fieldName} must be between ${min} and ${max}`);
    }

    return value;
  }

  /**
   * Validates an array is not empty
   */
  static validateArray<T>(value: T[], fieldName: string, minLength: number = 1, maxLength: number = 100): T[] {
    if (!Array.isArray(value)) {
      throw new BadRequestException(`${fieldName} must be an array`);
    }

    if (value.length < minLength) {
      throw new BadRequestException(`${fieldName} must contain at least ${minLength} item(s)`);
    }

    if (value.length > maxLength) {
      throw new BadRequestException(`${fieldName} cannot contain more than ${maxLength} items`);
    }

    return value;
  }
}

/**
 * HIPAA-compliant audit logging utilities
 */
export class AuditLogger {
  /**
   * Logs PHI access without including PHI in the log
   */
  static logPHIAccess(
    operation: string,
    resourceType: string,
    resourceId: string,
    userId: string,
    schoolId: string,
  ): void {
    logger.log({
      event: 'PHI_ACCESS',
      operation,
      resourceType,
      resourceId,
      userId,
      schoolId,
      timestamp: new Date().toISOString(),
      hipaaCompliant: true,
    });
  }

  /**
   * Logs medication administration without PHI
   */
  static logMedicationEvent(
    eventType: 'ADMINISTERED' | 'REFUSED' | 'PARTIAL' | 'ERROR',
    orderId: string,
    userId: string,
    schoolId: string,
  ): void {
    logger.log({
      event: 'MEDICATION_EVENT',
      eventType,
      orderId,
      userId,
      schoolId,
      timestamp: new Date().toISOString(),
      hipaaCompliant: true,
    });
  }

  /**
   * Logs security event (authentication, authorization failures)
   */
  static logSecurityEvent(
    eventType: 'AUTH_FAILURE' | 'AUTHZ_FAILURE' | 'INVALID_ACCESS' | 'SUSPICIOUS_ACTIVITY',
    details: string,
    userId?: string,
    ipAddress?: string,
  ): void {
    logger.warn({
      event: 'SECURITY_EVENT',
      eventType,
      details,
      userId,
      ipAddress,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Logs data modification events
   */
  static logDataModification(
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    resourceType: string,
    resourceId: string,
    userId: string,
    changes?: Record<string, any>,
  ): void {
    logger.log({
      event: 'DATA_MODIFICATION',
      operation,
      resourceType,
      resourceId,
      userId,
      // Only log non-PHI field names, not values
      changedFields: changes ? Object.keys(changes) : [],
      timestamp: new Date().toISOString(),
      hipaaCompliant: true,
    });
  }
}

/**
 * Data masking utilities for PHI protection
 */
export class DataMasker {
  /**
   * Masks a Social Security Number
   */
  static maskSSN(ssn: string): string {
    if (!ssn || ssn.length < 4) return '***';
    return `***-**-${ssn.slice(-4)}`;
  }

  /**
   * Masks a phone number
   */
  static maskPhone(phone: string): string {
    if (!phone || phone.length < 4) return '***';
    return `***-***-${phone.slice(-4)}`;
  }

  /**
   * Masks an email address
   */
  static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return '***@***.***';
    const [local, domain] = email.split('@');
    const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : '***';
    return `${maskedLocal}@${domain}`;
  }

  /**
   * Masks a medical record number
   */
  static maskMRN(mrn: string): string {
    if (!mrn || mrn.length < 4) return '***';
    return `***${mrn.slice(-4)}`;
  }

  /**
   * Redacts sensitive fields from an object for logging
   */
  static redactSensitiveFields(obj: any): any {
    const sensitiveFields = [
      'ssn',
      'socialSecurityNumber',
      'password',
      'creditCard',
      'medicalRecordNumber',
      'dateOfBirth',
      'dob',
    ];

    const redacted = { ...obj };

    for (const field of sensitiveFields) {
      if (redacted[field]) {
        redacted[field] = '[REDACTED]';
      }
    }

    return redacted;
  }
}

/**
 * Authorization helper utilities
 */
export class AuthorizationHelper {
  /**
   * Checks if user has required role
   */
  static hasRole(userRole: string, requiredRoles: string[]): boolean {
    return requiredRoles.includes(userRole);
  }

  /**
   * Checks if user can access student's health records
   */
  static canAccessStudentRecords(
    userRole: string,
    userSchoolId: string,
    studentSchoolId: string,
  ): boolean {
    // User must be from the same school
    if (userSchoolId !== studentSchoolId) {
      AuditLogger.logSecurityEvent(
        'AUTHZ_FAILURE',
        `Cross-school access attempt: user school ${userSchoolId}, student school ${studentSchoolId}`,
      );
      return false;
    }

    // Only nurses, admins, and counselors can access health records
    const authorizedRoles = ['nurse', 'admin', 'counselor', 'physician'];
    return authorizedRoles.includes(userRole);
  }

  /**
   * Checks if user can modify medication orders
   */
  static canModifyMedicationOrders(userRole: string): boolean {
    const authorizedRoles = ['nurse', 'physician'];
    return authorizedRoles.includes(userRole);
  }

  /**
   * Checks if user can access emergency protocols
   */
  static canAccessEmergencyProtocols(userRole: string): boolean {
    const authorizedRoles = ['nurse', 'admin', 'security', 'counselor'];
    return authorizedRoles.includes(userRole);
  }
}

/**
 * Query sanitization for preventing SQL injection
 */
export class QuerySanitizer {
  /**
   * Sanitizes ORDER BY clause to prevent SQL injection
   */
  static sanitizeOrderBy(orderBy: string, allowedFields: string[]): string {
    if (!orderBy) {
      return allowedFields[0]; // Default to first allowed field
    }

    // Extract field and direction
    const parts = orderBy.toLowerCase().split(' ');
    const field = parts[0];
    const direction = parts[1] === 'desc' ? 'DESC' : 'ASC';

    if (!allowedFields.includes(field)) {
      throw new BadRequestException(`Invalid sort field. Allowed: ${allowedFields.join(', ')}`);
    }

    return `${field} ${direction}`;
  }

  /**
   * Sanitizes LIMIT/OFFSET values
   */
  static sanitizePagination(limit?: number, offset?: number): { limit: number; offset: number } {
    const maxLimit = 1000;
    const defaultLimit = 50;

    const sanitizedLimit = limit
      ? Math.min(Math.max(1, Math.floor(limit)), maxLimit)
      : defaultLimit;

    const sanitizedOffset = offset ? Math.max(0, Math.floor(offset)) : 0;

    return { limit: sanitizedLimit, offset: sanitizedOffset };
  }

  /**
   * Validates WHERE clause parameters to prevent injection
   */
  static validateWhereParams(params: Record<string, any>): void {
    for (const [key, value] of Object.entries(params)) {
      // Check for SQL injection attempts in parameter values
      if (typeof value === 'string') {
        if (value.includes('--') || value.includes(';') || value.includes('/*')) {
          throw new BadRequestException(`Invalid parameter value for ${key}`);
        }
      }
    }
  }
}

/**
 * Rate limiting helpers
 */
export class RateLimitHelper {
  /**
   * Calculates rate limit key for user
   */
  static getUserRateLimitKey(userId: string, operation: string): string {
    return `ratelimit:${operation}:${userId}`;
  }

  /**
   * Calculates rate limit key for IP address
   */
  static getIPRateLimitKey(ipAddress: string, operation: string): string {
    return `ratelimit:${operation}:${ipAddress}`;
  }
}

// Export all utilities
export default {
  InputValidator,
  AuditLogger,
  DataMasker,
  AuthorizationHelper,
  QuerySanitizer,
  RateLimitHelper,
};
