/**
 * Compliance Domain Policy Type Definitions
 *
 * TypeScript interfaces for compliance policies, policy attachments,
 * and policy management workflows in the White Cross Healthcare Platform.
 *
 * @module hooks/domains/compliance/compliancePolicyTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Compliance policy document with version tracking and approval workflow.
 *
 * Represents organizational policies for privacy, security, clinical operations,
 * and administrative procedures. Supports version control, approval workflows,
 * and policy acknowledgment tracking for HIPAA compliance.
 *
 * @interface CompliancePolicy
 *
 * @property {string} id - Unique policy identifier
 * @property {string} title - Policy title
 * @property {string} description - Policy summary and purpose
 * @property {'PRIVACY' | 'SECURITY' | 'OPERATIONAL' | 'CLINICAL' | 'ADMINISTRATIVE'} category - Policy category
 * @property {string} version - Policy version number (e.g., '1.0', '2.1')
 * @property {'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED'} status - Current policy status
 * @property {string} effectiveDate - Date policy becomes effective (ISO 8601)
 * @property {string} reviewDate - Next scheduled review date (ISO 8601)
 * @property {Object} [approver] - Policy approver information
 * @property {string} approver.id - Approver user ID
 * @property {string} approver.name - Approver full name
 * @property {string} content - Full policy content (markdown or HTML)
 * @property {PolicyAttachment[]} attachments - Supporting documents and attachments
 * @property {string[]} relatedPolicies - IDs of related policies
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const hipaaPolicy: CompliancePolicy = {
 *   id: 'policy-001',
 *   title: 'HIPAA Privacy Policy',
 *   description: 'Comprehensive policy for protecting patient health information',
 *   category: 'PRIVACY',
 *   version: '3.0',
 *   status: 'ACTIVE',
 *   effectiveDate: '2025-01-01T00:00:00Z',
 *   reviewDate: '2026-01-01T00:00:00Z',
 *   approver: { id: 'user-789', name: 'Dr. Sarah Johnson' },
 *   content: '# HIPAA Privacy Policy\n\n## Purpose\n...',
 *   attachments: [],
 *   relatedPolicies: ['policy-002', 'policy-003'],
 *   createdAt: '2024-11-01T09:00:00Z',
 *   updatedAt: '2025-01-01T08:00:00Z'
 * };
 * ```
 *
 * @remarks
 * **Status Workflow:**
 * - DRAFT: Policy being written, not yet ready for review
 * - UNDER_REVIEW: Policy submitted for stakeholder review
 * - APPROVED: Policy approved but not yet effective
 * - ACTIVE: Policy currently in effect
 * - ARCHIVED: Policy replaced by newer version or no longer applicable
 *
 * **Version Tracking:**
 * - Version numbers follow semantic versioning (major.minor)
 * - Each version change requires new approval workflow
 * - Historical versions retained for audit trail
 *
 * @see {@link PolicyAttachment} for attachment details
 * @see {@link usePolicies} for fetching policies
 * @see {@link useApprovePolicy} for policy approval
 */
export interface CompliancePolicy {
  id: string;
  title: string;
  description: string;
  category: 'PRIVACY' | 'SECURITY' | 'OPERATIONAL' | 'CLINICAL' | 'ADMINISTRATIVE';
  version: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED';
  effectiveDate: string;
  reviewDate: string;
  approver?: {
    id: string;
    name: string;
  };
  content: string;
  attachments: PolicyAttachment[];
  relatedPolicies: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Policy attachment metadata.
 *
 * @interface PolicyAttachment
 *
 * @property {string} id - Unique attachment identifier
 * @property {string} fileName - Original file name
 * @property {number} fileSize - File size in bytes
 * @property {string} mimeType - MIME type of the file
 * @property {string} uploadedAt - Upload timestamp (ISO 8601)
 * @property {string} uploadedBy - User ID who uploaded the file
 */
export interface PolicyAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
}
