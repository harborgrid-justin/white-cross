/**
 * @fileoverview Validation schemas for user management
 * @module schemas/user
 *
 * Zod validation schemas for admin user management operations.
 * Includes schemas for user CRUD, MFA setup, role assignment, and IP restrictions.
 */

import { z } from 'zod';

// ==========================================
// USER VALIDATION SCHEMAS
// ==========================================

/**
 * Password validation schema with strong security requirements
 */
export const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Email validation schema
 */
export const emailSchema = z.string()
  .email('Invalid email address')
  .toLowerCase()
  .trim();

/**
 * Phone number validation schema (E.164 format)
 */
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

/**
 * IP address validation schema (IPv4 and CIDR notation)
 */
export const ipAddressSchema = z.string()
  .regex(
    /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/,
    'Invalid IP address or CIDR notation'
  )
  .refine((ip) => {
    const parts = ip.split('/')[0].split('.');
    return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
  }, 'Invalid IP address range');

/**
 * User role enum
 */
export const userRoleEnum = z.enum([
  'super_admin',
  'system_admin',
  'user_admin',
  'settings_admin',
  'health_admin',
  'nurse_manager',
  'clinical_staff',
  'read_only_admin',
  'nurse',
  'staff',
  'parent',
  'student'
]);

/**
 * User status enum
 */
export const userStatusEnum = z.enum([
  'active',
  'inactive',
  'suspended',
  'pending',
  'locked'
]);

/**
 * MFA method enum
 */
export const mfaMethodEnum = z.enum([
  'totp', // Time-based One-Time Password (Google Authenticator, Authy, etc.)
  'sms',
  'email',
  'backup_codes'
]);

// ==========================================
// USER CREATE SCHEMA
// ==========================================

export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  phone: phoneSchema,
  role: userRoleEnum,
  status: userStatusEnum.default('active'),
  mfaRequired: z.boolean().default(false),
  mfaMethod: mfaMethodEnum.optional(),
  ipRestrictions: z.array(ipAddressSchema).optional(),
  sendWelcomeEmail: z.boolean().default(true),
  forcePasswordChange: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
}).refine((data) => {
  // If MFA is required, a method must be selected
  if (data.mfaRequired && !data.mfaMethod) {
    return false;
  }
  return true;
}, {
  message: 'MFA method is required when MFA is enabled',
  path: ['mfaMethod'],
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ==========================================
// USER UPDATE SCHEMA
// ==========================================

export const updateUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  email: emailSchema.optional(),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim()
    .optional(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim()
    .optional(),
  phone: phoneSchema,
  role: userRoleEnum.optional(),
  status: userStatusEnum.optional(),
  mfaRequired: z.boolean().optional(),
  mfaMethod: mfaMethodEnum.optional(),
  ipRestrictions: z.array(ipAddressSchema).optional(),
  metadata: z.record(z.any()).optional(),
}).refine((data) => {
  // If MFA is required, a method must be selected
  if (data.mfaRequired && !data.mfaMethod) {
    return false;
  }
  return true;
}, {
  message: 'MFA method is required when MFA is enabled',
  path: ['mfaMethod'],
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ==========================================
// USER DELETE SCHEMA
// ==========================================

export const deleteUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  transferDataTo: z.string().uuid('Invalid transfer user ID').optional(),
  reason: z.string().min(10, 'Deletion reason must be at least 10 characters'),
  permanentDelete: z.boolean().default(false),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

// ==========================================
// PASSWORD RESET SCHEMA
// ==========================================

export const resetUserPasswordSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  newPassword: passwordSchema.optional(),
  sendResetEmail: z.boolean().default(true),
  forcePasswordChange: z.boolean().default(true),
  notifyUser: z.boolean().default(true),
});

export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>;

// ==========================================
// USER STATUS TOGGLE SCHEMA
// ==========================================

export const toggleUserStatusSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  status: userStatusEnum,
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  notifyUser: z.boolean().default(true),
});

export type ToggleUserStatusInput = z.infer<typeof toggleUserStatusSchema>;

// ==========================================
// ROLE ASSIGNMENT SCHEMA
// ==========================================

export const assignRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  roleId: z.string().uuid('Invalid role ID'),
  effectiveFrom: z.string().datetime().optional(),
  effectiveTo: z.string().datetime().optional(),
  notifyUser: z.boolean().default(true),
}).refine((data) => {
  if (data.effectiveFrom && data.effectiveTo) {
    return new Date(data.effectiveFrom) < new Date(data.effectiveTo);
  }
  return true;
}, {
  message: 'Effective from date must be before effective to date',
  path: ['effectiveTo'],
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;

export const removeRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  roleId: z.string().uuid('Invalid role ID'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  notifyUser: z.boolean().default(true),
});

export type RemoveRoleInput = z.infer<typeof removeRoleSchema>;

// ==========================================
// USER PERMISSIONS SCHEMA
// ==========================================

export const updateUserPermissionsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  permissions: z.array(z.object({
    resource: z.string().min(1, 'Resource is required'),
    action: z.enum(['create', 'read', 'update', 'delete', 'manage']),
    scope: z.enum(['global', 'school', 'self']).default('school'),
    conditions: z.record(z.any()).optional(),
    allow: z.boolean().default(true), // true = allow, false = explicit deny
  })),
  replaceExisting: z.boolean().default(false), // true = replace all, false = merge
  notifyUser: z.boolean().default(false),
});

