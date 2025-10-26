/**
 * Admin Validation Schemas
 *
 * Validation schemas for administrative operations (users, schools, districts).
 */

import { z } from 'zod';
import { emailSchema } from '../common/email.schemas';
import { phoneSchema, optionalPhoneSchema } from '../common/phone.schemas';
import { addressSchema } from '../common/address.schemas';

/**
 * User roles
 */
export const USER_ROLES = [
  'admin',
  'school-admin',
  'nurse',
  'teacher',
  'staff',
  'parent',
  'student'
] as const;

/**
 * User status
 */
export const USER_STATUS = ['active', 'inactive', 'suspended', 'pending'] as const;

/**
 * Create user schema
 */
export const createUserSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .trim(),

  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .trim(),

  email: emailSchema,

  phone: optionalPhoneSchema,

  role: z.enum(USER_ROLES, {
    required_error: 'Role is required',
    invalid_type_error: 'Invalid role'
  }),

  schoolId: z
    .string()
    .uuid('Invalid school ID')
    .optional()
    .nullable(),

  districtId: z
    .string()
    .uuid('Invalid district ID')
    .optional()
    .nullable(),

  status: z
    .enum(USER_STATUS)
    .default('active')
    .optional(),

  permissions: z
    .array(z.string())
    .optional(),

  sendWelcomeEmail: z.boolean().default(true).optional(),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable()
});

/**
 * Update user schema
 */
export const updateUserSchema = createUserSchema
  .partial()
  .extend({
    id: z.string().uuid('Invalid user ID')
  });

/**
 * School types
 */
export const SCHOOL_TYPES = [
  'elementary',
  'middle',
  'high',
  'k-8',
  'k-12',
  'special-education',
  'charter',
  'private',
  'other'
] as const;

/**
 * Create school schema
 */
export const createSchoolSchema = z.object({
  name: z
    .string({ required_error: 'School name is required' })
    .min(1, 'School name is required')
    .max(200, 'School name must be less than 200 characters')
    .trim(),

  code: z
    .string()
    .max(50, 'School code must be less than 50 characters')
    .trim()
    .optional()
    .nullable(),

  type: z.enum(SCHOOL_TYPES, {
    required_error: 'School type is required',
    invalid_type_error: 'Invalid school type'
  }),

  districtId: z
    .string({ required_error: 'District is required' })
    .uuid('Invalid district ID'),

  principalName: z
    .string()
    .max(200, 'Principal name must be less than 200 characters')
    .optional()
    .nullable(),

  phone: phoneSchema,

  email: emailSchema,

  address: addressSchema,

  studentCapacity: z
    .number()
    .int()
    .min(0)
    .max(10000)
    .optional()
    .nullable(),

  currentEnrollment: z
    .number()
    .int()
    .min(0)
    .optional()
    .nullable(),

  isActive: z.boolean().default(true),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable()
});

/**
 * Update school schema
 */
export const updateSchoolSchema = createSchoolSchema
  .partial()
  .extend({
    id: z.string().uuid('Invalid school ID')
  });

/**
 * Create district schema
 */
export const createDistrictSchema = z.object({
  name: z
    .string({ required_error: 'District name is required' })
    .min(1, 'District name is required')
    .max(200, 'District name must be less than 200 characters')
    .trim(),

  code: z
    .string()
    .max(50, 'District code must be less than 50 characters')
    .trim()
    .optional()
    .nullable(),

  superintendentName: z
    .string()
    .max(200, 'Superintendent name must be less than 200 characters')
    .optional()
    .nullable(),

  phone: phoneSchema,

  email: emailSchema,

  address: addressSchema,

  website: z
    .string()
    .url('Invalid website URL')
    .optional()
    .nullable(),

  isActive: z.boolean().default(true),

  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable()
});

/**
 * Update district schema
 */
export const updateDistrictSchema = createDistrictSchema
  .partial()
  .extend({
    id: z.string().uuid('Invalid district ID')
  });

/**
 * Assign role schema
 */
export const assignRoleSchema = z.object({
  userId: z
    .string({ required_error: 'User is required' })
    .uuid('Invalid user ID'),

  role: z.enum(USER_ROLES, {
    required_error: 'Role is required'
  }),

  reason: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional()
    .nullable()
});

/**
 * Assign permissions schema
 */
export const assignPermissionsSchema = z.object({
  userId: z
    .string({ required_error: 'User is required' })
    .uuid('Invalid user ID'),

  permissions: z
    .array(z.string())
    .min(1, 'At least one permission is required'),

  reason: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional()
    .nullable()
});

/**
 * Type exports
 */
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type CreateSchool = z.infer<typeof createSchoolSchema>;
export type UpdateSchool = z.infer<typeof updateSchoolSchema>;
export type CreateDistrict = z.infer<typeof createDistrictSchema>;
export type UpdateDistrict = z.infer<typeof updateDistrictSchema>;
export type AssignRole = z.infer<typeof assignRoleSchema>;
export type AssignPermissions = z.infer<typeof assignPermissionsSchema>;
export type UserRole = typeof USER_ROLES[number];
export type UserStatus = typeof USER_STATUS[number];
export type SchoolType = typeof SCHOOL_TYPES[number];
