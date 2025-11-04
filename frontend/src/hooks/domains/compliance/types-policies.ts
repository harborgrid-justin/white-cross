/**
 * Policy-related types for compliance domain.
 *
 * @module hooks/domains/compliance/types-policies
 */

/**
 * Compliance policy document with version tracking and approval workflow.
 *
 * Represents organizational policies for privacy, security, clinical operations,
 * and administrative procedures. Supports version control, approval workflows,
 * and policy acknowledgment tracking for HIPAA compliance.
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

export interface PolicyAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
}
