/**
 * @fileoverview System API Validation Schemas and Constants
 * 
 * Provides comprehensive validation schemas and constants for system administration
 * operations including configuration, feature flags, integrations, and school management.
 * 
 * @module systemApi/validation
 * @version 1.0.0
 * @since 2025-11-11
 */

import { z } from 'zod';

/**
 * Valid system configuration categories
 * 
 * Organizes system settings into logical groups for easier management
 * and proper access control.
 */
export const CONFIG_CATEGORIES = [
  'GENERAL',
  'SECURITY',
  'NOTIFICATION', 
  'EMAIL',
  'SMS',
  'STORAGE',
  'INTEGRATION',
  'AUDIT',
  'PERFORMANCE',
  'FEATURE_FLAGS'
] as const;

/**
 * Valid configuration value types
 * 
 * Ensures type safety for configuration values with proper
 * serialization and validation.
 */
export const CONFIG_VALUE_TYPES = [
  'STRING',
  'NUMBER', 
  'BOOLEAN',
  'JSON'
] as const;

/**
 * Valid integration types for external system connections
 * 
 * Defines supported integration categories for proper
 * configuration and credential management.
 */
export const INTEGRATION_TYPES = [
  'SIS',              // Student Information System
  'EHR',              // Electronic Health Records
  'PHARMACY',         // Pharmacy management system
  'EMAIL',            // Email service provider
  'SMS',              // SMS service provider
  'PAYMENT',          // Payment gateway
  'IDENTITY_PROVIDER', // SSO/SAML provider
  'OTHER'             // Custom integrations
] as const;

/**
 * Valid integration status values
 */
export const INTEGRATION_STATUS_VALUES = [
  'ACTIVE',
  'INACTIVE', 
  'ERROR',
  'CONFIGURING'
] as const;

/**
 * Valid grade transition status values
 */
export const GRADE_TRANSITION_STATUS_VALUES = [
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED'
] as const;

/**
 * Valid sync status values for data synchronization
 */
export const SYNC_STATUS_VALUES = [
  'IDLE',
  'SYNCING',
  'SUCCESS', 
  'FAILED'
] as const;

/**
 * Valid system health status values
 */
export const HEALTH_STATUS_VALUES = [
  'HEALTHY',
  'DEGRADED', 
  'UNHEALTHY'
] as const;

/**
 * Valid component health status values
 */
export const COMPONENT_STATUS_VALUES = [
  'UP',
  'DOWN',
  'DEGRADED'
] as const;

/**
 * Phone number validation regex for US formats
 * 
 * Supports standard US phone number formats for school contact information.
 */
export const PHONE_REGEX = /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

/**
 * Email validation regex
 * 
 * Basic email format validation for school and administrative contacts.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Feature flag key validation regex
 * 
 * Enforces lowercase alphanumeric keys with hyphens and underscores only.
 */
export const FEATURE_FLAG_KEY_REGEX = /^[a-z0-9-_]+$/;

/**
 * School code validation regex
 * 
 * Alphanumeric school codes, typically 2-10 characters.
 */
export const SCHOOL_CODE_REGEX = /^[A-Za-z0-9-_]{2,10}$/;

/**
 * US ZIP code validation regex
 * 
 * Supports 5-digit and 9-digit ZIP codes.
 */
export const ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;

/**
 * System configuration update schema
 */
export const updateSystemConfigSchema = z.object({
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.record(z.unknown())
  ], {
    message: 'Value must be string, number, boolean, or object'
  }),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

/**
 * Feature flag creation schema with comprehensive validation
 */
export const createFeatureFlagSchema = z.object({
  name: z
    .string()
    .min(1, 'Feature name is required')
    .max(100, 'Feature name cannot exceed 100 characters')
    .trim(),

  key: z
    .string()
    .min(1, 'Feature key is required')
    .max(50, 'Feature key cannot exceed 50 characters')
    .regex(FEATURE_FLAG_KEY_REGEX, 'Key must be lowercase alphanumeric with hyphens/underscores only')
    .transform(val => val.toLowerCase()),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),

  isEnabled: z.boolean(),

  enabledFor: z
    .array(z.string().uuid('Invalid UUID in enabledFor array'))
    .max(1000, 'Cannot enable for more than 1000 entities')
    .optional(),

  enabledPercentage: z
    .number()
    .min(0, 'Percentage must be between 0 and 100')
    .max(100, 'Percentage must be between 0 and 100')
    .optional(),

  metadata: z
    .record(z.unknown())
    .optional(),
});

