/**
 * Administration API - Validation Schemas
 * 
 * Zod validation schemas for administration and system management operations
 * 
 * @module services/modules/administrationApi/validation
 */

import { z } from 'zod';
import {
  UserRole,
  ConfigCategory,
  ConfigValueType,
  ConfigScope,
  LicenseType,
  BackupType,
  MetricType,
  TrainingCategory,
  AuditAction
} from './types';

// ==========================================
// USER VALIDATION SCHEMAS
// ==========================================

export const createUserSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  role: z.nativeEnum(UserRole),
  schoolId: z.string().uuid('Invalid school ID format').optional(),
  districtId: z.string().uuid('Invalid district ID format').optional(),
}).refine(data => {
  // School-level roles must have schoolId
  if (['NURSE', 'SCHOOL_ADMIN', 'COUNSELOR'].includes(data.role) && !data.schoolId) {
    return false;
  }
  // District-level roles must have districtId
  if (data.role === 'DISTRICT_ADMIN' && !data.districtId) {
    return false;
  }
  return true;
}, {
  message: 'Role requires appropriate school or district assignment',
  path: ['schoolId']
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true }).extend({
  isActive: z.boolean().optional(),
});

export const userFiltersSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().max(255).optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  schoolId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
});

// ==========================================
// DISTRICT VALIDATION SCHEMAS
// ==========================================

export const createDistrictSchema = z.object({
  name: z.string()
    .min(2, 'District name must be at least 2 characters')
    .max(200, 'District name cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s\-\.]+$/, 'District name contains invalid characters'),
  code: z.string()
    .min(2, 'District code must be at least 2 characters')
    .max(50, 'District code cannot exceed 50 characters')
    .regex(/^[A-Z0-9_-]+$/, 'District code can only contain uppercase letters, numbers, hyphens, and underscores')
    .transform(val => val.toUpperCase()),
  address: z.string()
    .max(500, 'Address cannot exceed 500 characters')
    .optional(),
  city: z.string()
    .max(100, 'City cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'City name contains invalid characters')
    .optional(),
  state: z.string()
    .length(2, 'State must be a 2-letter abbreviation')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase')
    .transform(val => val.toUpperCase())
    .optional(),
  zipCode: z.string()
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, 'ZIP code must be in format 12345 or 12345-6789')
    .optional(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[\d\s\-\(\)\+\.]+$/, 'Phone number contains invalid characters')
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .optional()
    .or(z.literal('')),
  website: z.string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  superintendent: z.string()
    .max(200, 'Superintendent name cannot exceed 200 characters')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'Superintendent name contains invalid characters')
    .optional(),
}).refine(data => data.phone || data.email || data.address, {
  message: 'District must have at least one form of contact information (phone, email, or address)',
  path: ['phone']
});

