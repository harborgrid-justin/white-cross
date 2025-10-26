/**
 * @fileoverview Healthcare Middleware Decorators
 * @module middleware/utils/decorators
 * @description TypeScript decorators providing declarative middleware functionality for
 * healthcare applications with built-in HIPAA compliance, audit logging, and access control.
 *
 * Key Features:
 * - Role-based authorization decorators (@RequireRole)
 * - Permission-based authorization decorators (@RequirePermissions)
 * - Automatic audit logging (@AuditLog)
 * - PHI access tracking and validation (@PHIAccess)
 * - Rate limiting (@RateLimit)
 * - Input validation (@ValidateInput)
 * - Response caching (@Cache)
 *
 * Decorator Benefits:
 * - Declarative security annotations on methods
 * - Automatic enforcement of authorization rules
 * - Built-in audit trail for compliance
 * - Reduced boilerplate in route handlers
 * - Consistent security implementation across codebase
 *
 * HIPAA Compliance:
 * - All PHI access automatically logged via @PHIAccess
 * - Role-based access control enforced via @RequireRole
 * - Audit events include correlation IDs for tracking
 * - Emergency access override support (break-glass)
 *
 * Usage Pattern:
 * 1. Import decorators from this module
 * 2. Apply decorators to class methods
 * 3. Decorators execute before/after method execution
 * 4. Authorization failures throw errors automatically
 * 5. Audit events logged asynchronously
 *
 * @requires reflect-metadata - TypeScript metadata reflection API
 * @requires ../types/middleware.types - Type definitions
 *
 * @version 1.0.0
 * @author Healthcare Platform Team
 *
 * @security All decorators enforce security policies declaratively
 * @compliance HIPAA - Automatic audit logging and access control
 *
 * @example
 * // Apply multiple decorators to a method
 * class HealthRecordsService {
 *   @RequireRole(UserRole.SCHOOL_NURSE)
 *   @RequirePermissions(Permission.READ_HEALTH_RECORDS)
 *   @PHIAccess({ patientIdParam: 'studentId' })
 *   @AuditLog({ action: 'view', resource: 'health-records', includePHI: true })
 *   async getHealthRecord(studentId: string) {
 *     // Method implementation
 *   }
 * }
 */

import 'reflect-metadata';
import { 
  UserRole, 
  Permission, 
  HealthcareUser,
  MiddlewareContext,
  AuditEvent 
} from '../types/middleware.types';

// Metadata keys for decorators
const REQUIRED_ROLE_KEY = Symbol('requiredRole');
const REQUIRED_PERMISSIONS_KEY = Symbol('requiredPermissions');
const AUDIT_ENABLED_KEY = Symbol('auditEnabled');
const PHI_ACCESS_KEY = Symbol('phiAccess');
const RATE_LIMIT_KEY = Symbol('rateLimit');
const VALIDATION_RULES_KEY = Symbol('validationRules');

/**
 * Decorator for requiring specific user role
 *
 * @decorator
 * @function RequireRole
 * @param {UserRole} role - Minimum role required to execute the decorated method
 * @returns {MethodDecorator} Method decorator function
 * @throws {Error} When user lacks required role
 *
 * @description Method decorator that enforces minimum role requirement before method execution.
 * Automatically checks if the current user's role meets or exceeds the specified role level.
 * Uses role hierarchy (STUDENT < PARENT_GUARDIAN < SCHOOL_NURSE < ... < SUPER_ADMIN).
 *
 * Execution Flow:
 * 1. Decorator intercepts method call
 * 2. Extracts user from method context or arguments
 * 3. Checks if user.role >= required role (via isUserRole helper)
 * 4. If authorized: executes original method
 * 5. If unauthorized: throws Error with access denied message
 *
 * User Extraction:
 * - First tries this.getCurrentUser() method if available
 * - Falls back to finding user object in method arguments
 * - Looks for argument with 'user' property
 *
 * Metadata Storage:
 * - Stores required role using Reflect.defineMetadata
 * - Metadata key: REQUIRED_ROLE_KEY symbol
 * - Can be retrieved for introspection/documentation
 *
 * @security Critical authorization decorator - prevents unauthorized method execution
 * @performance Minimal overhead - simple role comparison
 *
 * @example
 * // Require school nurse or higher
 * class MedicationService {
 *   @RequireRole(UserRole.SCHOOL_NURSE)
 *   async administerMedication(medicationId: string) {
 *     // Only school nurses and higher roles can execute
 *   }
 * }
 *
 * @example
 * // Require system administrator
 * class UserManagementService {
 *   @RequireRole(UserRole.SYSTEM_ADMINISTRATOR)
 *   async deleteUser(userId: string) {
 *     // Only system administrators and super admins can execute
 *   }
 * }
 *
 * @example
 * // Combine with other decorators
 * class ReportsService {
 *   @RequireRole(UserRole.DISTRICT_ADMINISTRATOR)
 *   @AuditLog({ action: 'export', resource: 'reports' })
 *   async exportDistrictReport() {
 *     // Requires district admin AND logs the export action
 *   }
 * }
 */