export type UpdateUserPermissionsInput = z.infer<typeof updateUserPermissionsSchema>;

// ==========================================
// MFA SETUP SCHEMA
// ==========================================

export const setupMFASchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  method: mfaMethodEnum,
  phoneNumber: phoneSchema.optional(),
  backupCodes: z.array(z.string()).length(10).optional(),
}).refine((data) => {
  // If SMS method, phone number is required
  if (data.method === 'sms' && !data.phoneNumber) {
    return false;
  }
  return true;
}, {
  message: 'Phone number is required for SMS MFA',
  path: ['phoneNumber'],
});

export type SetupMFAInput = z.infer<typeof setupMFASchema>;

export const verifyMFASchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  code: z.string().length(6, 'MFA code must be 6 digits'),
  method: mfaMethodEnum,
});

export type VerifyMFAInput = z.infer<typeof verifyMFASchema>;

export const disableMFASchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  adminOverride: z.boolean().default(false),
});

export type DisableMFAInput = z.infer<typeof disableMFASchema>;

// ==========================================
// IP RESTRICTION SCHEMA
// ==========================================

export const updateIPRestrictionsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  ipAddresses: z.array(ipAddressSchema).min(1, 'At least one IP address is required'),
  replaceExisting: z.boolean().default(true),
  notifyUser: z.boolean().default(true),
});

export type UpdateIPRestrictionsInput = z.infer<typeof updateIPRestrictionsSchema>;

export const removeIPRestrictionsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  notifyUser: z.boolean().default(true),
});

export type RemoveIPRestrictionsInput = z.infer<typeof removeIPRestrictionsSchema>;

// ==========================================
// USER SEARCH/FILTER SCHEMA
// ==========================================

export const searchUsersSchema = z.object({
  query: z.string().optional(),
  role: userRoleEnum.optional(),
  status: userStatusEnum.optional(),
  mfaEnabled: z.boolean().optional(),
  lastLoginBefore: z.string().datetime().optional(),
  lastLoginAfter: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
  sortBy: z.enum(['email', 'firstName', 'lastName', 'createdAt', 'lastLoginAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type SearchUsersInput = z.infer<typeof searchUsersSchema>;

// ==========================================
// BULK USER OPERATIONS SCHEMA
// ==========================================

export const bulkUpdateUsersSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1, 'At least one user ID is required').max(100, 'Maximum 100 users at once'),
  updates: z.object({
    status: userStatusEnum.optional(),
    role: userRoleEnum.optional(),
    mfaRequired: z.boolean().optional(),
  }),
  notifyUsers: z.boolean().default(false),
});

export type BulkUpdateUsersInput = z.infer<typeof bulkUpdateUsersSchema>;

export const bulkDeleteUsersSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1, 'At least one user ID is required').max(50, 'Maximum 50 users at once'),
  reason: z.string().min(10, 'Deletion reason must be at least 10 characters'),
  permanentDelete: z.boolean().default(false),
});

export type BulkDeleteUsersInput = z.infer<typeof bulkDeleteUsersSchema>;

// ==========================================
// USER SESSION MANAGEMENT SCHEMA
// ==========================================

export const getUserSessionsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  activeOnly: z.boolean().default(true),
});

export type GetUserSessionsInput = z.infer<typeof getUserSessionsSchema>;

export const revokeUserSessionSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  sessionId: z.string().uuid('Invalid session ID'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  notifyUser: z.boolean().default(true),
});

export type RevokeUserSessionInput = z.infer<typeof revokeUserSessionSchema>;

export const revokeAllUserSessionsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  notifyUser: z.boolean().default(true),
  excludeCurrentSession: z.boolean().default(true),
});

export type RevokeAllUserSessionsInput = z.infer<typeof revokeAllUserSessionsSchema>;

// ==========================================
// USER ACTIVITY LOG SCHEMA
// ==========================================

export const getUserActivitySchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  actionType: z.string().optional(),
  resource: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

export type GetUserActivityInput = z.infer<typeof getUserActivitySchema>;

// ==========================================
// EXPORT SCHEMAS
// ==========================================

export const exportUsersSchema = z.object({
  format: z.enum(['csv', 'json', 'xlsx']).default('csv'),
  filters: searchUsersSchema.omit({ page: true, limit: true }).optional(),
  includeInactive: z.boolean().default(false),
  includeMetadata: z.boolean().default(false),
});

export type ExportUsersInput = z.infer<typeof exportUsersSchema>;
