/**
 * Document Management Types and Interfaces
 * Centralized type definitions for document-related components
 */

export type DocumentType =
  | 'medical_record'
  | 'immunization_record'
  | 'medication_record'
  | 'incident_report'
  | 'emergency_contact'
  | 'consent_form'
  | 'allergy_record'
  | 'insurance_card'
  | 'iep_504'
  | 'health_plan'
  | 'prescription'
  | 'lab_result'
  | 'x_ray'
  | 'photo'
  | 'video'
  | 'other';

export type DocumentStatus =
  | 'active'
  | 'archived'
  | 'pending_review'
  | 'expired'
  | 'requires_update'
  | 'confidential';

export type AccessLevel =
  | 'public'
  | 'staff_only'
  | 'nurse_only'
  | 'admin_only'
  | 'restricted';

export type ViewMode = 'grid' | 'list' | 'table';

export interface Document {
  id: string;
  studentId?: string;
  studentName?: string;
  fileName: string;
  title: string;
  description?: string;
  documentType: DocumentType;
  mimeType: string;
  fileSize: number;
  status: DocumentStatus;
  accessLevel: AccessLevel;
  tags: string[];
  isStarred: boolean;
  isEncrypted: boolean;
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  expirationDate?: string;
  version: number;
  downloadCount: number;
  sharingEnabled: boolean;
  auditLog: Array<{
    action: string;
    user: string;
    timestamp: string;
  }>;
}

export interface DocumentStats {
  totalDocuments: number;
  activeDocuments: number;
  pendingReview: number;
  expiringSoon: number;
  confidentialDocs: number;
  storageUsed: number; // in MB
  documentsThisMonth: number;
  averageFileSize: number;
}

export interface DocumentsContentProps {
  initialDocuments?: Document[];
  userRole?: string;
}
