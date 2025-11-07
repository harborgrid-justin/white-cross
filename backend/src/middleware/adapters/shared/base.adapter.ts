/**
 * Shared Base Adapter for Healthcare Middleware System
 * Common utilities and base classes for framework adapters
 *
 * @fileoverview Shared adapter utilities for healthcare middleware with HIPAA compliance
 * @version 1.0.0
 * @author Healthcare Platform Team
 */

import { Injectable } from '@nestjs/common';
import {
  IMiddleware,
  IRequest,
  IResponse,
  INextFunction,
  MiddlewareContext,
  HealthcareUser,
  UserRole,
  Permission,
  HealthcareContext,
  IFrameworkAdapter,
  MiddlewareFactory,
} from '../../utils/types/middleware.types';

/**
 * Abstract base adapter class for framework-agnostic middleware
 * Provides common functionality for all framework adapters in NestJS context
 */
@Injectable()
export abstract class BaseFrameworkAdapter implements IFrameworkAdapter {
  protected frameworkName: string;

  constructor(frameworkName: string) {
    this.frameworkName = frameworkName;
  }

  abstract adapt(middleware: IMiddleware): any;
  abstract createHealthcareMiddleware(
    factory: MiddlewareFactory,
    config: any,
  ): any;
  abstract chain(...middlewares: IMiddleware[]): any[];

  /**
   * Creates middleware context with common properties
   */
  protected createContext(correlationId?: string): MiddlewareContext {
    return {
      startTime: Date.now(),
      correlationId: correlationId || this.generateCorrelationId(),
      framework: this.frameworkName as any,
      environment: process.env.NODE_ENV || 'development',
      metadata: {},
    };
  }

