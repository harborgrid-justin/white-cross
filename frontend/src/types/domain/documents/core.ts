/**
 * Core Document Types Module
 * Main domain entity interfaces for the document management system
 * Dependencies: enums.ts, BaseEntity from core/common
 */

import { BaseEntity } from '../../core/common';
import { DocumentCategory, DocumentStatus, DocumentAccessLevel, DocumentAction } from './enums';

/**
 * Main Document Interface
 * Represents a document in the system with all metadata and relationships
 *
 * @aligned_with backend/src/database/models/documents/Document.ts
 *
 * PHI/PII Fields:
 * - studentId: Contains student identifier (PII)
 * - uploadedBy: Contains user identifier (PII)
 * - containsPHI: Indicates if document contains Protected Health Information
 * - All document content may contain PHI based on category
 */
export interface Document extends BaseEntity {
  // Basic Information
  title: string;
  description?: string;
  category: DocumentCategory;

  // File Information
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;

  // Version Control
  version: number;
  parentId?: string;
  parent?: Document;
  versions?: Document[];

  // Status and Access
  status: DocumentStatus;
  accessLevel: DocumentAccessLevel;

  // Metadata
  tags: string[];
  isTemplate: boolean;
  templateData?: Record<string, unknown>;
  retentionDate?: string;

  // Relationships
  uploadedBy: string;
  studentId?: string; // PII - Student identifier

  // HIPAA Compliance and Security (added from backend sync)
  containsPHI: boolean; // PHI - Protected Health Information flag
  requiresSignature: boolean; // Indicates if document requires electronic signature

  // Access Auditing (added from backend sync)
  lastAccessedAt?: string; // Timestamp of last access for audit trail
  accessCount: number; // Number of times document has been accessed (compliance tracking)

  // Associated Data
  signatures?: DocumentSignature[];
  auditTrail?: DocumentAuditTrail[];
}

/**
 * Document Signature Interface
 * Tracks digital signatures on documents requiring acknowledgment
 *
 * @aligned_with backend/src/database/models/documents/DocumentSignature.ts
 *
 * PHI/PII Fields:
 * - signedBy: User identifier who signed the document (PII)
 * - signatureData: Digital signature data (PII)
 * - ipAddress: IP address of signer (PII)
 */
export interface DocumentSignature {
  id: string;
  documentId: string;
  signedBy: string; // PII - User identifier
  signedByRole: string;
  signatureData?: string; // PII - Digital signature data
  signedAt: string;
  ipAddress?: string; // PII - IP address of signer
}

/**
 * Document Audit Trail Interface
 * Maintains comprehensive audit trail for HIPAA compliance
 *
 * @aligned_with backend/src/database/models/documents/DocumentAuditTrail.ts
 *
 * PHI/PII Fields:
 * - performedBy: User identifier who performed the action (PII)
 * - ipAddress: IP address of the user (PII)
 * - changes: May contain PHI depending on document category
 */
export interface DocumentAuditTrail {
  id: string;
  documentId: string;
  action: DocumentAction;
  performedBy: string; // PII - User identifier
  changes?: Record<string, unknown>; // May contain PHI
  ipAddress?: string; // PII - IP address
  createdAt: string;
}

/**
 * Document Template Interface
 * Defines reusable document templates with variables
 */
export interface DocumentTemplate extends BaseEntity {
  title: string;
  description?: string;
  category: DocumentCategory;
  fileType: string;
  fileName: string;
  templateData?: Record<string, unknown>;
  variables?: string[];
  isActive: boolean;
  accessLevel: DocumentAccessLevel;
  tags: string[];
}

/**
 * Document Version Interface
 * Represents a specific version of a document
 */
export interface DocumentVersion {
  id: string;
  parentId: string;
  version: number;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  changes?: string;
  status: DocumentStatus;
}

/**
 * Document Category Metadata
 * Provides additional information about each document category
 */
export interface DocumentCategoryMetadata {
  value: DocumentCategory;
  label: string;
  description: string;
  requiresSignature: boolean;
  retentionYears: number;
  documentCount?: number;
}

/**
 * Document Permission
 * Defines a user's permission to access a document
 */
export interface DocumentPermission {
  id: string;
  documentId: string;
  userId: string;
  permission: 'VIEW' | 'EDIT' | 'ADMIN';
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
}

/**
 * Document Metadata
 * Metadata for document management
 */
export interface DocumentMetadata {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  category: DocumentCategory;
  tags?: string[];
}

/**
 * Document List Response
 * Paginated list of documents
 */
export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