export const updateDistrictSchema = createDistrictSchema.partial().extend({
  isActive: z.boolean().optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

// ==========================================
// SCHOOL VALIDATION SCHEMAS
// ==========================================

export const createSchoolSchema = z.object({
  name: z.string()
    .min(2, 'School name must be at least 2 characters')
    .max(200, 'School name cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s\-\.]+$/, 'School name contains invalid characters'),
  code: z.string()
    .min(2, 'School code must be at least 2 characters')
    .max(50, 'School code cannot exceed 50 characters')
    .regex(/^[A-Z0-9_-]+$/, 'School code can only contain uppercase letters, numbers, hyphens, and underscores')
    .transform(val => val.toUpperCase()),
  districtId: z.string()
    .uuid('Invalid district ID format')
    .min(1, 'District ID is required'),
  address: z.string()
    .max(500, 'Address cannot exceed 500 characters')
    .optional(),
  city: z.string()
    .max(100, 'City cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'City name contains invalid characters')
    .optional(),
  state: z.string()
    .length(2, 'State must be a 2-letter abbreviation')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase')
    .transform(val => val.toUpperCase())
    .optional(),
  zipCode: z.string()
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, 'ZIP code must be in format 12345 or 12345-6789')
    .optional(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(/^[\d\s\-\(\)\+\.]+$/, 'Phone number contains invalid characters')
    .optional(),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .optional()
    .or(z.literal('')),
  principal: z.string()
    .max(200, 'Principal name cannot exceed 200 characters')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'Principal name contains invalid characters')
    .optional(),
  totalEnrollment: z.number()
    .int('Total enrollment must be a whole number')
    .min(0, 'Total enrollment cannot be negative')
    .max(50000, 'Total enrollment cannot exceed 50,000')
    .optional(),
  gradeLevel: z.string()
    .max(50, 'Grade level cannot exceed 50 characters')
    .optional(),
  schoolType: z.enum(['ELEMENTARY', 'MIDDLE', 'HIGH', 'K12', 'OTHER']).optional(),
}).refine(data => data.phone || data.email || data.address, {
  message: 'School must have at least one form of contact information (phone, email, or address)',
  path: ['phone']
});

export const updateSchoolSchema = createSchoolSchema.partial().omit({ districtId: true }).extend({
  isActive: z.boolean().optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

// ==========================================
// CONFIGURATION VALIDATION SCHEMAS
// ==========================================

export const configurationSchema = z.object({
  key: z.string()
    .min(2, 'Configuration key must be at least 2 characters')
    .max(255, 'Configuration key cannot exceed 255 characters')
    .regex(/^[a-zA-Z][a-zA-Z0-9._-]*$/, 'Key must start with a letter and contain only letters, numbers, dots, hyphens, and underscores'),
  value: z.string()
    .min(1, 'Configuration value is required')
    .max(10000, 'Configuration value cannot exceed 10,000 characters'),
  category: z.nativeEnum(ConfigCategory),
  valueType: z.nativeEnum(ConfigValueType).optional(),
  subCategory: z.string()
    .max(100, 'Sub-category cannot exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s_-]*$/, 'Sub-category contains invalid characters')
    .optional(),
  description: z.string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  isPublic: z.boolean().optional().default(false),
  isEditable: z.boolean().optional().default(true),
  requiresRestart: z.boolean().optional().default(false),
  scope: z.nativeEnum(ConfigScope).optional().default(ConfigScope.SYSTEM),
  scopeId: z.string().uuid('Scope ID must be a valid UUID').optional(),
  tags: z.array(z.string().max(50, 'Tag cannot exceed 50 characters')).max(10, 'Cannot have more than 10 tags').optional(),
  sortOrder: z.number()
    .int('Sort order must be a whole number')
    .min(0, 'Sort order cannot be negative')
    .max(9999, 'Sort order cannot exceed 9999')
    .optional(),
}).refine(data => {
  // If scope is not SYSTEM, scopeId is required
  if (data.scope && data.scope !== ConfigScope.SYSTEM && !data.scopeId) {
    return false;
  }
  return true;
}, {
  message: 'Scope ID is required for non-system scope configurations',
  path: ['scopeId']
});

// ==========================================
// LICENSE VALIDATION SCHEMAS
// ==========================================

export const createLicenseSchema = z.object({
  licenseKey: z.string()
    .min(10, 'License key must be at least 10 characters')
    .max(100, 'License key cannot exceed 100 characters')
    .regex(/^[A-Z0-9-]+$/, 'License key can only contain uppercase letters, numbers, and hyphens')
    .transform(val => val.toUpperCase()),
  type: z.nativeEnum(LicenseType),
  maxUsers: z.number()
    .int('Max users must be a whole number')
    .min(1, 'Maximum users must be at least 1')
    .max(100000, 'Maximum users cannot exceed 100,000')
    .optional(),
  maxSchools: z.number()
    .int('Max schools must be a whole number')
    .min(1, 'Maximum schools must be at least 1')
    .max(10000, 'Maximum schools cannot exceed 10,000')
    .optional(),
  features: z.array(z.string().max(100, 'Feature name cannot exceed 100 characters'))
    .min(1, 'At least one feature must be specified')
    .max(50, 'Cannot have more than 50 features'),
  issuedTo: z.string()
    .max(200, 'Issued to field cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s\-\.,]+$/, 'Issued to field contains invalid characters')
    .optional(),
  expiresAt: z.string().datetime('Invalid date format').or(z.date()).optional(),
  districtId: z.string().uuid('Invalid district ID format').optional(),
  notes: z.string()
    .max(2000, 'Notes cannot exceed 2000 characters')
    .optional(),
}).refine(data => {
  // Trial license restrictions
  if (data.type === LicenseType.TRIAL) {
    if (!data.maxUsers || data.maxUsers > 10) return false;
    if (!data.maxSchools || data.maxSchools > 2) return false;
    if (!data.expiresAt) return false;
  }
  return true;
}, {
  message: 'Trial license must have maxUsers (≤10), maxSchools (≤2), and expiration date',
  path: ['type']
}).refine(data => {
  // Basic license restrictions
  if (data.type === LicenseType.BASIC) {
    if (data.maxUsers && data.maxUsers > 50) return false;
    if (data.maxSchools && data.maxSchools > 5) return false;
  }
  return true;
}, {
  message: 'Basic license cannot have more than 50 users or 5 schools',
  path: ['type']
}).refine(data => {
  // Professional license restrictions
  if (data.type === LicenseType.PROFESSIONAL) {
    if (data.maxUsers && data.maxUsers > 500) return false;
    if (data.maxSchools && data.maxSchools > 50) return false;
  }
  return true;
}, {
  message: 'Professional license cannot have more than 500 users or 50 schools',
  path: ['type']
});

export const updateLicenseSchema = createLicenseSchema.partial().extend({
  status: z.enum(['ACTIVE', 'EXPIRED', 'SUSPENDED', 'REVOKED']).optional(),
});

// ==========================================
// BACKUP VALIDATION SCHEMAS
// ==========================================

export const createBackupSchema = z.object({
  type: z.nativeEnum(BackupType).optional().default(BackupType.MANUAL),
  includeFiles: z.boolean().optional().default(true),
  compressed: z.boolean().optional().default(true),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
});

// ==========================================
// TRAINING MODULE VALIDATION SCHEMAS
// ==========================================

export const createTrainingModuleSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s\-\.\:]+$/, 'Title contains invalid characters'),
  description: z.string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(50000, 'Content cannot exceed 50,000 characters'),
  duration: z.number()
    .int('Duration must be a whole number')
    .min(1, 'Duration must be at least 1 minute')
    .max(600, 'Duration cannot exceed 600 minutes (10 hours)')
    .optional(),
  category: z.nativeEnum(TrainingCategory),
  isRequired: z.boolean().optional().default(false),
  order: z.number()
    .int('Order must be a whole number')
    .min(0, 'Order cannot be negative')
    .max(10000, 'Order cannot exceed 10,000')
    .optional(),
  attachments: z.array(z.string().url('Attachment must be a valid URL').max(500, 'Attachment URL cannot exceed 500 characters'))
    .max(20, 'Cannot have more than 20 attachments')
    .optional(),
  tags: z.array(z.string().max(50, 'Tag cannot exceed 50 characters'))
    .max(10, 'Cannot have more than 10 tags')
    .optional(),
});

export const updateTrainingModuleSchema = createTrainingModuleSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const recordTrainingCompletionSchema = z.object({
  score: z.number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100')
    .optional(),
  timeSpent: z.number()
    .int('Time spent must be a whole number')
    .min(1, 'Time spent must be at least 1 minute')
    .max(600, 'Time spent cannot exceed 600 minutes')
    .optional(),
  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
});

// ==========================================
// PERFORMANCE METRICS VALIDATION SCHEMAS
// ==========================================

export const recordMetricSchema = z.object({
  metricType: z.nativeEnum(MetricType),
  value: z.number()
    .min(0, 'Metric value cannot be negative')
    .max(Number.MAX_SAFE_INTEGER, 'Metric value is too large'),
  unit: z.string()
    .min(1, 'Unit is required')
    .max(20, 'Unit cannot exceed 20 characters')
    .regex(/^[a-zA-Z%\/\-]+$/, 'Unit contains invalid characters'),
  timestamp: z.string().datetime('Invalid timestamp format').optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string().max(50, 'Tag cannot exceed 50 characters'))
    .max(10, 'Cannot have more than 10 tags')
    .optional(),
});

export const metricFiltersSchema = z.object({
  metricType: z.nativeEnum(MetricType).optional(),
  startDate: z.string().datetime('Invalid start date format').or(z.date()).optional(),
  endDate: z.string().datetime('Invalid end date format').or(z.date()).optional(),
  limit: z.number().int().min(1).max(1000).optional(),
  tags: z.array(z.string()).optional(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start <= end;
  }
  return true;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['startDate']
});

// ==========================================
// AUDIT LOG VALIDATION SCHEMAS
// ==========================================

export const auditLogFiltersSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  userId: z.string().uuid('Invalid user ID format').optional(),
  entityType: z.string().max(100, 'Entity type cannot exceed 100 characters').optional(),
  entityId: z.string().uuid('Invalid entity ID format').optional(),
  action: z.nativeEnum(AuditAction).optional(),
  startDate: z.string().datetime('Invalid start date format').optional(),
  endDate: z.string().datetime('Invalid end date format').optional(),
  success: z.boolean().optional(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start <= end;
  }
  return true;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['startDate']
});