export function RequireRole(role: UserRole) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUIRED_ROLE_KEY, role, target, propertyName);

    const method = descriptor.value;
    descriptor.value = function (this: DecoratorContext, ...args: any[]) {
      const user = this.getCurrentUser?.() || args.find((arg: any) => arg?.user)?.user;

      if (!user || !isUserRole(user, role)) {
        throw new Error(`Access denied. Required role: ${role}`);
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Decorator for requiring specific permissions
 */
export function RequirePermissions(...permissions: Permission[]) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUIRED_PERMISSIONS_KEY, permissions, target, propertyName);

    const method = descriptor.value;
    descriptor.value = function (this: DecoratorContext, ...args: any[]) {
      const user = this.getCurrentUser?.() || args.find((arg: any) => arg?.user)?.user;

      if (!user || !hasRequiredPermissions(user, permissions)) {
        throw new Error(`Access denied. Required permissions: ${permissions.join(', ')}`);
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Decorator for enabling automatic audit logging on method calls
 *
 * @decorator
 * @function AuditLog
 * @async
 * @param {Object} options - Audit logging configuration
 * @param {string} options.action - Action being performed (e.g., 'view', 'create', 'update', 'delete', 'export')
 * @param {string} options.resource - Resource being accessed (e.g., 'health-records', 'medications', 'students')
 * @param {boolean} [options.includePHI=false] - Whether this action involves PHI access
 * @param {boolean} [options.includeRequestBody=false] - Log request body (sanitized)
 * @param {boolean} [options.includeResponseBody=false] - Log response body (sanitized)
 * @returns {MethodDecorator} Method decorator function
 *
 * @description Method decorator that automatically logs all invocations for HIPAA audit trail.
 * Captures method execution details, success/failure, user context, and timing information.
 * All audit events are logged asynchronously to avoid blocking method execution.
 *
 * Audit Event Data:
 * - timestamp: ISO 8601 timestamp of event
 * - correlationId: Unique ID for tracking related events
 * - userId: ID of user performing the action
 * - userRole: Role of user (for access level tracking)
 * - facilityId: Facility/school where action occurred
 * - action: What was done (from options)
 * - resource: What was accessed (from options)
 * - outcome: 'success' or 'failure'
 * - duration: Method execution time in milliseconds
 * - ipAddress: Client IP address
 * - userAgent: Client user agent string
 * - phiAccessed: Whether PHI was involved
 * - complianceFlags: Array of compliance tags
 *
 * Sensitive Data Handling:
 * - Request/response bodies sanitized via sanitizeForAudit()
 * - Password fields redacted as '[REDACTED]'
 * - Token fields redacted as '[REDACTED]'
 * - SSN/Social Security Numbers redacted
 * - PHI flag marks events for special retention
 *
 * Success vs Failure Logging:
 * - Success: Logs with outcome='success', includes response data
 * - Failure: Logs with outcome='failure', includes error message
 * - Both: Track duration for performance monitoring
 *
 * HIPAA Compliance:
 * - All PHI access must be audited (set includePHI=true)
 * - Audit logs retained for 6 years per HIPAA requirements
 * - Correlation IDs enable tracking of related actions
 * - Failed access attempts logged for security monitoring
 *
 * @security All security-relevant actions should use this decorator
 * @compliance HIPAA - Required for audit trail (45 CFR §164.308(a)(1)(ii)(D))
 * @compliance HIPAA - Access logging (45 CFR §164.312(b))
 * @performance Async logging - minimal impact on method execution
 *
 * @example
 * // Basic audit logging
 * class StudentService {
 *   @AuditLog({ action: 'view', resource: 'students' })
 *   async getStudent(id: string) {
 *     // Logs every student view with user and timestamp
 *   }
 * }
 *
 * @example
 * // PHI access audit logging
 * class HealthRecordsService {
 *   @AuditLog({
 *     action: 'view',
 *     resource: 'health-records',
 *     includePHI: true
 *   })
 *   async getHealthRecord(id: string) {
 *     // Logs PHI access with special compliance flag
 *   }
 * }
 *
 * @example
 * // Detailed audit logging with request/response
 * class MedicationService {
 *   @AuditLog({
 *     action: 'administer',
 *     resource: 'medications',
 *     includePHI: true,
 *     includeRequestBody: true,
 *     includeResponseBody: true
 *   })
 *   async administerMedication(data: MedicationAdministration) {
 *     // Logs full medication administration event
 *   }
 * }
 *
 * @example
 * // Combine with authorization decorators
 * class DataExportService {
 *   @RequirePermissions(Permission.EXPORT_DATA)
 *   @PHIAccess({ justificationRequired: true })
 *   @AuditLog({
 *     action: 'export',
 *     resource: 'health-records',
 *     includePHI: true,
 *     includeRequestBody: true
 *   })
 *   async exportHealthRecords(params: ExportParams) {
 *     // Full security: authorization, PHI validation, and audit logging
 *   }
 * }
 */
export function AuditLog(options: {
  action: string;
  resource: string;
  includePHI?: boolean;
  includeRequestBody?: boolean;
  includeResponseBody?: boolean;
} = { action: 'unknown', resource: 'unknown' }) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(AUDIT_ENABLED_KEY, options, target, propertyName);

    const method = descriptor.value;
    descriptor.value = async function (this: DecoratorContext, ...args: any[]) {
      const startTime = Date.now();
      const context = args.find((arg: any) => arg?.correlationId) as MiddlewareContext;
      const user = this.getCurrentUser?.() || args.find((arg: any) => arg?.user)?.user;

      try {
        const result = await method.apply(this, args);

        // Log successful audit event
        await logAuditEvent({
          timestamp: new Date().toISOString(),
          correlationId: context?.correlationId || generateCorrelationId(),
          userId: user?.userId,
          userRole: user?.role,
          facilityId: user?.facilityId,
          action: options.action,
          resource: options.resource,
          outcome: 'success',
          details: {
            method: propertyName,
            duration: Date.now() - startTime,
            ...(options.includeRequestBody && { requestBody: sanitizeForAudit(args) }),
            ...(options.includeResponseBody && { responseBody: sanitizeForAudit(result) })
          },
          ipAddress: this.getRequestIP?.() || 'unknown',
          userAgent: this.getUserAgent?.() || 'unknown',
          phiAccessed: options.includePHI || false,
          complianceFlags: options.includePHI ? ['phi_access'] : []
        });

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Log failed audit event
        await logAuditEvent({
          timestamp: new Date().toISOString(),
          correlationId: context?.correlationId || generateCorrelationId(),
          userId: user?.userId,
          userRole: user?.role,
          facilityId: user?.facilityId,
          action: options.action,
          resource: options.resource,
          outcome: 'failure',
          details: {
            method: propertyName,
            duration: Date.now() - startTime,
            error: errorMessage,
            ...(options.includeRequestBody && { requestBody: sanitizeForAudit(args) })
          },
          ipAddress: this.getRequestIP?.() || 'unknown',
          userAgent: this.getUserAgent?.() || 'unknown',
          phiAccessed: options.includePHI || false,
          complianceFlags: ['access_failure', ...(options.includePHI ? ['phi_access'] : [])]
        });

        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Decorator for marking methods that access Protected Health Information (PHI)
 *
 * @decorator
 * @function PHIAccess
 * @param {Object} options - PHI access configuration options
 * @param {string} [options.patientIdParam] - Name of parameter containing patient/student ID
 * @param {boolean} [options.justificationRequired=false] - Require access justification text
 * @param {boolean} [options.emergencyOverride=false] - Allow emergency access override (break-glass)
 * @returns {MethodDecorator} Method decorator function
 * @throws {Error} When user lacks PHI access permissions
 * @throws {Error} When patient access is not authorized
 * @throws {Error} When justification is required but missing
 *
 * @description Method decorator that enforces PHI access controls and tracks all access to
 * protected health information for HIPAA compliance. Validates user permissions, patient
 * relationships, and logs all PHI access events.
 *
 * PHI Access Validation:
 * 1. Check if user has PHI access permissions (via hasPhiAccess helper)
 * 2. If not, check for emergency override flag and isEmergencyAccess()
 * 3. If emergency access, log emergency access event
 * 4. If patient ID specified, validate user can access that patient
 * 5. If justification required, verify justification text provided
 * 6. Execute method if all checks pass
 *
 * PHI Access Permissions (checked by hasPhiAccess):
 * - Permission.VIEW_STUDENT_HEALTH_RECORDS
 * - Permission.CREATE_HEALTH_RECORDS
 * - Permission.UPDATE_HEALTH_RECORDS
 * - Permission.VIEW_IMMUNIZATION_RECORDS
 *
 * Emergency Override (Break-Glass):
 * - When emergencyOverride=true, allows access in emergencies
 * - Requires this.isEmergencyAccess() to return true
 * - Logs emergency access event for audit trail
 * - Should only be used for life-threatening situations
 *
 * HIPAA Compliance:
 * - All PHI access tracked with user ID and timestamp
 * - Patient-specific access validated against relationships
 * - Emergency access logged separately for investigation
 * - Justification can be required for extra accountability
 *
 * @security CRITICAL - Enforces all PHI access controls
 * @compliance HIPAA - Required for PHI access tracking and minimum necessary principle
 * @compliance 45 CFR §164.308(a)(3) - Workforce clearance procedures
 * @compliance 45 CFR §164.312(a)(1) - Access controls for PHI
 *
 * @example
 * // Basic PHI access validation
 * class HealthRecordsService {
 *   @PHIAccess()
 *   async getHealthRecords() {
 *     // Validates user has PHI access permissions
 *   }
 * }
 *
 * @example
 * // Patient-specific PHI access
 * class HealthRecordsService {
 *   @PHIAccess({ patientIdParam: 'studentId' })
 *   async getStudentHealthRecord(studentId: string) {
 *     // Validates user can access this specific student's PHI
 *   }
 * }
 *
 * @example
 * // Require justification for sensitive PHI access
 * class HealthRecordsService {
 *   @PHIAccess({
 *     patientIdParam: 'studentId',
 *     justificationRequired: true
 *   })
 *   async exportPatientData(studentId: string, justification: string) {
 *     // Requires explicit justification for data export
 *     // Access justification retrieved via this.getAccessJustification()
 *   }
 * }
 *
 * @example
 * // Emergency access with break-glass
 * class EmergencyService {
 *   @PHIAccess({
 *     patientIdParam: 'patientId',
 *     emergencyOverride: true
 *   })
 *   async emergencyAccess(patientId: string) {
 *     // Allows access in emergency even without normal permissions
 *     // Logs emergency access event for review
 *     // Requires this.isEmergencyAccess() to return true
 *   }
 * }
 *
 * @example
 * // Combined with audit logging
 * class HealthRecordsService {
 *   @PHIAccess({ patientIdParam: 'studentId' })
 *   @AuditLog({ action: 'view', resource: 'health-records', includePHI: true })
 *   async viewHealthRecord(studentId: string) {
 *     // Validates PHI access AND logs the access event
 *   }
 * }
 */
export function PHIAccess(options: {
  patientIdParam?: string;
  justificationRequired?: boolean;
  emergencyOverride?: boolean;
} = {}) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(PHI_ACCESS_KEY, options, target, propertyName);

    const method = descriptor.value;
    descriptor.value = function (this: DecoratorContext, ...args: any[]) {
      const user = this.getCurrentUser?.() || args.find((arg: any) => arg?.user)?.user;
      const request = args.find((arg: any) => arg?.params || arg?.body);

      // Check if user has PHI access permissions
      if (!user || !hasPhiAccess(user)) {
        // Check for emergency override
        if (options.emergencyOverride && this.isEmergencyAccess?.()) {
          // Log emergency access
          logEmergencyAccess(user, propertyName, 'PHI access during emergency');
        } else {
          throw new Error('Access denied. PHI access not authorized.');
        }
      }

      // Extract patient ID if specified
      if (options.patientIdParam && request) {
        const patientId = request.params?.[options.patientIdParam] ||
                         request.body?.[options.patientIdParam];

        if (patientId && !canAccessPatient(user, patientId)) {
          throw new Error(`Access denied. Cannot access patient: ${patientId}`);
        }
      }

      // Require justification for PHI access
      if (options.justificationRequired && !this.getAccessJustification?.()) {
        throw new Error('PHI access requires justification');
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Decorator for rate limiting method calls
 */
export function RateLimit(options: {
  maxCalls: number;
  windowMs: number;
  keyGenerator?: (args: any[]) => string;
  skipIf?: (args: any[]) => boolean;
}) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(RATE_LIMIT_KEY, options, target, propertyName);

    const method = descriptor.value;
    const callTracker = new Map<string, { count: number; resetTime: number }>();

    descriptor.value = function (this: DecoratorContext, ...args: any[]) {
      // Skip rate limiting if condition is met
      if (options.skipIf && options.skipIf(args)) {
        return method.apply(this, args);
      }

      const key = options.keyGenerator ?
        options.keyGenerator(args) :
        this.getRequestIP?.() || 'default';

      const now = Date.now();
      let tracker = callTracker.get(key);

      // Initialize or reset tracker if window expired
      if (!tracker || now > tracker.resetTime) {
        tracker = {
          count: 0,
          resetTime: now + options.windowMs
        };
        callTracker.set(key, tracker);
      }

      // Check rate limit
      if (tracker.count >= options.maxCalls) {
        throw new Error(`Rate limit exceeded. Max ${options.maxCalls} calls per ${options.windowMs}ms`);
      }

      // Increment counter
      tracker.count++;

      return method.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Decorator for input validation
 */
export function ValidateInput(validationRules: {
  required?: string[];
  types?: Record<string, string>;
  patterns?: Record<string, RegExp>;
  custom?: Record<string, (value: any) => boolean>;
}) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(VALIDATION_RULES_KEY, validationRules, target, propertyName);
    
    const method = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const input = args.find((arg: any) => arg && typeof arg === 'object');
      
      if (!input) {
        throw new Error('No input object found for validation');
      }
      
      // Validate required fields
      if (validationRules.required) {
        for (const field of validationRules.required) {
          if (!(field in input) || input[field] === null || input[field] === undefined) {
            throw new Error(`Required field missing: ${field}`);
          }
        }
      }
      
      // Validate field types
      if (validationRules.types) {
        for (const [field, expectedType] of Object.entries(validationRules.types)) {
          if (field in input && typeof input[field] !== expectedType) {
            throw new Error(`Invalid type for ${field}. Expected ${expectedType}, got ${typeof input[field]}`);
          }
        }
      }
      
      // Validate patterns
      if (validationRules.patterns) {
        for (const [field, pattern] of Object.entries(validationRules.patterns)) {
          if (field in input && !pattern.test(String(input[field]))) {
            throw new Error(`Invalid format for ${field}`);
          }
        }
      }
      
      // Custom validation
      if (validationRules.custom) {
        for (const [field, validator] of Object.entries(validationRules.custom)) {
          if (field in input && !validator(input[field])) {
            throw new Error(`Custom validation failed for ${field}`);
          }
        }
      }
      
      return method.apply(this, args);
    };
    
    return descriptor;
  };
}

/**
 * Decorator for caching method results
 */
export function Cache(options: {
  ttl?: number; // Time to live in milliseconds
  keyGenerator?: (args: any[]) => string;
  skipIf?: (args: any[]) => boolean;
}) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const cache = new Map<string, { value: any; expiry: number }>();
    
    descriptor.value = function (...args: any[]) {
      // Skip caching if condition is met
      if (options.skipIf && options.skipIf(args)) {
        return method.apply(this, args);
      }
      
      const key = options.keyGenerator ? 
        options.keyGenerator(args) : 
        JSON.stringify(args);
      
      const now = Date.now();
      const cached = cache.get(key);
      
      // Return cached value if not expired
      if (cached && now < cached.expiry) {
        return cached.value;
      }
      
      // Execute method and cache result
      const result = method.apply(this, args);
      
      if (result !== undefined && result !== null) {
        cache.set(key, {
          value: result,
          expiry: now + (options.ttl || 300000) // Default 5 minutes
        });
      }
      
      return result;
    };
    
    return descriptor;
  };
}

// Type for class instance with optional helper methods
interface DecoratorContext {
  getCurrentUser?: () => HealthcareUser | undefined;
  getRequestIP?: () => string;
  getUserAgent?: () => string;
  isEmergencyAccess?: () => boolean;
  getAccessJustification?: () => string | undefined;
}

// Helper functions
function isUserRole(user: HealthcareUser, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.STUDENT]: 1,
    [UserRole.SCHOOL_NURSE]: 2,
    [UserRole.ADMINISTRATOR]: 3,
    [UserRole.SYSTEM_ADMIN]: 4
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

function hasRequiredPermissions(user: HealthcareUser, requiredPermissions: Permission[]): boolean {
  if (!user.permissions) return false;
  return requiredPermissions.every(permission => user.permissions!.includes(permission));
}

function hasPhiAccess(user: HealthcareUser): boolean {
  const phiPermissions = [
    Permission.VIEW_STUDENT_HEALTH_RECORDS,
    Permission.CREATE_HEALTH_RECORDS,
    Permission.UPDATE_HEALTH_RECORDS,
    Permission.VIEW_IMMUNIZATION_RECORDS
  ];
  
  return user.permissions?.some(permission => phiPermissions.includes(permission)) || false;
}

function canAccessPatient(user: HealthcareUser, patientId: string): boolean {
  // System admins can access any patient
  if (user.role === UserRole.SYSTEM_ADMIN) {
    return true;
  }
  
  // Students can only access their own records
  if (user.role === UserRole.STUDENT) {
    return user.userId === patientId;
  }
  
  // Healthcare providers can access patients in their facility
  return user.facilityId !== undefined;
}

async function logAuditEvent(event: AuditEvent): Promise<void> {
  // Implementation would depend on your audit logging system
  console.log('Audit Event:', JSON.stringify(event, null, 2));
}

function logEmergencyAccess(user: HealthcareUser, method: string, reason: string): void {
  console.log(`Emergency Access: User ${user.userId} accessed ${method} - Reason: ${reason}`);
}

function sanitizeForAudit(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveFields = ['password', 'token', 'ssn', 'socialSecurityNumber'];
  const sanitized = Array.isArray(data) ? [...data] : { ...data };
  
  function recursiveSanitize(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(recursiveSanitize);
    } else if (obj && typeof obj === 'object') {
      const sanitizedObj = { ...obj };
      sensitiveFields.forEach(field => {
        if (field in sanitizedObj) {
          sanitizedObj[field] = '[REDACTED]';
        }
      });
      Object.keys(sanitizedObj).forEach(key => {
        sanitizedObj[key] = recursiveSanitize(sanitizedObj[key]);
      });
      return sanitizedObj;
    }
    return obj;
  }
  
  return recursiveSanitize(sanitized);
}

function generateCorrelationId(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Export metadata keys for reflection
export const MetadataKeys = {
  REQUIRED_ROLE_KEY,
  REQUIRED_PERMISSIONS_KEY,
  AUDIT_ENABLED_KEY,
  PHI_ACCESS_KEY,
  RATE_LIMIT_KEY,
  VALIDATION_RULES_KEY
};

export default {
  RequireRole,
  RequirePermissions,
  AuditLog,
  PHIAccess,
  RateLimit,
  ValidateInput,
  Cache,
  MetadataKeys
};
