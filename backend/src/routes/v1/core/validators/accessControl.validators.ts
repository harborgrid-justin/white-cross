/**
 * Access Control Validators
 * Validation schemas for RBAC, security incidents, and IP restrictions
 */

import Joi from 'joi';
import {
  uuidParamSchema,
  paginationSchema,
  emailSchema
} from '../../../shared/validators';

/**
 * Role Management Schemas
 */

export const createRoleSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .description('Role name')
    .messages({
      'string.min': 'Role name must be at least 2 characters',
      'string.max': 'Role name cannot exceed 50 characters',
      'any.required': 'Role name is required'
    }),
  description: Joi.string()
    .trim()
    .max(255)
    .optional()
    .description('Role description'),
  permissions: Joi.array()
    .items(Joi.string().uuid())
    .optional()
    .description('Array of permission UUIDs to assign to this role')
});

export const updateRoleSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .description('Role name'),
  description: Joi.string()
    .trim()
    .max(255)
    .optional()
    .description('Role description')
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const roleIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().description('Role UUID')
});

/**
 * Permission Management Schemas
 */

export const createPermissionSchema = Joi.object({
  resource: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .description('Resource name (e.g., "users", "medications")')
    .messages({
      'any.required': 'Resource is required'
    }),
  action: Joi.string()
    .trim()
    .valid('create', 'read', 'update', 'delete', 'list', 'execute')
    .required()
    .description('Action type')
    .messages({
      'any.required': 'Action is required',
      'any.only': 'Action must be one of: create, read, update, delete, list, execute'
    }),
  description: Joi.string()
    .trim()
    .max(255)
    .optional()
    .description('Permission description')
});

export const permissionIdParamSchema = Joi.object({
  permissionId: Joi.string().uuid().required().description('Permission UUID')
});

/**
 * Role-Permission Assignment Schemas
 */

export const rolePermissionParamsSchema = Joi.object({
  roleId: Joi.string().uuid().required().description('Role UUID'),
  permissionId: Joi.string().uuid().required().description('Permission UUID')
});

/**
 * User-Role Assignment Schemas
 */

export const userRoleParamsSchema = Joi.object({
  userId: Joi.string().uuid().required().description('User UUID'),
  roleId: Joi.string().uuid().required().description('Role UUID')
});

export const userIdParamSchema = Joi.object({
  userId: Joi.string().uuid().required().description('User UUID')
});

/**
 * Permission Checking Schemas
 */

export const checkPermissionQuerySchema = Joi.object({
  resource: Joi.string()
    .trim()
    .required()
    .description('Resource to check permission for'),
  action: Joi.string()
    .trim()
    .required()
    .description('Action to check permission for')
});

/**
 * Session Management Schemas
 */

export const sessionTokenParamSchema = Joi.object({
  token: Joi.string()
    .trim()
    .required()
    .description('Session token')
});

/**
 * Security Incidents Schemas
 */

export const securityIncidentTypeSchema = Joi.string()
  .valid(
    'UNAUTHORIZED_ACCESS',
    'FAILED_LOGIN',
    'BRUTE_FORCE',
    'IP_BLOCKED',
    'SUSPICIOUS_ACTIVITY',
    'DATA_BREACH',
    'MALWARE',
    'PHISHING',
    'OTHER'
  )
  .description('Security incident type');

export const securityIncidentSeveritySchema = Joi.string()
  .valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
  .description('Security incident severity');

export const securityIncidentStatusSchema = Joi.string()
  .valid('OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED', 'FALSE_POSITIVE')
  .description('Security incident status');

export const createSecurityIncidentSchema = Joi.object({
  type: securityIncidentTypeSchema.required(),
  severity: securityIncidentSeveritySchema.required(),
  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .description('Incident description')
    .messages({
      'string.min': 'Description must be at least 10 characters',
      'any.required': 'Description is required'
    }),
  ipAddress: Joi.string()
    .ip({ version: ['ipv4', 'ipv6'] })
    .optional()
    .description('IP address associated with incident'),
  userId: Joi.string()
    .uuid()
    .optional()
    .description('User ID associated with incident'),
  metadata: Joi.object()
    .optional()
    .description('Additional incident metadata')
});

export const updateSecurityIncidentSchema = Joi.object({
  status: securityIncidentStatusSchema.optional(),
  severity: securityIncidentSeveritySchema.optional(),
  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .optional()
    .description('Updated incident description'),
  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .description('Investigation notes'),
  resolvedAt: Joi.date()
    .iso()
    .optional()
    .description('Resolution timestamp'),
  resolvedBy: Joi.string()
    .uuid()
    .optional()
    .description('User who resolved the incident')
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const securityIncidentsQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  type: securityIncidentTypeSchema.optional(),
  severity: securityIncidentSeveritySchema.optional(),
  status: securityIncidentStatusSchema.optional(),
  startDate: Joi.date()
    .iso()
    .optional()
    .description('Filter incidents after this date'),
  endDate: Joi.date()
    .iso()
    .optional()
    .description('Filter incidents before this date'),
  userId: Joi.string()
    .uuid()
    .optional()
    .description('Filter by user ID')
});

export const securityIncidentIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().description('Security incident UUID')
});

/**
 * IP Restrictions Schemas
 */

export const ipRestrictionTypeSchema = Joi.string()
  .valid('ALLOW', 'DENY')
  .description('IP restriction type');

export const createIpRestrictionSchema = Joi.object({
  ipAddress: Joi.string()
    .ip({ version: ['ipv4', 'ipv6'], cidr: 'optional' })
    .required()
    .description('IP address or CIDR range')
    .messages({
      'any.required': 'IP address is required',
      'string.ip': 'Must be a valid IP address or CIDR range'
    }),
  type: ipRestrictionTypeSchema.required(),
  description: Joi.string()
    .trim()
    .max(255)
    .optional()
    .description('Restriction description'),
  expiresAt: Joi.date()
    .iso()
    .greater('now')
    .optional()
    .description('Expiration timestamp')
    .messages({
      'date.greater': 'Expiration date must be in the future'
    })
});

export const ipRestrictionIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().description('IP restriction UUID')
});