/**
 * Feature flag update schema - all fields optional
 */
export const updateFeatureFlagSchema = createFeatureFlagSchema.partial().omit({
  key: true
});

/**
 * Grade transition execution schema
 */
export const executeGradeTransitionSchema = z.object({
  academicYear: z
    .string()
    .min(1, 'Academic year is required')
    .regex(/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY (e.g., 2024-2025)'),

  transitionDate: z
    .string()
    .min(1, 'Transition date is required')
    .refine((date) => {
      const d = new Date(date);
      return !isNaN(d.getTime());
    }, {
      message: 'Transition date must be a valid date'
    }),

  dryRun: z
    .boolean()
    .optional(),

  autoPromote: z
    .boolean()
    .optional(),
});

/**
 * US address validation schema
 */
export const addressSchema = z.object({
  street: z
    .string()
    .min(1, 'Street address is required')
    .max(200, 'Street address cannot exceed 200 characters')
    .trim(),

  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City cannot exceed 100 characters')
    .trim(),

  state: z
    .string()
    .length(2, 'State must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase 2-letter code')
    .transform(val => val.toUpperCase()),

  zipCode: z
    .string()
    .regex(ZIP_CODE_REGEX, 'ZIP code must be valid US format (12345 or 12345-6789)')
    .trim(),
});

/**
 * Integration creation schema
 */
export const createIntegrationSchema = z.object({
  name: z
    .string()
    .min(1, 'Integration name is required')
    .max(100, 'Integration name cannot exceed 100 characters')
    .trim(),

  type: z.enum(INTEGRATION_TYPES, {
    message: 'Invalid integration type'
  }),

  provider: z
    .string()
    .min(1, 'Provider name is required')
    .max(100, 'Provider name cannot exceed 100 characters')
    .trim(),

  config: z
    .record(z.unknown())
    .refine((config) => Object.keys(config).length > 0, {
      message: 'Configuration object cannot be empty'
    }),

  credentials: z
    .record(z.string())
    .optional(),

  syncEnabled: z
    .boolean()
    .optional(),

  syncInterval: z
    .number()
    .min(5, 'Sync interval must be at least 5 minutes')
    .max(1440, 'Sync interval cannot exceed 24 hours (1440 minutes)')
    .optional(),
});

/**
 * Integration update schema - all fields optional except validations still apply
 */
export const updateIntegrationSchema = createIntegrationSchema.partial().omit({
  type: true
});

/**
 * School creation schema with comprehensive validation
 */
export const createSchoolSchema = z.object({
  name: z
    .string()
    .min(1, 'School name is required')
    .max(200, 'School name cannot exceed 200 characters')
    .trim(),

  code: z
    .string()
    .min(2, 'School code must be at least 2 characters')
    .max(10, 'School code cannot exceed 10 characters')
    .regex(SCHOOL_CODE_REGEX, 'School code must be alphanumeric with optional hyphens/underscores')
    .transform(val => val.toUpperCase()),

  districtId: z
    .string()
    .uuid('District ID must be a valid UUID')
    .optional(),

  address: addressSchema,

  phone: z
    .string()
    .regex(PHONE_REGEX, 'Invalid phone number format')
    .trim(),

  email: z
    .string()
    .email('Invalid email format')
    .max(100, 'Email cannot exceed 100 characters')
    .trim()
    .toLowerCase(),

  principal: z
    .string()
    .max(100, 'Principal name cannot exceed 100 characters')
    .trim()
    .optional(),

  settings: z
    .record(z.unknown())
    .optional(),
});

/**
 * School update schema - all fields optional
 */
export const updateSchoolSchema = createSchoolSchema.partial().extend({
  isActive: z
    .boolean()
    .optional(),
});

/**
 * Student sync request schema
 */
export const syncStudentsSchema = z.object({
  integrationId: z
    .string()
    .uuid('Integration ID must be a valid UUID')
    .optional(),

  fullSync: z
    .boolean()
    .optional(),

  schoolIds: z
    .array(z.string().uuid('School ID must be a valid UUID'))
    .max(100, 'Cannot sync more than 100 schools at once')
    .optional(),
});
