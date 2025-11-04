/**
 * Compliance Domain Audit Type Definitions
 *
 * TypeScript interfaces for compliance audits and audit findings.
 * Supports HIPAA, HITECH, SOX, GDPR, and internal audit tracking
 * in the White Cross Healthcare Platform.
 *
 * @module hooks/domains/compliance/complianceAuditTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/index.html} HIPAA Compliance Guidelines
 */

/**
 * Compliance audit record for tracking HIPAA, HITECH, and internal audits.
 *
 * Represents a comprehensive audit of healthcare compliance requirements,
 * tracking audit execution, findings, remediation, and closure. Supports
 * multiple audit types and regulatory frameworks.
 *
 * @interface ComplianceAudit
 *
 * @property {string} id - Unique audit identifier
 * @property {string} title - Audit title or name
 * @property {string} description - Detailed audit description and objectives
 * @property {'HIPAA' | 'SOX' | 'GDPR' | 'HITECH' | 'INTERNAL'} type - Audit type and regulatory framework
 * @property {'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'} status - Current audit status
 * @property {Object} auditor - Auditor information
 * @property {string} auditor.id - Auditor user ID
 * @property {string} auditor.name - Auditor full name
 * @property {string} [auditor.organization] - External auditing organization (if applicable)
 * @property {string} startDate - Audit start date (ISO 8601)
 * @property {string} [endDate] - Audit completion date (ISO 8601)
 * @property {string[]} scope - Areas or systems covered by audit
 * @property {AuditFinding[]} findings - List of audit findings and issues
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const hipaaAudit: ComplianceAudit = {
 *   id: 'audit-001',
 *   title: 'Annual HIPAA Security Audit',
 *   description: 'Comprehensive review of HIPAA security controls',
 *   type: 'HIPAA',
 *   status: 'IN_PROGRESS',
 *   auditor: {
 *     id: 'auditor-123',
 *     name: 'Jane Smith',
 *     organization: 'Healthcare Compliance Partners'
 *   },
 *   startDate: '2025-10-01T00:00:00Z',
 *   scope: ['Electronic Health Records', 'Data Encryption', 'Access Controls'],
 *   findings: [],
 *   createdAt: '2025-10-01T09:00:00Z',
 *   updatedAt: '2025-10-26T14:30:00Z'
 * };
 * ```
 *
 * @see {@link AuditFinding} for finding details
 * @see {@link useAudits} for fetching audits
 * @see {@link useCreateAudit} for creating audits
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
 *
 * @interface AuditFinding
 *
 * @property {string} id - Unique finding identifier
 * @property {string} title - Finding title or summary
 * @property {string} description - Detailed finding description and evidence
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} severity - Finding severity level
 * @property {string} category - Finding category (e.g., 'Access Control', 'Data Encryption')
 * @property {'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ACCEPTED_RISK'} status - Current finding status
 * @property {string} [assignedTo] - User ID responsible for remediation
 * @property {string} [dueDate] - Remediation due date (ISO 8601)
 * @property {string} [resolution] - Description of how finding was resolved
 * @property {string} createdAt - Finding discovery timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const finding: AuditFinding = {
 *   id: 'finding-001',
 *   title: 'Weak Password Policy',
 *   description: 'Current password policy does not meet HIPAA requirements for minimum length',
 *   severity: 'HIGH',
 *   category: 'Access Control',
 *   status: 'IN_PROGRESS',
 *   assignedTo: 'user-456',
 *   dueDate: '2025-11-15T00:00:00Z',
 *   createdAt: '2025-10-15T10:00:00Z',
 *   updatedAt: '2025-10-20T14:30:00Z'
 * };
 * ```
 *
 * @remarks
 * **Severity Levels:**
 * - CRITICAL: Immediate data breach risk or regulatory violation
 * - HIGH: Significant compliance gap requiring urgent remediation
 * - MEDIUM: Important issue that should be addressed soon
 * - LOW: Minor gap or recommendation for improvement
 *
 * **Status Workflow:**
 * - OPEN: Finding identified, not yet assigned or worked
 * - IN_PROGRESS: Remediation actively underway
 * - RESOLVED: Issue fully remediated and verified
 * - ACCEPTED_RISK: Finding acknowledged but risk accepted (requires justification)
 *
 * @see {@link ComplianceAudit} for parent audit
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
