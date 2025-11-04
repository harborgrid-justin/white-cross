/**
 * @fileoverview Base validation schemas for user management
 * @module schemas/user.base
 *
 * Core Zod validation primitives used across user schemas.
 * Includes email, password, phone, IP validation and enums.
 */

import { z } from 'zod';

// ==========================================
// PRIMITIVE VALIDATION SCHEMAS
// ==========================================

/**
 * Password validation schema with strong security requirements
 *
 * Requirements:
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 *
 * @example
 * passwordSchema.parse('MyP@ssw0rd123'); // Valid
 * passwordSchema.parse('weak'); // Throws validation error
 */
export const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Email validation schema
 *
 * Validates email format, converts to lowercase, and trims whitespace.
 *
 * @example
 * emailSchema.parse('user@example.com'); // Valid
 * emailSchema.parse('  USER@EXAMPLE.COM  '); // Returns 'user@example.com'
 */
export const emailSchema = z.string()
  .email('Invalid email address')
  .toLowerCase()
  .trim();

/**
 * Phone number validation schema (E.164 format)
 *
 * Validates international phone numbers in E.164 format.
 * Format: +[country code][number]
 *
 * @example
 * phoneSchema.parse('+12345678901'); // Valid
 * phoneSchema.parse('+442071234567'); // Valid
 * phoneSchema.parse('123456'); // Throws validation error
 */
export const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

/**
 * IP address validation schema (IPv4 and CIDR notation)
 *
 * Validates IPv4 addresses with optional CIDR notation for subnet masks.
 * Ensures each octet is within valid range (0-255).
 *
 * @example
 * ipAddressSchema.parse('192.168.1.1'); // Valid
 * ipAddressSchema.parse('10.0.0.0/24'); // Valid with CIDR
 * ipAddressSchema.parse('256.1.1.1'); // Throws validation error (invalid range)
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

// ==========================================
// USER ENUM SCHEMAS
// ==========================================

/**
 * User role enum
 *
 * Defines the complete hierarchy of user roles in the system.
 *
 * Role hierarchy (highest to lowest privilege):
 * - super_admin: Full system access, can manage all resources
 * - system_admin: Can manage system configuration and users
 * - user_admin: Can manage users within their school
 * - settings_admin: Can configure school settings
 * - health_admin: Can manage health-related data and reports
 * - nurse_manager: Can oversee clinical staff and workflows
 * - clinical_staff: Can access clinical features
 * - read_only_admin: Can view all data but not modify
 * - nurse: Can perform nursing tasks
 * - staff: General staff access
 * - parent: Parent/guardian access
 * - student: Student access
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
 * User account status enum
 *
 * Defines all possible states of a user account.
 *
 * Status descriptions:
 * - active: Account is active and user can log in
 * - inactive: Account is deactivated, user cannot log in
 * - suspended: Account is temporarily suspended, can be reactivated
 * - pending: Account is created but pending activation/approval
 * - locked: Account is locked due to security reasons (e.g., failed login attempts)
 */
export const userStatusEnum = z.enum([
  'active',
  'inactive',
  'suspended',
  'pending',
  'locked'
]);

/**
 * Multi-Factor Authentication (MFA) method enum
 *
 * Defines supported MFA methods for enhanced security.
 *
 * Method descriptions:
 * - totp: Time-based One-Time Password (Google Authenticator, Authy, etc.)
 * - sms: One-time code sent via SMS
 * - email: One-time code sent via email
 * - backup_codes: Pre-generated backup codes for account recovery
 */
export const mfaMethodEnum = z.enum([
  'totp',
  'sms',
  'email',
  'backup_codes'
]);

// ==========================================
// TYPE EXPORTS
// ==========================================

/**
 * TypeScript type inference exports for type-safe usage
 */
export type UserRole = z.infer<typeof userRoleEnum>;
export type UserStatus = z.infer<typeof userStatusEnum>;
export type MFAMethod = z.infer<typeof mfaMethodEnum>;
