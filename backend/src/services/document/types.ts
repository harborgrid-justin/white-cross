/**
 * LOC: D6A44FD802-T
 * WC-GEN-249 | types.ts - Document service type definitions
 *
 * UPSTREAM (imports from):
 *   - database/types/enums.ts
 *
 * DOWNSTREAM (imported by):
 *   - document service modules
 */

/**
 * WC-GEN-249 | types.ts - Document service type definitions
 * Purpose: Centralized type definitions for document service operations
 * Upstream: ../database/types/enums | Dependencies: None
 * Downstream: Document service modules | Called by: All document operations
 * Related: documentService.ts, Document model
 * Exports: interfaces | Key Services: Type safety
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Type checking → Runtime validation
 * LLM Context: Type definitions for enterprise document management with HIPAA compliance
 */

import { DocumentCategory, DocumentStatus, DocumentAccessLevel } from '../../database/types/enums';

/**
 * Interface for creating a new document
 */
export interface CreateDocumentData {
  title: string;
  description?: string;
  category: DocumentCategory;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  studentId?: string;
  tags?: string[];
  isTemplate?: boolean;
  templateData?: any;
  accessLevel?: DocumentAccessLevel;
}

/**
 * Interface for updating an existing document
 */
export interface UpdateDocumentData {
  title?: string;
  description?: string;
  status?: DocumentStatus;
  tags?: string[];
  retentionDate?: Date;
  accessLevel?: DocumentAccessLevel;
}

/**
 * Interface for document filters
 */
export interface DocumentFilters {
  category?: DocumentCategory;
  status?: DocumentStatus;
  studentId?: string;
  uploadedBy?: string;
  searchTerm?: string;
  tags?: string[];
}

/**
 * Interface for document signature data
 */
export interface SignDocumentData {
  documentId: string;
  signedBy: string;
  signedByRole: string;
  signatureData?: string;
  ipAddress?: string;
}

/**
 * Interface for creating document from template
 */
export interface CreateFromTemplateData {
  title: string;
  uploadedBy: string;
  studentId?: string;
  templateData?: any;
}

/**
 * Interface for pagination response
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Interface for document list response
 */
export interface DocumentListResponse {
  documents: any[];
  pagination: PaginationInfo;
}

/**
 * Interface for share document operation
 */
export interface ShareDocumentResult {
  success: boolean;
  sharedWith: string[];
}

/**
 * Interface for bulk delete result
 */
export interface BulkDeleteResult {
  deleted: number;
  notFound: number;
  success: boolean;
}

/**
 * Interface for document statistics
 */
export interface DocumentStatistics {
  total: number;
  byCategory: Array<{
    category: string;
    count: number;
  }>;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  totalSize: number;
  recentDocuments: number;
}

/**
 * Interface for document category metadata
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
 * Interface for document signature metadata
 */
export interface DocumentSignature {
  id: string;
  documentId: string;
  signerId: string;
  signerName: string;
  signedAt: Date;
  signatureType: 'DIGITAL' | 'ELECTRONIC' | 'WET';
  ipAddress?: string;
  verified: boolean;
}

/**
 * Interface for document audit trail
 */
export interface DocumentAuditTrail {
  id: string;
  documentId: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: Date;
  details?: Record<string, any>;
  ipAddress?: string;
}

/**
 * Type augmentation for Document model associations
 */
declare module '../../database/models' {
  interface Document {
    versions?: Document[];
    parent?: Document;
    signatures?: DocumentSignature[];
    auditTrail?: DocumentAuditTrail[];
  }
}
