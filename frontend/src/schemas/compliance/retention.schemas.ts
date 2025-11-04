import { z } from 'zod';
import { ResourceType } from './audit.schemas';

/**
 * Data Retention Policy Schemas
 * Validation schemas for HIPAA-compliant data retention and archival
 */

// Data Retention Policy Schema
export const DataRetentionPolicySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string(),
  resourceType: ResourceType,
  retentionPeriod: z.object({
    value: z.number().int().positive(),
    unit: z.enum(['DAYS', 'MONTHS', 'YEARS']),
  }),
  archiveAfter: z.object({
    value: z.number().int().positive(),
    unit: z.enum(['DAYS', 'MONTHS', 'YEARS']),
  }).optional(),
  deleteAfter: z.object({
    value: z.number().int().positive(),
    unit: z.enum(['DAYS', 'MONTHS', 'YEARS']),
  }),
  legalHold: z.boolean().default(false),
  exceptions: z.array(z.object({
    condition: z.string(),
    extendedRetention: z.object({
      value: z.number().int().positive(),
      unit: z.enum(['DAYS', 'MONTHS', 'YEARS']),
    }),
  })).optional(),
  automatedProcessing: z.boolean().default(true),
  notifyBefore: z.object({
    value: z.number().int().positive(),
    unit: z.enum(['DAYS', 'WEEKS', 'MONTHS']),
  }).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']),
  createdBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type DataRetentionPolicy = z.infer<typeof DataRetentionPolicySchema>;