  /**
   * Generates a unique correlation ID
   */
  protected generateCorrelationId(): string {
    return `${this.frameworkName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validates middleware configuration
   */
  protected validateMiddlewareConfig(config: any): boolean {
    return typeof config === 'object' && config !== null;
  }
}

/**
 * Common healthcare middleware utilities
 * Injectable service for healthcare-specific middleware operations
 */
@Injectable()
export class HealthcareMiddlewareUtils {
  /**
   * Validates healthcare user context
   */
  validateHealthcareUser(user: any): user is HealthcareUser {
    return !!(
      user &&
      typeof user.userId === 'string' &&
      typeof user.email === 'string' &&
      Object.values(UserRole).includes(user.role)
    );
  }

  /**
   * Checks if user has required permission
   */
  hasPermission(user: HealthcareUser, requiredPermission: Permission): boolean {
    if (!user.permissions) {
      return false;
    }
    return user.permissions.includes(requiredPermission);
  }

  /**
   * Checks if user has any of the required permissions
   */
  hasAnyPermission(
    user: HealthcareUser,
    requiredPermissions: Permission[],
  ): boolean {
    if (!user.permissions) {
      return false;
    }
    return requiredPermissions.some((permission) =>
      user.permissions!.includes(permission),
    );
  }

  /**
   * Gets role hierarchy level (higher number = more privileged)
   */
  getRoleLevel(role: UserRole): number {
    const levels = {
      [UserRole.STUDENT]: 1,
      [UserRole.SCHOOL_NURSE]: 2,
      [UserRole.ADMINISTRATOR]: 3,
      [UserRole.SYSTEM_ADMIN]: 4,
    };
    return levels[role] || 0;
  }

  /**
   * Checks if user role has sufficient privilege level
   */
  hasRoleLevel(user: HealthcareUser, minimumRole: UserRole): boolean {
    return this.getRoleLevel(user.role) >= this.getRoleLevel(minimumRole);
  }

  /**
   * Sanitizes healthcare context for logging
   */
  sanitizeHealthcareContext(
    context: HealthcareContext,
  ): Partial<HealthcareContext> {
    return {
      facilityId: context.facilityId,
      accessType: context.accessType,
      auditRequired: context.auditRequired,
      phiAccess: context.phiAccess,
      complianceFlags: context.complianceFlags,
      // Exclude patientId and providerId for privacy
    };
  }

  /**
   * Detects if request contains PHI (Protected Health Information)
   */
  detectPHI(data: any): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Common PHI indicators
    const phiFields = [
      'ssn',
      'socialSecurityNumber',
      'medicalRecordNumber',
      'mrn',
      'dateOfBirth',
      'dob',
      'diagnosis',
      'medication',
      'treatment',
      'symptoms',
      'allergies',
      'immunizations',
      'visitNotes',
    ];

    const dataString = JSON.stringify(data).toLowerCase();

    // Check for PHI field names
    const hasPHIFields = phiFields.some((field) =>
      dataString.includes(field.toLowerCase()),
    );

    // Check for patterns that might indicate PHI
    const ssnPattern = /\d{3}-?\d{2}-?\d{4}/;
    const mrnPattern = /mrn[:\s]*[a-z0-9]+/i;
    const dobPattern = /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/;

    const hasPatterns =
      ssnPattern.test(dataString) ||
      mrnPattern.test(dataString) ||
      dobPattern.test(dataString);

    return hasPHIFields || hasPatterns;
  }

  /**
   * Creates emergency access context
   */
  createEmergencyContext(
    providerId: string,
    reason: string,
    patientId?: string,
  ): Partial<HealthcareContext> {
    return {
      providerId,
      patientId,
      accessType: 'emergency',
      auditRequired: true,
      phiAccess: true,
      complianceFlags: ['emergency_access', 'audit_required', reason],
    };
  }

  /**
   * Creates break glass access context
   */
  createBreakGlassContext(
    providerId: string,
    justification: string,
    patientId: string,
    facilityId: string,
  ): HealthcareContext {
    return {
      patientId,
      facilityId,
      providerId,
      accessType: 'break_glass',
      auditRequired: true,
      phiAccess: true,
      complianceFlags: [
        'break_glass_access',
        'audit_required',
        'high_priority_audit',
        `justification:${justification}`,
      ],
    };
  }

  /**
   * Validates facility access for user
   */
  canAccessFacility(user: HealthcareUser, facilityId: string): boolean {
    // System admins can access any facility
    if (user.role === UserRole.SYSTEM_ADMIN) {
      return true;
    }

    // Check if user is assigned to this facility
    return user.facilityId === facilityId;
  }

  /**
   * Gets allowed actions for user role
   */
  getAllowedActions(role: UserRole): Permission[] {
    // Base permissions for each role
    const studentPermissions = [
      Permission.VIEW_OWN_HEALTH_RECORDS,
      Permission.UPDATE_OWN_EMERGENCY_CONTACTS,
    ];

    const nursePermissions = [
      Permission.VIEW_STUDENT_HEALTH_RECORDS,
      Permission.CREATE_HEALTH_RECORDS,
      Permission.UPDATE_HEALTH_RECORDS,
      Permission.ADMINISTER_MEDICATION,
      Permission.VIEW_IMMUNIZATION_RECORDS,
      Permission.CREATE_INCIDENT_REPORTS,
    ];

    const adminPermissions = [
      Permission.MANAGE_USERS,
      Permission.VIEW_REPORTS,
      Permission.EXPORT_DATA,
      Permission.MANAGE_FACILITY_SETTINGS,
      ...nursePermissions, // Inherits nurse permissions
    ];

    const systemAdminPermissions = [
      Permission.SYSTEM_ADMINISTRATION,
      Permission.AUDIT_LOGS,
      Permission.EMERGENCY_ACCESS,
      Permission.BREAK_GLASS_ACCESS,
      ...adminPermissions, // Inherits admin permissions
    ];

    const rolePermissions: Record<UserRole, Permission[]> = {
      [UserRole.STUDENT]: studentPermissions,
      [UserRole.SCHOOL_NURSE]: nursePermissions,
      [UserRole.ADMINISTRATOR]: adminPermissions,
      [UserRole.SYSTEM_ADMIN]: systemAdminPermissions,
    };

    return rolePermissions[role] || [];
  }
}

/**
 * Common response utilities for all frameworks
 * Injectable service for response formatting and sanitization
 */
@Injectable()
export class ResponseUtils {
  /**
   * Creates standardized error response
   */
  createErrorResponse(
    error: Error,
    statusCode: number = 500,
    includeStack: boolean = false,
  ): any {
    const response: any = {
      error: true,
      message: error.message,
      statusCode,
      timestamp: new Date().toISOString(),
    };

    if (includeStack && process.env.NODE_ENV === 'development') {
      response.stack = error.stack;
    }

    return response;
  }

  /**
   * Creates standardized success response
   */
  createSuccessResponse(
    data: any,
    message: string = 'Success',
    statusCode: number = 200,
  ): any {
    return {
      success: true,
      message,
      data,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Sanitizes response data for HIPAA compliance
   */
  sanitizeForHIPAA(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveFields = [
      'ssn',
      'socialSecurityNumber',
      'password',
      'token',
      'creditCard',
      'bankAccount',
      'medicalRecordNumber',
    ];

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeForHIPAA(item));
    }

    const sanitized = { ...data };

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    });

    // Recursively sanitize nested objects
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeForHIPAA(sanitized[key]);
      }
    });

    return sanitized;
  }

  /**
   * Adds correlation ID to response
   */
  addCorrelationId(response: any, correlationId: string): any {
    if (typeof response === 'object' && response !== null) {
      response.correlationId = correlationId;
    }
    return response;
  }
}

/**
 * Request validation utilities
 * Injectable service for request validation
 */
@Injectable()
export class RequestValidationUtils {
  /**
   * Validates request headers for required healthcare headers
   */
  validateHealthcareHeaders(headers: Record<string, any>): {
    valid: boolean;
    missing: string[];
  } {
    const requiredHeaders = ['x-facility-id'];
    const missing = requiredHeaders.filter(
      (header) => !headers[header] && !headers[header.toLowerCase()],
    );

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Validates request size for security
   */
  validateRequestSize(
    body: any,
    maxSize: number = 10 * 1024 * 1024, // 10MB default
  ): boolean {
    if (!body) return true;

    const size = JSON.stringify(body).length;
    return size <= maxSize;
  }

  /**
   * Validates file upload for healthcare compliance
   */
  validateFileUpload(
    file: any,
    allowedTypes: string[] = ['pdf', 'jpg', 'png', 'doc', 'docx'],
    maxSize: number = 5 * 1024 * 1024, // 5MB default
  ): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds ${maxSize} bytes` };
    }

    const fileExtension = file.name?.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed: ${allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }
}
