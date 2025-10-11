/**
 * Access Control & Security Validation Schemas
 * Zod schemas for validating access control operations on the frontend
 *
 * These schemas match the backend Sequelize model validations to ensure
 * consistent validation across the full stack.
 */

import { z } from 'zod';
import {
  SecurityIncidentType,
  IncidentSeverity,
  SecurityIncidentStatus,
  IpRestrictionType,
} from '@/types/accessControl';

// ============================================================================
// CONSTANTS - Valid Resources and Actions
// ============================================================================

export const VALID_RESOURCES = [
  'students',
  'medications',
  'health_records',
  'reports',
  'users',
  'system',
  'security',
  'appointments',
  'incidents',
  'emergency_contacts',
  'inventory',
  'documents',
  'communications',
  'compliance',
  'analytics',
] as const;

export const VALID_ACTIONS = [
  'read',
  'create',
  'update',
  'delete',
  'manage',
  'administer',
  'configure',
  'export',
  'import',
  'approve',
  'review',
  'audit',
] as const;

export const RESERVED_ROLE_NAMES = [
  'SYSTEM',
  'ROOT',
  'SUPERADMIN',
  'SUPERUSER',
] as const;

// ============================================================================
// ROLE SCHEMAS
// ============================================================================

/**
 * Role name validation
 */
export const roleNameSchema = z
  .string()
  .trim()
  .min(2, 'Role name must be at least 2 characters')
  .max(100, 'Role name must not exceed 100 characters')
  .regex(
    /^[a-zA-Z0-9\s\-_]+$/,
    'Role name can only contain letters, numbers, spaces, hyphens, and underscores'
  )
  .refine(
    (value) => !RESERVED_ROLE_NAMES.includes(value.toUpperCase() as any),
    (value) => ({ message: `Role name '${value}' is reserved and cannot be used` })
  );

/**
 * Role description validation
 */
export const roleDescriptionSchema = z
  .string()
  .trim()
  .max(1000, 'Role description must not exceed 1000 characters')
  .optional();

/**
 * Create role schema
 */
export const createRoleSchema = z.object({
  name: roleNameSchema,
  description: roleDescriptionSchema,
});

/**
 * Update role schema
 */
export const updateRoleSchema = z.object({
  name: roleNameSchema.optional(),
  description: roleDescriptionSchema,
});

// ============================================================================
// PERMISSION SCHEMAS
// ============================================================================

/**
 * Permission resource validation
 */
export const permissionResourceSchema = z
  .string()
  .trim()
  .min(2, 'Resource must be at least 2 characters')
  .max(100, 'Resource must not exceed 100 characters')
  .regex(
    /^[a-z0-9_]+$/,
    'Resource must be lowercase alphanumeric with underscores only (e.g., students, health_records)'
  )
  .refine(
    (value) => VALID_RESOURCES.includes(value as any),
    (value) => ({
      message: `Invalid resource type '${value}'. Must be one of: ${VALID_RESOURCES.join(', ')}`,
    })
  );

/**
 * Permission action validation
 */
export const permissionActionSchema = z
  .string()
  .trim()
  .min(2, 'Action must be at least 2 characters')
  .max(50, 'Action must not exceed 50 characters')
  .regex(
    /^[a-z0-9_]+$/,
    'Action must be lowercase alphanumeric with underscores only'
  )
  .refine(
    (value) => VALID_ACTIONS.includes(value as any),
    (value) => ({
      message: `Invalid action type '${value}'. Must be one of: ${VALID_ACTIONS.join(', ')}`,
    })
  );

/**
 * Permission description validation
 */
export const permissionDescriptionSchema = z
  .string()
  .trim()
  .max(500, 'Permission description must not exceed 500 characters')
  .optional();

/**
 * Create permission schema
 */
