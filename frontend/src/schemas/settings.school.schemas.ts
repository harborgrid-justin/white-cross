/**
 * @fileoverview School settings validation schemas
 * @module schemas/settings/school
 *
 * Zod validation schemas for school configuration, business hours, and emergency contacts.
 */

import { z } from 'zod';

// ==========================================
// BUSINESS HOURS SCHEMAS
// ==========================================

/**
 * Business hours schema
 */
export const businessHoursSchema = z.object({
  monday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  }),
  tuesday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  }),
  wednesday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  }),
  thursday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  }),
  friday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(false),
  }),
  saturday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(true),
  }),
  sunday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    closed: z.boolean().default(true),
  }),
});

export type BusinessHours = z.infer<typeof businessHoursSchema>;

// ==========================================
// EMERGENCY CONTACT SCHEMAS
// ==========================================

/**
 * Emergency contact schema
 */
export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  role: z.string().min(1, 'Role is required').max(50),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  email: z.string().email().optional(),
  availableAfterHours: z.boolean().default(false),
});

export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

// ==========================================
// SCHOOL SETTINGS SCHEMAS
// ==========================================

/**
 * School settings schema
 */
export const schoolSettingsSchema = z.object({
  name: z.string().min(1, 'School name is required').max(200),
  type: z.enum(['elementary', 'middle', 'high', 'k12', 'private', 'charter', 'other']).optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().length(2, 'State must be a 2-letter code'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
    country: z.string().length(2, 'Country must be a 2-letter code').default('US'),
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  fax: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid fax number').optional(),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL').optional(),
  logo: z.string().url('Invalid logo URL').optional(),
  hours: businessHoursSchema,
  emergencyContacts: z.array(emergencyContactSchema).min(1, 'At least one emergency contact is required'),
  studentCapacity: z.number().int().min(1).optional(),
  currentEnrollment: z.number().int().min(0).optional(),
  grades: z.array(z.string()).optional(), // e.g., ['K', '1', '2', ..., '12']
  metadata: z.record(z.string(), z.any()).optional(),
});

export type SchoolSettings = z.infer<typeof schoolSettingsSchema>;
