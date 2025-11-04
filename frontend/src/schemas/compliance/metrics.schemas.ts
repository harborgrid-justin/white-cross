import { z } from 'zod';
import { AuditActionType, AuditSeverity } from './audit.schemas';

/**
 * Compliance Metrics and Reporting Schemas
 * Validation schemas for compliance metrics and HIPAA reports
 */

// Compliance Metrics Schema
export const ComplianceMetricsSchema = z.object({
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  auditLogs: z.object({
    total: z.number().int().nonnegative(),
    byAction: z.record(AuditActionType, z.number().int().nonnegative()),
    bySeverity: z.record(AuditSeverity, z.number().int().nonnegative()),
    phiAccessCount: z.number().int().nonnegative(),
    failedActions: z.number().int().nonnegative(),
  }),
  violations: z.object({
    total: z.number().int().nonnegative(),
    open: z.number().int().nonnegative(),
    resolved: z.number().int().nonnegative(),
    bySeverity: z.record(z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']), z.number().int().nonnegative()),
  }),
  alerts: z.object({
    total: z.number().int().nonnegative(),
    active: z.number().int().nonnegative(),
    resolved: z.number().int().nonnegative(),
    bySeverity: z.record(z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']), z.number().int().nonnegative()),
  }),
  policies: z.object({
    total: z.number().int().nonnegative(),
    active: z.number().int().nonnegative(),
    acknowledged: z.number().int().nonnegative(),
    pending: z.number().int().nonnegative(),
    acknowledgmentRate: z.number().min(0).max(100),
  }),
  training: z.object({
    totalUsers: z.number().int().nonnegative(),
    completed: z.number().int().nonnegative(),
    overdue: z.number().int().nonnegative(),
    completionRate: z.number().min(0).max(100),
  }),
  dataRetention: z.object({
    recordsTotal: z.number().int().nonnegative(),
    recordsEligibleForArchival: z.number().int().nonnegative(),
    recordsEligibleForDeletion: z.number().int().nonnegative(),
    storageUsed: z.string(), // Human-readable (e.g., "150 GB")
  }),
  riskScore: z.number().min(0).max(100),
  complianceScore: z.number().min(0).max(100),
});

export type ComplianceMetrics = z.infer<typeof ComplianceMetricsSchema>;

// HIPAA Report Schema
export const HIPAAReportSchema = z.object({
  id: z.string().uuid(),
  reportType: z.enum([
    'SECURITY_RISK_ASSESSMENT',
    'BREACH_NOTIFICATION',
    'AUDIT_TRAIL',
    'ACCESS_CONTROL',
    'DATA_INTEGRITY',
    'TRAINING_COMPLIANCE',
    'INCIDENT_RESPONSE',
    'BUSINESS_ASSOCIATE',
  ]),
  period: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  generatedBy: z.string().uuid(),
  generatedAt: z.string().datetime(),
  status: z.enum(['DRAFT', 'FINALIZED', 'SUBMITTED']),
  metrics: ComplianceMetricsSchema,
  findings: z.array(z.object({
    category: z.string(),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    description: z.string(),
    recommendation: z.string(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']),
  })),
  recommendations: z.array(z.string()),
  attestations: z.array(z.object({
    statement: z.string(),
    attestedBy: z.string().uuid(),
    attestedAt: z.string().datetime(),
    signature: z.string().optional(),
  })).optional(),
});

export type HIPAAReport = z.infer<typeof HIPAAReportSchema>;