export const createPermissionSchema = z
  .object({
    resource: permissionResourceSchema,
    action: permissionActionSchema,
    description: permissionDescriptionSchema,
  })
  .refine(
    (data) => {
      // Validate resource-action combinations for restricted resources
      const restrictedCombinations: Record<string, readonly string[]> = {
        system: ['read', 'configure', 'manage'],
        security: ['read', 'manage', 'audit'],
        compliance: ['read', 'manage', 'audit', 'export'],
      };

      if (restrictedCombinations[data.resource]) {
        return restrictedCombinations[data.resource].includes(data.action);
      }
      return true;
    },
    (data) => ({
      message: `Invalid action '${data.action}' for resource '${data.resource}'`,
      path: ['action'],
    })
  );

// ============================================================================
// SESSION SCHEMAS
// ============================================================================

/**
 * IP address validation (IPv4 or IPv6)
 */
export const ipAddressSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
      return ipv4Regex.test(value) || ipv6Regex.test(value);
    },
    'Invalid IP address format'
  )
  .optional();

/**
 * User agent validation
 */
export const userAgentSchema = z
  .string()
  .max(500, 'User agent string must not exceed 500 characters')
  .optional();

/**
 * Session token validation
 */
export const sessionTokenSchema = z
  .string()
  .min(32, 'Session token must be at least 32 characters')
  .max(512, 'Session token must not exceed 512 characters');

/**
 * Session expiration validation
 */
export const sessionExpirationSchema = z
  .date()
  .refine((date) => date > new Date(), 'Session expiration must be in the future')
  .refine(
    (date) => {
      const maxExpirationDays = 30;
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + maxExpirationDays);
      return date <= maxDate;
    },
    'Session expiration cannot be more than 30 days in the future'
  );

/**
 * Create session schema
 */
export const createSessionSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
  token: sessionTokenSchema,
  ipAddress: ipAddressSchema,
  userAgent: userAgentSchema,
  expiresAt: sessionExpirationSchema,
});

// ============================================================================
// LOGIN ATTEMPT SCHEMAS
// ============================================================================

/**
 * Email validation
 */
export const emailSchema = z
  .string()
  .email('Must be a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters');

/**
 * Failure reason validation
 */
export const failureReasonSchema = z
  .string()
  .max(255, 'Failure reason must not exceed 255 characters')
  .optional();

/**
 * Log login attempt schema
 */
export const logLoginAttemptSchema = z
  .object({
    email: emailSchema,
    success: z.boolean(),
    ipAddress: ipAddressSchema,
    userAgent: userAgentSchema,
    failureReason: failureReasonSchema,
  })
  .refine(
    (data) => {
      // Failure reason is required for failed attempts
      if (!data.success && !data.failureReason) {
        return false;
      }
      return true;
    },
    {
      message: 'Failure reason is required for failed login attempts',
      path: ['failureReason'],
    }
  );

// ============================================================================
// IP RESTRICTION SCHEMAS
// ============================================================================

/**
 * IP address or CIDR range validation
 */
export const ipOrCidrSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
      const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

      if (!ipv4Regex.test(value) && !cidrRegex.test(value) && !ipv6Regex.test(value)) {
        return false;
      }

      // Validate IPv4 octets
      if (ipv4Regex.test(value) || cidrRegex.test(value)) {
        const parts = value.split('/')[0].split('.');
        for (const part of parts) {
          const num = parseInt(part);
          if (num < 0 || num > 255) {
            return false;
          }
        }

        // Validate CIDR notation
        if (cidrRegex.test(value)) {
          const cidrBits = parseInt(value.split('/')[1]);
          if (cidrBits < 0 || cidrBits > 32) {
            return false;
          }
        }
      }

      return true;
    },
    'Invalid IP address or CIDR range format'
  )
  .refine(
    (value) => {
      const localhostPatterns = ['127.0.0.1', 'localhost', '::1', '0.0.0.0'];
      return !localhostPatterns.some((pattern) => value.includes(pattern));
    },
    'Cannot restrict localhost addresses'
  );

/**
 * IP restriction type validation
 */
export const ipRestrictionTypeSchema = z.nativeEnum(IpRestrictionType);

/**
 * IP restriction reason validation
 */
export const ipRestrictionReasonSchema = z
  .string()
  .trim()
  .max(1000, 'Reason must not exceed 1000 characters')
  .optional();

/**
 * Add IP restriction schema
 */
