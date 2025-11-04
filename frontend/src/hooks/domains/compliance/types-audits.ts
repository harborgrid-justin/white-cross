/**
 * Audit-related types for compliance domain.
 *
 * @module hooks/domains/compliance/types-audits
 */

/**
 * Compliance audit record for tracking HIPAA, HITECH, and internal audits.
 *
 * Represents a comprehensive audit of healthcare compliance requirements,
 * tracking audit execution, findings, remediation, and closure. Supports
 * multiple audit types and regulatory frameworks.
 */
export interface ComplianceAudit {
  id: string;
  title: string;
  description: string;
  type: 'HIPAA' | 'SOX' | 'GDPR' | 'HITECH' | 'INTERNAL';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  auditor: {
    id: string;
    name: string;
    organization?: string;
  };
  startDate: string;
  endDate?: string;
  scope: string[];
  findings: AuditFinding[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Individual finding discovered during a compliance audit.
 *
 * Represents a specific compliance gap, violation, or area of concern
 * identified during an audit. Tracks finding severity, status, assignment,
 * and resolution progress.
 */
export interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ACCEPTED_RISK';
  assignedTo?: string;
  dueDate?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}
