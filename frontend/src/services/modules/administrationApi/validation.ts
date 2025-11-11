/**
 * @fileoverview Validation schemas for administration and system management operations
 * 
 * This module provides comprehensive Zod validation schemas for all administration
 * operations including user management, district/school management, licensing,
 * training modules, and system configuration.
 * 
 * @module services/modules/administrationApi/validation
 */

import { z } from 'zod';

// ==================== USER VALIDATION SCHEMAS ====================

export const createUserSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name cannot exceed 100 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name cannot exceed 100 characters'),
  role: z.enum(['ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'COUNSELOR', 'VIEWER']),
  schoolId: z.string().uuid('Invalid school ID format').optional(),
  districtId: z.string().uuid('Invalid district ID format').optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });

// ==================== DISTRICT VALIDATION SCHEMAS ====================

export const createDistrictSchema = z.object({
  name: z.string()
    .min(2, 'District name must be at least 2 characters')
    .max(200, 'District name cannot exceed 200 characters'),
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
    .optional(),
  state: z.string()
    .length(2, 'State must be a 2-letter abbreviation')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase')
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
}).refine(data => data.phone || data.email || data.address, {
  message: 'District must have at least one form of contact information (phone, email, or address)',
  path: ['phone']
});

export const updateDistrictSchema = createDistrictSchema.partial();

// ==================== SCHOOL VALIDATION SCHEMAS ====================

export const createSchoolSchema = z.object({
  name: z.string()
    .min(2, 'School name must be at least 2 characters')
    .max(200, 'School name cannot exceed 200 characters'),
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
    .optional(),
  state: z.string()
    .length(2, 'State must be a 2-letter abbreviation')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase')
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
    .optional(),
  totalEnrollment: z.number()
    .min(0, 'Total enrollment cannot be negative')
    .max(50000, 'Total enrollment cannot exceed 50,000')
    .optional(),
}).refine(data => data.phone || data.email || data.address, {
  message: 'School must have at least one form of contact information (phone, email, or address)',
  path: ['phone']
});

export const updateSchoolSchema = createSchoolSchema.partial().omit({ districtId: true });

// ==================== LICENSE VALIDATION SCHEMAS ====================

export const createLicenseSchema = z.object({
  licenseKey: z.string()
    .min(10, 'License key must be at least 10 characters')
    .max(100, 'License key cannot exceed 100 characters')
    .regex(/^[A-Z0-9-]+$/, 'License key can only contain uppercase letters, numbers, and hyphens')
    .transform(val => val.toUpperCase()),
  type: z.enum(['TRIAL', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE']),
  maxUsers: z.number()
    .min(1, 'Maximum users must be at least 1')
    .max(100000, 'Maximum users cannot exceed 100,000')
    .optional(),
  maxSchools: z.number()
    .min(1, 'Maximum schools must be at least 1')
    .max(10000, 'Maximum schools cannot exceed 10,000')
    .optional(),
  features: z.array(z.string())
    .min(1, 'At least one feature must be specified'),
  issuedTo: z.string()
    .max(200, 'Issued to field cannot exceed 200 characters')
    .optional(),
  expiresAt: z.string().or(z.date()).optional(),
  districtId: z.string().uuid('Invalid district ID format').optional(),
  notes: z.string()
    .max(2000, 'Notes cannot exceed 2000 characters')
    .optional(),
}).refine(data => {
  if (data.type === 'TRIAL') {
    if (!data.maxUsers || data.maxUsers > 10) {
      return false;
    }
    if (!data.maxSchools || data.maxSchools > 2) {
      return false;
    }
    if (!data.expiresAt) {
      return false;
    }
  }
  return true;
}, {
  message: 'Trial license must have maxUsers (<=10), maxSchools (<=2), and expiration date',
  path: ['type']
}).refine(data => {
  if (data.type === 'BASIC') {
    if (data.maxUsers && data.maxUsers > 50) return false;
    if (data.maxSchools && data.maxSchools > 5) return false;
  }
  return true;
}, {
  message: 'Basic license cannot have more than 50 users or 5 schools',
  path: ['type']
}).refine(data => {
  if (data.type === 'PROFESSIONAL') {
    if (data.maxUsers && data.maxUsers > 500) return false;
    if (data.maxSchools && data.maxSchools > 50) return false;
  }
  return true;
}, {
  message: 'Professional license cannot have more than 500 users or 50 schools',
  path: ['type']
});

export const updateLicenseSchema = createLicenseSchema.partial();

// ==================== TRAINING MODULE VALIDATION SCHEMAS ====================

export const createTrainingModuleSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z.string()
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(50000, 'Content cannot exceed 50,000 characters'),
  duration: z.number()
    .min(1, 'Duration must be at least 1 minute')
    .max(600, 'Duration cannot exceed 600 minutes (10 hours)')
    .optional(),
  category: z.enum(['HIPAA_COMPLIANCE', 'MEDICATION_MANAGEMENT', 'EMERGENCY_PROCEDURES', 'SYSTEM_TRAINING', 'SAFETY_PROTOCOLS', 'DATA_SECURITY']),
  isRequired: z.boolean().optional(),
  order: z.number()
    .min(0, 'Order cannot be negative')
    .max(10000, 'Order cannot exceed 10,000')
    .optional(),
  attachments: z.array(z.string().max(500, 'Attachment URL cannot exceed 500 characters'))
    .max(20, 'Cannot have more than 20 attachments')
    .optional(),
});

export const updateTrainingModuleSchema = createTrainingModuleSchema.partial();

// ==================== CONFIGURATION VALIDATION SCHEMAS ====================

export const configurationSchema = z.object({
  key: z.string()
    .min(2, 'Configuration key must be at least 2 characters')
    .max(255, 'Configuration key cannot exceed 255 characters')
    .regex(/^[a-zA-Z][a-zA-Z0-9._-]*$/, 'Key must start with a letter and contain only letters, numbers, dots, hyphens, and underscores'),
  value: z.string()
    .min(1, 'Configuration value is required'),
  category: z.enum(['GENERAL', 'SECURITY', 'NOTIFICATION', 'INTEGRATION', 'BACKUP', 'PERFORMANCE', 'HEALTHCARE', 'MEDICATION', 'APPOINTMENTS', 'UI', 'QUERY', 'FILE_UPLOAD', 'RATE_LIMITING', 'SESSION', 'EMAIL', 'SMS']),
  valueType: z.enum(['STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'ARRAY', 'DATE', 'TIME', 'DATETIME', 'EMAIL', 'URL', 'COLOR', 'ENUM']).optional(),
  subCategory: z.string()
    .max(100, 'Sub-category cannot exceed 100 characters')
    .optional(),
  description: z.string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  isPublic: z.boolean().optional(),
  isEditable: z.boolean().optional(),
  requiresRestart: z.boolean().optional(),
  scope: z.enum(['SYSTEM', 'DISTRICT', 'SCHOOL', 'USER']).optional(),
  scopeId: z.string().uuid('Scope ID must be a valid UUID').optional(),
  tags: z.array(z.string()).optional(),
  sortOrder: z.number()
    .min(0, 'Sort order cannot be negative')
    .optional(),
});