export const addIpRestrictionSchema = z.object({
  ipAddress: ipOrCidrSchema,
  type: ipRestrictionTypeSchema,
  reason: ipRestrictionReasonSchema,
  createdBy: z.string().uuid('Created by must be a valid UUID'),
});

// ============================================================================
// SECURITY INCIDENT SCHEMAS
// ============================================================================

/**
 * Security incident type validation
 */
export const securityIncidentTypeSchema = z.nativeEnum(SecurityIncidentType);

/**
 * Incident severity validation
 */
export const incidentSeveritySchema = z.nativeEnum(IncidentSeverity);

/**
 * Security incident status validation
 */
export const securityIncidentStatusSchema = z.nativeEnum(SecurityIncidentStatus);

/**
 * Security incident description validation
 */
export const incidentDescriptionSchema = z
  .string()
  .trim()
  .min(10, 'Incident description must be at least 10 characters')
  .max(5000, 'Incident description must not exceed 5000 characters');

/**
 * Affected resources validation
 */
export const affectedResourcesSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, 'Each affected resource must be a non-empty string')
      .max(255, 'Each affected resource must not exceed 255 characters')
  )
  .max(100, 'Cannot have more than 100 affected resources')
  .optional()
  .default([]);

/**
 * Incident resolution validation
 */
export const incidentResolutionSchema = z
  .string()
  .trim()
  .max(5000, 'Resolution must not exceed 5000 characters')
  .optional();

/**
 * Create security incident schema
 */
export const createSecurityIncidentSchema = z.object({
  type: securityIncidentTypeSchema,
  severity: incidentSeveritySchema,
  description: incidentDescriptionSchema,
  affectedResources: affectedResourcesSchema,
  detectedBy: z
    .string()
    .max(255, 'Detected by field must not exceed 255 characters')
    .optional(),
});

/**
 * Update security incident schema
 */
export const updateSecurityIncidentSchema = z
  .object({
    status: securityIncidentStatusSchema.optional(),
    resolution: incidentResolutionSchema,
    resolvedBy: z.string().uuid('Resolved by must be a valid UUID').optional(),
  })
  .refine(
    (data) => {
      const resolvedStatuses = [
        SecurityIncidentStatus.RESOLVED,
        SecurityIncidentStatus.CLOSED,
      ];
      if (data.status && resolvedStatuses.includes(data.status)) {
        return !!data.resolution && !!data.resolvedBy;
      }
      return true;
    },
    {
      message: 'Resolution details and resolved by user are required for resolved or closed incidents',
      path: ['resolution'],
    }
  );

// ============================================================================
// ROLE & PERMISSION ASSIGNMENT SCHEMAS
// ============================================================================

/**
 * Assign permission to role schema
 */
export const assignPermissionToRoleSchema = z.object({
  roleId: z.string().uuid('Role ID must be a valid UUID'),
  permissionId: z.string().uuid('Permission ID must be a valid UUID'),
});

/**
 * Assign role to user schema
 */
export const assignRoleToUserSchema = z.object({
  userId: z.string().uuid('User ID must be a valid UUID'),
  roleId: z.string().uuid('Role ID must be a valid UUID'),
});

// ============================================================================
// SECURITY INCIDENT FILTERS SCHEMA
// ============================================================================

/**
 * Security incident filters schema
 */
export const securityIncidentFiltersSchema = z.object({
  type: securityIncidentTypeSchema.optional(),
  severity: incidentSeveritySchema.optional(),
  status: securityIncidentStatusSchema.optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type LogLoginAttemptInput = z.infer<typeof logLoginAttemptSchema>;
export type AddIpRestrictionInput = z.infer<typeof addIpRestrictionSchema>;
export type CreateSecurityIncidentInput = z.infer<typeof createSecurityIncidentSchema>;
export type UpdateSecurityIncidentInput = z.infer<typeof updateSecurityIncidentSchema>;
export type AssignPermissionToRoleInput = z.infer<typeof assignPermissionToRoleSchema>;
export type AssignRoleToUserInput = z.infer<typeof assignRoleToUserSchema>;
export type SecurityIncidentFiltersInput = z.infer<typeof securityIncidentFiltersSchema>;
