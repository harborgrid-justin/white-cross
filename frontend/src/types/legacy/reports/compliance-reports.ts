/**
 * WF-COMP-332 | compliance-reports.ts - Compliance report type definitions
 * Purpose: Type definitions for HIPAA, FERPA, and regulatory compliance tracking
 * Upstream: report-filters.ts, common.ts | Dependencies: DateRangeFilter, BaseEntity
 * Downstream: Compliance monitoring components | Called by: Compliance audit services
 * Related: medication-reports.ts, incident-reports.ts
 * Exports: Audit logs, compliance scores, violations, regulatory reporting
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Audit event → Log recording → Compliance scoring → Regulatory reporting
 * LLM Context: Healthcare compliance monitoring for HIPAA, FERPA, and safety regulations
 */

import type { BaseEntity } from '../common';
import type { DateRangeFilter } from './report-filters';

/**
 * Audit log entry for compliance
 */
export interface AuditLog extends BaseEntity {
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  complianceCategory?: string;
  riskLevel?: string;
}

/**
 * Medication compliance statistics
 */
export interface MedicationComplianceStats {
  isActive: boolean;
  count: number;
  percentage?: number;
}

/**
 * Incident compliance statistics
 */
export interface IncidentComplianceStats {
  legalComplianceStatus: string;
  count: number;
  percentage?: number;
}

/**
 * Compliance category score
 */
export interface ComplianceCategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
  issues?: string[];
  recommendations?: string[];
}

/**
 * Compliance violation
 */
export interface ComplianceViolation extends BaseEntity {
  type: string;
  severity: string;
  description: string;
  affectedEntity?: string;
  affectedEntityId?: string;
  detectedAt: Date | string;
  resolvedAt?: Date | string;
  resolution?: string;
  reportedBy?: string;
}

/**
 * Compliance report aggregate data
 */
export interface ComplianceReport {
  hipaaLogs: AuditLog[];
  medicationCompliance: MedicationComplianceStats[];
  incidentCompliance: IncidentComplianceStats[];
  vaccinationRecords: number;
  overallScore?: number;
  categoryScores?: ComplianceCategoryScore[];
  violations?: ComplianceViolation[];
  recommendations?: string[];
  reportPeriod?: DateRangeFilter;
  generatedAt?: Date | string;
}
