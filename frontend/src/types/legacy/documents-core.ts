/**
 * WF-COMP-323 | documents-core.ts - Core document type definitions
 * Purpose: Core domain types, enums, and interfaces for document management
 * Upstream: ./common | Dependencies: ./common
 * Downstream: documents-requests, documents-operations, documents-constants
 * Related: Document service, storage service
 * Exports: DocumentCategory, DocumentStatus, Document, DocumentSignature, etc.
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions for all document-related operations
 * LLM Context: Core type definitions for document management system
 */

/**
 * Core Document Types and Interfaces
 * Foundational type definitions for the Document Management module
 * Matches backend document service and models
 */

import { BaseEntity, BaseAuditEntity } from './common';

// ============================================================================
// Document Enums
// ============================================================================

/**
 * Document Category Enum
 * Defines all supported document categories in the healthcare system
 */
export enum DocumentCategory {
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  INCIDENT_REPORT = 'INCIDENT_REPORT',
  CONSENT_FORM = 'CONSENT_FORM',
  POLICY = 'POLICY',
  TRAINING = 'TRAINING',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  STUDENT_FILE = 'STUDENT_FILE',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER',
}

/**
 * Document Status Enum
 * Represents the lifecycle status of a document
 */
export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
  EXPIRED = 'EXPIRED',
}

/**
 * Document Access Level Enum
 * Controls who can access the document based on role and permissions
 */
export enum DocumentAccessLevel {
  PUBLIC = 'PUBLIC',
  STAFF_ONLY = 'STAFF_ONLY',
  ADMIN_ONLY = 'ADMIN_ONLY',
  RESTRICTED = 'RESTRICTED',
}

/**
 * Document Action Enum
 * All possible actions that can be performed on documents for audit trail
 */
export enum DocumentAction {
  CREATED = 'CREATED',
  VIEWED = 'VIEWED',
  DOWNLOADED = 'DOWNLOADED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  SHARED = 'SHARED',
  SIGNED = 'SIGNED',
}

/**
 * Template Field Type - Field types for document templates
 */
export enum TemplateFieldType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT',
}

/**
 * Template Status - Status of document templates
 */
export enum TemplateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Signature Type Enum
 * Types of signatures supported in the system
 */
export enum SignatureType {
  DIGITAL = 'DIGITAL',
  ELECTRONIC = 'ELECTRONIC',
  BIOMETRIC = 'BIOMETRIC',
  PIN = 'PIN',
  HAND_SIGNATURE = 'HAND_SIGNATURE',
}

/**
 * Signature Status - Status of a signature
 */
export enum SignatureStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

/**
 * Workflow Status - Status of a document workflow
 */
export enum WorkflowStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// ============================================================================
// Core Document Interfaces
// ============================================================================

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
 * Document with Relations
 * Document with all related data loaded
 */
export interface DocumentWithRelations extends Document {
  parent?: Document;
  versions: Document[];
  signatures: DocumentSignature[];
  auditTrail: DocumentAuditTrail[];
  uploadedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

/**
 * Signature - Individual signature record
 */
export interface Signature {
  id: string;
  documentId: string;
  userId: string;
  signatureData: string;
  signedAt: string;
  ipAddress?: string;
}

/**
 * Document Metadata - Metadata for document management
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
 * File Metadata - Basic file information
 */
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

/**
 * Document Retention Policy
 * Defines retention policy for document categories
 */
export interface DocumentRetentionPolicy {
  category: DocumentCategory;
  retentionYears: number;
  autoArchive: boolean;
  autoDelete: boolean;
  requiresApproval: boolean;
}

// ============================================================================
// Type Helpers and Utilities
// ============================================================================

/**
 * Document without relations
 * Document type without associations for simpler operations
 */
export type DocumentWithoutRelations = Omit<Document, 'parent' | 'versions' | 'signatures' | 'auditTrail'>;

/**
 * Partial Document Update
 * Partial type for document updates
 */
export type PartialDocumentUpdate = Partial<Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'uploadedBy'>>;

/**
 * Document Sort Field
 * Valid fields for sorting documents
 */
export type DocumentSortField = 'createdAt' | 'updatedAt' | 'title' | 'category' | 'status' | 'fileSize' | 'version';

/**
 * Document Sort Order
 * Valid sort orders
 */
export type DocumentSortOrder = 'ASC' | 'DESC';
