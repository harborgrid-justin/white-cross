/**
 * Healthcare Middleware Decorators
 * TypeScript decorators for middleware functionality and HIPAA compliance
 * 
 * @fileoverview Decorators for healthcare middleware with audit logging and access control
 * @version 1.0.0
 * @author Healthcare Platform Team
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
 */
export function RequireRole(role: UserRole) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(REQUIRED_ROLE_KEY, role, target, propertyName);
    
    const method = descriptor.value;
    descriptor.value = function (...args: any[]) {
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
    descriptor.value = function (...args: any[]) {
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
 * Decorator for enabling audit logging on method calls
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
    descriptor.value = async function (...args: any[]) {
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
            error: error.message,
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
 * Decorator for marking methods that access PHI
 */
export function PHIAccess(options: {
  patientIdParam?: string;
  justificationRequired?: boolean;
  emergencyOverride?: boolean;
} = {}) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(PHI_ACCESS_KEY, options, target, propertyName);
    
    const method = descriptor.value;
    descriptor.value = function (...args: any[]) {
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
    
    descriptor.value = function (...args: any[]) {
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