// ==========================================
// SYSTEM SETTINGS VALIDATION SCHEMAS
// ==========================================

export const updateSettingsSchema = z.object({
  settings: z.array(z.object({
    key: z.string().min(1, 'Setting key is required'),
    value: z.string(),
    category: z.nativeEnum(ConfigCategory).optional(),
    valueType: z.nativeEnum(ConfigValueType).optional(),
  })).min(1, 'At least one setting must be provided'),
});

// ==========================================
// COMMON PAGINATION SCHEMA
// ==========================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

// ==========================================
// ID VALIDATION SCHEMAS
// ==========================================

export const uuidSchema = z.string().uuid('Invalid ID format');

export const codeSchema = z.string()
  .min(2, 'Code must be at least 2 characters')
  .max(50, 'Code cannot exceed 50 characters')
  .regex(/^[A-Z0-9_-]+$/, 'Code can only contain uppercase letters, numbers, hyphens, and underscores');

// ==========================================
// VALIDATION HELPERS
// ==========================================

/**
 * Validate email format with additional business rules
 */
export const businessEmailSchema = z.string()
  .email('Invalid email address')
  .max(255, 'Email cannot exceed 255 characters')
  .refine(email => {
    // Block disposable email providers
    const disposableProviders = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return !domain || !disposableProviders.includes(domain);
  }, {
    message: 'Disposable email addresses are not allowed'
  });

/**
 * Validate phone number with international support
 */
export const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 characters')
  .max(20, 'Phone number cannot exceed 20 characters')
  .regex(/^[\d\s\-\(\)\+\.]+$/, 'Phone number contains invalid characters')
  .transform(phone => phone.replace(/\D/g, '')) // Remove non-digits
  .refine(phone => phone.length >= 10, {
    message: 'Phone number must have at least 10 digits'
  });

/**
 * Validate URL with protocol requirement
 */
export const urlSchema = z.string()
  .url('Invalid URL format')
  .refine(url => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }, {
    message: 'URL must use HTTP or HTTPS protocol'
  });
