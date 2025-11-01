/**
 * Health Record Zod schemas for form validation
 *
 * @module schemas/health-record
 * @description Zod schemas for health record management forms
 * HIPAA CRITICAL: All health records contain PHI
 */

import { z } from 'zod';
// import {
//   HealthRecordType
// } from '@/constants/healthRecords';

/**
 * Health record creation schema
 */
export const healthRecordCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  recordType: z.string().min(1, 'Record type is required'),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be less than 5000 characters'),
  recordDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid record date'),
  provider: z.string().max(255).optional(),
  providerNpi: z.string()
    .regex(/^\d{10}$/, 'NPI must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  facility: z.string().max(255).optional(),
  facilityNpi: z.string()
    .regex(/^\d{10}$/, 'Facility NPI must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  diagnosis: z.string().max(1000).optional(),
  diagnosisCode: z.string()
    .regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, 'Invalid ICD-10 code format (e.g., E11.65)')
    .optional()
    .or(z.literal('')),
  treatment: z.string().max(5000).optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid follow-up date'),
  followUpCompleted: z.boolean().default(false),
  isConfidential: z.boolean().default(false),
  notes: z.string().max(5000).optional(),
  attachments: z.array(z.string()).default([])
}).refine((data) => {
  if (data.followUpRequired && !data.followUpDate) {
    return false;
  }
  return true;
}, {
  message: 'Follow-up date is required when follow-up is needed',
  path: ['followUpDate']
});

export type HealthRecordCreateFormData = z.infer<typeof healthRecordCreateSchema>;

/**
 * Health record update schema
 */
export const healthRecordUpdateSchema = z.object({
  recordType: z.string().optional(),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .optional(),
  description: z.string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be less than 5000 characters')
    .optional(),
  recordDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid record date'),
  provider: z.string().max(255).optional(),
  providerNpi: z.string()
    .regex(/^\d{10}$/, 'NPI must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  facility: z.string().max(255).optional(),
  facilityNpi: z.string()
    .regex(/^\d{10}$/, 'Facility NPI must be exactly 10 digits')
    .optional()
    .or(z.literal('')),
  diagnosis: z.string().max(1000).optional(),
  diagnosisCode: z.string()
    .regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, 'Invalid ICD-10 code format')
    .optional()
    .or(z.literal('')),
  treatment: z.string().max(5000).optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid follow-up date'),
  followUpCompleted: z.boolean().optional(),
  isConfidential: z.boolean().optional(),
  notes: z.string().max(5000).optional(),
  attachments: z.array(z.string()).optional()
});

export type HealthRecordUpdateFormData = z.infer<typeof healthRecordUpdateSchema>;

/**
 * Medical condition creation schema
 */
export const medicalConditionCreateSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  condition: z.string()
    .min(1, 'Condition name is required')
    .max(255, 'Condition name must be less than 255 characters'),
  icdCode: z.string()
    .regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, 'Invalid ICD-10 code format (e.g., E11.65)')
    .optional()
    .or(z.literal('')),
  diagnosisDate: z.string().refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid diagnosis date'),
  diagnosedBy: z.string().max(255).optional(),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE', 'CRITICAL'], {
    message: 'Invalid severity level'
  }),
  status: z.enum(['ACTIVE', 'MANAGED', 'RESOLVED', 'MONITORING', 'INACTIVE'], {
    message: 'Invalid status'
  }),
  treatments: z.string().max(2000).optional(),
  accommodationsRequired: z.boolean().default(false),
  accommodationDetails: z.string().max(2000).optional(),
  emergencyProtocol: z.string().max(2000).optional(),
  actionPlan: z.string().max(5000).optional(),
  nextReviewDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid review date'),
  reviewFrequency: z.string().max(100).optional(),
  triggers: z.array(z.string()).default([]),
  notes: z.string().max(5000).optional(),
  carePlan: z.string().max(10000).optional()
}).refine((data) => {
  if (data.accommodationsRequired && !data.accommodationDetails) {
    return false;
  }
  return true;
}, {
  message: 'Accommodation details are required when accommodations are needed',
  path: ['accommodationDetails']
});

export type MedicalConditionCreateFormData = z.infer<typeof medicalConditionCreateSchema>;

/**
 * Medical condition update schema
 */
export const medicalConditionUpdateSchema = z.object({
  condition: z.string()
    .min(1, 'Condition name is required')
    .max(255, 'Condition name must be less than 255 characters')
    .optional(),
  icdCode: z.string()
    .regex(/^[A-Z]\d{2}(\.\d{1,4})?$/, 'Invalid ICD-10 code format')
    .optional()
    .or(z.literal('')),
  diagnosisDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid diagnosis date'),
  diagnosedBy: z.string().max(255).optional(),
  severity: z.enum(['MILD', 'MODERATE', 'SEVERE', 'CRITICAL']).optional(),
  status: z.enum(['ACTIVE', 'MANAGED', 'RESOLVED', 'MONITORING', 'INACTIVE']).optional(),
  treatments: z.string().max(2000).optional(),
  accommodationsRequired: z.boolean().optional(),
  accommodationDetails: z.string().max(2000).optional(),
  emergencyProtocol: z.string().max(2000).optional(),
  actionPlan: z.string().max(5000).optional(),
  nextReviewDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid review date'),
  reviewFrequency: z.string().max(100).optional(),
  triggers: z.array(z.string()).optional(),
  notes: z.string().max(5000).optional(),
  carePlan: z.string().max(10000).optional(),
  lastReviewDate: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid last review date')
});

export type MedicalConditionUpdateFormData = z.infer<typeof medicalConditionUpdateSchema>;

/**
 * Health record search/filter schema
 */
export const healthRecordSearchSchema = z.object({
  studentId: z.string().uuid().optional(),
  recordType: z.array(z.string()).optional(),
  dateFrom: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid from date'),
  dateTo: z.string().optional().refine((date) => {
    if (!date) return true;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, 'Invalid to date'),
  provider: z.string().optional(),
  isConfidential: z.boolean().optional(),
  followUpRequired: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['recordDate', 'title', 'provider', 'recordType']).default('recordDate'),
  sortDirection: z.enum(['asc', 'desc']).default('desc')
});

export type HealthRecordSearchFormData = z.infer<typeof healthRecordSearchSchema>;
