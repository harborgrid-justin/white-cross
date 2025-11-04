import { z } from 'zod';
import { ResourceType } from './audit.schemas';

/**
 * Compliance Violation and Alert Schemas
 * Validation schemas for detecting and managing compliance violations
 */

// Compliance Violation Schema
export const ComplianceViolationSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  violationType: z.enum([
    'UNAUTHORIZED_ACCESS',
    'EXCESSIVE_ACCESS',
    'POLICY_VIOLATION',
    'DATA_BREACH',
    'IMPROPER_DISPOSAL',
    'MISSING_ENCRYPTION',
    'WEAK_AUTHENTICATION',
    'MISSING_AUDIT_LOG',
    'RETENTION_VIOLATION',
    'DISCLOSURE_VIOLATION',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  userId: z.string().uuid().optional(),
  userName: z.string().optional(),
  description: z.string(),
  affectedRecords: z.array(z.object({
    resourceType: ResourceType,
    resourceId: z.string(),
    resourceName: z.string().optional(),
  })),
  detectedBy: z.enum(['AUTOMATED', 'MANUAL', 'EXTERNAL']),
  status: z.enum(['OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE']),
  assignedTo: z.string().uuid().optional(),
  resolution: z.string().optional(),
  resolvedAt: z.string().datetime().optional(),
  remediationSteps: z.array(z.string()).optional(),
  notificationsSent: z.array(z.object({
    recipient: z.string(),
    timestamp: z.string().datetime(),
    method: z.enum(['EMAIL', 'SMS', 'PUSH', 'IN_APP']),
  })).optional(),
});

export type ComplianceViolation = z.infer<typeof ComplianceViolationSchema>;

// Compliance Alert Schema
export const ComplianceAlertSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  alertType: z.enum([
    'SUSPICIOUS_ACTIVITY',
    'POLICY_EXPIRING',
    'TRAINING_OVERDUE',
    'EXCESSIVE_LOGIN_FAILURES',
    'UNUSUAL_ACCESS_PATTERN',
    'BULK_DATA_ACCESS',
    'OFF_HOURS_ACCESS',
    'MULTIPLE_LOCATION_ACCESS',
    'FAILED_ENCRYPTION',
    'BACKUP_FAILURE',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  title: z.string(),
  description: z.string(),
  userId: z.string().uuid().optional(),
  resourceType: ResourceType.optional(),
  resourceId: z.string().optional(),
  status: z.enum(['NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED', 'DISMISSED']),
  acknowledgedBy: z.string().uuid().optional(),
  acknowledgedAt: z.string().datetime().optional(),
  resolvedBy: z.string().uuid().optional(),
  resolvedAt: z.string().datetime().optional(),
  autoResolve: z.boolean().default(false),
  autoResolveAt: z.string().datetime().optional(),
});

export type ComplianceAlert = z.infer<typeof ComplianceAlertSchema>;
