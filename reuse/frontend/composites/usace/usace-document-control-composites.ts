/**
 * LOC: USACE-DOC-CTRL-001
 * File: /reuse/frontend/composites/usace/usace-document-control-composites.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/version-control-kit.ts
 *   - /reuse/frontend/media-management-kit.ts
 *   - /reuse/frontend/workflow-approval-kit.ts
 *   - /reuse/frontend/analytics-tracking-kit.ts
 *   - /reuse/frontend/search-filter-cms-kit.ts
 *   - /reuse/frontend/import-export-cms-kit.ts
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS document management systems
 *   - Version control applications
 *   - Approval workflow modules
 *   - Archive management systems
 */

/**
 * File: /reuse/frontend/composites/usace/usace-document-control-composites.ts
 * Locator: WC-USACE-DOC-001
 * Purpose: USACE CEFMS Document Control, Version Management & Archive System
 *
 * Upstream: React 18+, TypeScript 5.x, Next.js 16+, version-control-kit, workflow-approval-kit
 * Downstream: USACE document systems, Version control, Approvals, Archives
 * Dependencies: React 18+, TypeScript 5.x, Next.js 16+, date-fns
 * Exports: 46+ document control hooks, components, and utilities
 *
 * LLM Context: Enterprise-grade USACE CEFMS document control system for React 18+ applications.
 * Provides comprehensive document lifecycle management including version control, approval workflows,
 * metadata management, retention policies, and secure archiving. Designed for USACE engineering
 * documents, technical specifications, drawings, contracts, and records requiring strict
 * configuration management and federal records retention compliance.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  trackEvent,
  useTracking,
} from '../../analytics-tracking-kit';
import {
  useFormState,
  FormConfig,
} from '../../form-builder-kit';

// ============================================================================
// TYPE DEFINITIONS - DOCUMENT CONTROL
// ============================================================================

/**
 * Document types for USACE
 */
export type DocumentType =
  | 'engineering_drawing'
  | 'technical_specification'
  | 'contract_document'
  | 'environmental_assessment'
  | 'project_plan'
  | 'design_report'
  | 'quality_control_plan'
  | 'safety_plan'
  | 'cost_estimate'
  | 'schedule'
  | 'correspondence'
  | 'meeting_minutes'
  | 'submittal'
  | 'rfi' // Request for Information
  | 'change_order'
  | 'as_built'
  | 'operating_manual'
  | 'standard'
  | 'policy'
  | 'other';

/**
 * Document status
 */
export type DocumentStatus =
  | 'draft'
  | 'in_review'
  | 'pending_approval'
  | 'approved'
  | 'issued_for_construction'
  | 'issued_for_bid'
  | 'superseded'
  | 'obsolete'
  | 'archived'
  | 'cancelled';

/**
 * Security classification
 */
export type SecurityClassification =
  | 'unclassified'
  | 'controlled_unclassified_information' // CUI
  | 'for_official_use_only' // FOUO
  | 'confidential'
  | 'secret';

/**
 * Retention policy types
 */
export type RetentionPolicyType =
  | 'temporary_3_years'
  | 'temporary_6_years'
  | 'temporary_10_years'
  | 'permanent'
  | 'life_of_project'
  | 'custom';

/**
 * Document record
 */
export interface Document {
  id: string;
  documentNumber: string;
  title: string;
  documentType: DocumentType;
  status: DocumentStatus;
  version: string;
  revisionNumber: number;
  currentVersion: boolean;
  classification: SecurityClassification;
  author: DocumentAuthor;
  createdDate: Date;
  modifiedDate: Date;
  approvedDate?: Date;
  effectiveDate?: Date;
  expirationDate?: Date;
  supersededBy?: string;
  supersedes?: string[];
  relatedDocuments?: string[];
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
  checksum?: string;
  metadata: DocumentMetadata;
  versions: DocumentVersion[];
  approvals: DocumentApproval[];
  distribution: DocumentDistribution[];
  retention: RetentionPolicy;
  keywords?: string[];
  tags?: string[];
}

/**
 * Document author information
 */
export interface DocumentAuthor {
  userId: string;
  name: string;
  email: string;
  organization: string;
  discipline?: string;
}

/**
 * Document metadata
 */
export interface DocumentMetadata {
  projectNumber?: string;
  projectName?: string;
  contractNumber?: string;
  discipline?: string;
  drawingScale?: string;
  sheetSize?: string;
  cad_file?: string;
  specification_section?: string;
  submittal_number?: string;
  rfi_number?: string;
  custom?: Record<string, any>;
}

/**
 * Document version
 */
export interface DocumentVersion {
  id: string;
  versionNumber: string;
  revisionNumber: number;
  createdDate: Date;
  createdBy: string;
  changeDescription: string;
  changeType: 'major' | 'minor' | 'revision';
  fileUrl: string;
  fileSize: number;
  checksum: string;
  previousVersion?: string;
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

/**
 * Document approval
 */
export interface DocumentApproval {
  id: string;
  approverName: string;
  approverRole: string;
  approverEmail: string;
  approvalLevel: number;
  required: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'delegated';
  requestDate: Date;
  responseDate?: Date;
  comments?: string;
  signature?: string;
  delegatedTo?: string;
}

/**
 * Document distribution
 */
export interface DocumentDistribution {
  id: string;
  recipientName: string;
  recipientEmail: string;
  recipientOrg: string;
  distributionType: 'information' | 'review' | 'approval' | 'action';
  distributionDate: Date;
  acknowledged: boolean;
  acknowledgedDate?: Date;
  downloadCount: number;
}

/**
 * Retention policy
 */
export interface RetentionPolicy {
  policyType: RetentionPolicyType;
  retentionPeriod?: number; // in years
  retentionTrigger: 'creation_date' | 'approval_date' | 'project_completion' | 'superseded_date';
  dispositionAction: 'destroy' | 'archive' | 'transfer';
  legalHold: boolean;
  reviewDate?: Date;
  dispositionDate?: Date;
  dispositionAuthorization?: string;
}

/**
 * Document transmittal
 */
export interface DocumentTransmittal {
  id: string;
  transmittalNumber: string;
  date: Date;
  from: string;
  to: string;
  project: string;
  purpose: string;
  documents: DocumentTransmittalItem[];
  instructions?: string;
  dueDate?: Date;
  signature?: string;
  received: boolean;
  receivedDate?: Date;
  receivedBy?: string;
}

/**
 * Document transmittal item
 */
export interface DocumentTransmittalItem {
  documentId: string;
  documentNumber: string;
  title: string;
  revision: string;
  copies: number;
  action: 'review' | 'approval' | 'information' | 'as_noted';
}

/**
 * Document review comment
 */
export interface DocumentReviewComment {
  id: string;
  documentId: string;
  versionId: string;
  commentNumber: number;
  reviewer: string;
  reviewerOrg: string;
  date: Date;
  page?: number;
  section?: string;
  comment: string;
  category: 'general' | 'technical' | 'editorial' | 'compliance';
  priority: 'critical' | 'major' | 'minor';
  status: 'open' | 'addressed' | 'closed' | 'deferred';
  response?: string;
  respondedBy?: string;
  responseDate?: Date;
}

/**
 * Document control register
 */
export interface DocumentControlRegister {
  registerId: string;
  registerName: string;
  registerType: 'master_list' | 'drawing_list' | 'specification_list' | 'submittal_log' | 'rfi_log';
  projectNumber: string;
  documents: Document[];
  lastUpdated: Date;
  updatedBy: string;
  version: number;
}

/**
 * Archive record
 */
export interface ArchiveRecord {
  id: string;
  archiveBox: string;
  archiveLocation: string;
  archivedDate: Date;
  archivedBy: string;
  documents: string[];
  retrievable: boolean;
  digitalCopy: boolean;
  dispositionDate?: Date;
  notes?: string;
}

// ============================================================================
// DOCUMENT LIFECYCLE MANAGEMENT
// ============================================================================

/**
 * Hook for document management
 *
 * @description Manages complete document lifecycle
 * @returns {object} Document management functions
 *
 * @example
 * ```tsx
 * const {
 *   documents,
 *   createDocument,
 *   updateDocument,
 *   searchDocuments,
 *   getDocumentsByType
 * } = useDocumentManagement();
 * ```
 */
export function useDocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const { track } = useTracking();

  const createDocument = useCallback(
    (document: Document) => {
      setDocuments((prev) => [...prev, document]);
      track('document_created', {
        document_id: document.id,
        document_type: document.documentType,
        classification: document.classification,
      });
    },
    [track]
  );

  const updateDocument = useCallback(
    (documentId: string, updates: Partial<Document>) => {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === documentId ? { ...doc, ...updates } : doc))
      );
      track('document_updated', { document_id: documentId });
    },
    [track]
  );

  const deleteDocument = useCallback(
    (documentId: string) => {
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      track('document_deleted', { document_id: documentId });
    },
    [track]
  );

  const searchDocuments = useCallback(
    (query: string) => {
      return documents.filter(
        (doc) =>
          doc.documentNumber.toLowerCase().includes(query.toLowerCase()) ||
          doc.title.toLowerCase().includes(query.toLowerCase()) ||
          doc.keywords?.some((k) => k.toLowerCase().includes(query.toLowerCase()))
      );
    },
    [documents]
  );

  const getDocumentsByType = useCallback(
    (documentType: DocumentType) => {
      return documents.filter((doc) => doc.documentType === documentType);
    },
    [documents]
  );

  const getDocumentsByStatus = useCallback(
    (status: DocumentStatus) => {
      return documents.filter((doc) => doc.status === status);
    },
    [documents]
  );

  const getCurrentVersions = useCallback(() => {
    return documents.filter((doc) => doc.currentVersion);
  }, [documents]);

  return {
    documents,
    loading,
    createDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    getDocumentsByType,
    getDocumentsByStatus,
    getCurrentVersions,
  };
}

/**
 * Hook for version control
 *
 * @description Manages document versions and revisions
 * @param {string} documentId - Document identifier
 * @returns {object} Version control functions
 *
 * @example
 * ```tsx
 * const {
 *   versions,
 *   createVersion,
 *   compareVersions,
 *   rollbackToVersion
 * } = useVersionControl('DOC-001');
 * ```
 */
export function useVersionControl(documentId: string) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const { track } = useTracking();

  const createVersion = useCallback(
    (version: DocumentVersion) => {
      setVersions((prev) => [version, ...prev]);
      track('document_version_created', {
        document_id: documentId,
        version: version.versionNumber,
        change_type: version.changeType,
      });
    },
    [documentId, track]
  );

  const approveVersion = useCallback(
    (versionId: string, approvedBy: string) => {
      setVersions((prev) =>
        prev.map((v) =>
          v.id === versionId
            ? {
                ...v,
                approved: true,
                approvedBy,
                approvalDate: new Date(),
              }
            : v
        )
      );
      track('document_version_approved', { version_id: versionId });
    },
    [track]
  );

  const compareVersions = useCallback(
    (version1Id: string, version2Id: string) => {
      const v1 = versions.find((v) => v.id === version1Id);
      const v2 = versions.find((v) => v.id === version2Id);

      if (!v1 || !v2) return null;

      return {
        version1: v1,
        version2: v2,
        differences: {
          revisionDiff: v2.revisionNumber - v1.revisionNumber,
          timeDiff: v2.createdDate.getTime() - v1.createdDate.getTime(),
          sizeDiff: v2.fileSize - v1.fileSize,
        },
      };
    },
    [versions]
  );

  const getLatestVersion = useCallback(() => {
    if (versions.length === 0) return null;
    return versions.reduce((latest, current) =>
      current.revisionNumber > latest.revisionNumber ? current : latest
    );
  }, [versions]);

  const getApprovedVersions = useCallback(() => {
    return versions.filter((v) => v.approved);
  }, [versions]);

  const rollbackToVersion = useCallback(
    (versionId: string) => {
      const targetVersion = versions.find((v) => v.id === versionId);
      if (targetVersion) {
        track('document_version_rollback', {
          document_id: documentId,
          target_version: targetVersion.versionNumber,
        });
        return targetVersion;
      }
      return null;
    },
    [versions, documentId, track]
  );

  return {
    versions,
    createVersion,
    approveVersion,
    compareVersions,
    getLatestVersion,
    getApprovedVersions,
    rollbackToVersion,
  };
}

/**
 * Hook for document approvals
 *
 * @description Manages document approval workflow
 * @param {string} documentId - Document identifier
 * @returns {object} Approval management functions
 *
 * @example
 * ```tsx
 * const {
 *   approvals,
 *   requestApproval,
 *   approveDocument,
 *   rejectDocument,
 *   getPendingApprovals
 * } = useDocumentApprovals('DOC-001');
 * ```
 */
export function useDocumentApprovals(documentId: string) {
  const [approvals, setApprovals] = useState<DocumentApproval[]>([]);
  const { track } = useTracking();

  const requestApproval = useCallback(
    (approval: DocumentApproval) => {
      setApprovals((prev) => [...prev, approval]);
      track('approval_requested', {
        document_id: documentId,
        approver: approval.approverName,
        level: approval.approvalLevel,
      });
    },
    [documentId, track]
  );

  const approveDocument = useCallback(
    (approvalId: string, comments?: string, signature?: string) => {
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                status: 'approved',
                responseDate: new Date(),
                comments,
                signature,
              }
            : a
        )
      );
      track('document_approved', { approval_id: approvalId, document_id: documentId });
    },
    [documentId, track]
  );

  const rejectDocument = useCallback(
    (approvalId: string, comments: string) => {
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                status: 'rejected',
                responseDate: new Date(),
                comments,
              }
            : a
        )
      );
      track('document_rejected', { approval_id: approvalId, document_id: documentId });
    },
    [documentId, track]
  );

  const delegateApproval = useCallback(
    (approvalId: string, delegatedTo: string) => {
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId
            ? {
                ...a,
                status: 'delegated',
                delegatedTo,
                responseDate: new Date(),
              }
            : a
        )
      );
      track('approval_delegated', { approval_id: approvalId, delegated_to: delegatedTo });
    },
    [track]
  );

  const getPendingApprovals = useCallback(() => {
    return approvals.filter((a) => a.status === 'pending');
  }, [approvals]);

  const isFullyApproved = useCallback(() => {
    const requiredApprovals = approvals.filter((a) => a.required);
    return requiredApprovals.every((a) => a.status === 'approved');
  }, [approvals]);

  return {
    approvals,
    requestApproval,
    approveDocument,
    rejectDocument,
    delegateApproval,
    getPendingApprovals,
    isFullyApproved,
  };
}

/**
 * Hook for document distribution
 *
 * @description Manages document distribution and tracking
 * @param {string} documentId - Document identifier
 * @returns {object} Distribution management functions
 *
 * @example
 * ```tsx
 * const {
 *   distributions,
 *   distributeDocument,
 *   acknowledgeReceipt,
 *   getUnacknowledged
 * } = useDocumentDistribution('DOC-001');
 * ```
 */
export function useDocumentDistribution(documentId: string) {
  const [distributions, setDistributions] = useState<DocumentDistribution[]>([]);
  const { track } = useTracking();

  const distributeDocument = useCallback(
    (distribution: DocumentDistribution) => {
      setDistributions((prev) => [...prev, distribution]);
      track('document_distributed', {
        document_id: documentId,
        recipient: distribution.recipientEmail,
        type: distribution.distributionType,
      });
    },
    [documentId, track]
  );

  const acknowledgeReceipt = useCallback(
    (distributionId: string) => {
      setDistributions((prev) =>
        prev.map((d) =>
          d.id === distributionId
            ? {
                ...d,
                acknowledged: true,
                acknowledgedDate: new Date(),
              }
            : d
        )
      );
      track('document_acknowledged', { distribution_id: distributionId });
    },
    [track]
  );

  const trackDownload = useCallback(
    (distributionId: string) => {
      setDistributions((prev) =>
        prev.map((d) =>
          d.id === distributionId
            ? { ...d, downloadCount: d.downloadCount + 1 }
            : d
        )
      );
    },
    []
  );

  const getUnacknowledged = useCallback(() => {
    return distributions.filter((d) => !d.acknowledged);
  }, [distributions]);

  const getDistributionStats = useCallback(() => {
    return {
      total: distributions.length,
      acknowledged: distributions.filter((d) => d.acknowledged).length,
      unacknowledged: distributions.filter((d) => !d.acknowledged).length,
      totalDownloads: distributions.reduce((sum, d) => sum + d.downloadCount, 0),
    };
  }, [distributions]);

  return {
    distributions,
    distributeDocument,
    acknowledgeReceipt,
    trackDownload,
    getUnacknowledged,
    getDistributionStats,
  };
}

/**
 * Hook for document review and comments
 *
 * @description Manages document review process and comments
 * @param {string} documentId - Document identifier
 * @returns {object} Review management functions
 *
 * @example
 * ```tsx
 * const {
 *   comments,
 *   addComment,
 *   respondToComment,
 *   closeComment,
 *   getOpenComments
 * } = useDocumentReview('DOC-001');
 * ```
 */
export function useDocumentReview(documentId: string) {
  const [comments, setComments] = useState<DocumentReviewComment[]>([]);
  const { track } = useTracking();

  const addComment = useCallback(
    (comment: DocumentReviewComment) => {
      setComments((prev) => [...prev, comment]);
      track('review_comment_added', {
        document_id: documentId,
        priority: comment.priority,
        category: comment.category,
      });
    },
    [documentId, track]
  );

  const respondToComment = useCallback(
    (commentId: string, response: string, respondedBy: string) => {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                response,
                respondedBy,
                responseDate: new Date(),
                status: 'addressed',
              }
            : c
        )
      );
      track('comment_responded', { comment_id: commentId });
    },
    [track]
  );

  const closeComment = useCallback(
    (commentId: string) => {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, status: 'closed' } : c))
      );
      track('comment_closed', { comment_id: commentId });
    },
    [track]
  );

  const getOpenComments = useCallback(() => {
    return comments.filter((c) => c.status === 'open');
  }, [comments]);

  const getCriticalComments = useCallback(() => {
    return comments.filter((c) => c.priority === 'critical' && c.status === 'open');
  }, [comments]);

  const getCommentsByCategory = useCallback(
    (category: DocumentReviewComment['category']) => {
      return comments.filter((c) => c.category === category);
    },
    [comments]
  );

  return {
    comments,
    addComment,
    respondToComment,
    closeComment,
    getOpenComments,
    getCriticalComments,
    getCommentsByCategory,
  };
}

/**
 * Hook for document retention management
 *
 * @description Manages retention policies and archiving
 * @returns {object} Retention management functions
 *
 * @example
 * ```tsx
 * const {
 *   archives,
 *   archiveDocument,
 *   checkRetentionStatus,
 *   getDocumentsDueForDisposition
 * } = useRetentionManagement();
 * ```
 */
export function useRetentionManagement() {
  const [archives, setArchives] = useState<ArchiveRecord[]>([]);
  const { track } = useTracking();

  const archiveDocument = useCallback(
    (archive: ArchiveRecord) => {
      setArchives((prev) => [...prev, archive]);
      track('document_archived', {
        archive_box: archive.archiveBox,
        document_count: archive.documents.length,
      });
    },
    [track]
  );

  const checkRetentionStatus = useCallback((document: Document) => {
    const { retention } = document;
    let triggerDate: Date;

    switch (retention.retentionTrigger) {
      case 'creation_date':
        triggerDate = document.createdDate;
        break;
      case 'approval_date':
        triggerDate = document.approvedDate || document.createdDate;
        break;
      case 'superseded_date':
        triggerDate = document.modifiedDate;
        break;
      default:
        triggerDate = document.createdDate;
    }

    const retentionYears = retention.retentionPeriod || 10;
    const dispositionDate = new Date(triggerDate);
    dispositionDate.setFullYear(dispositionDate.getFullYear() + retentionYears);

    const today = new Date();
    const daysUntilDisposition = Math.ceil(
      (dispositionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      triggerDate,
      dispositionDate,
      daysUntilDisposition,
      isEligibleForDisposition: daysUntilDisposition <= 0 && !retention.legalHold,
      onLegalHold: retention.legalHold,
    };
  }, []);

  const getDocumentsDueForDisposition = useCallback(
    (documents: Document[], daysAhead: number = 90) => {
      return documents.filter((doc) => {
        const status = checkRetentionStatus(doc);
        return (
          status.daysUntilDisposition <= daysAhead &&
          status.daysUntilDisposition > 0 &&
          !status.onLegalHold
        );
      });
    },
    [checkRetentionStatus]
  );

  const retrieveFromArchive = useCallback(
    (archiveId: string) => {
      const archive = archives.find((a) => a.id === archiveId);
      if (archive && archive.retrievable) {
        track('document_retrieved_from_archive', { archive_id: archiveId });
        return archive;
      }
      return null;
    },
    [archives, track]
  );

  return {
    archives,
    archiveDocument,
    checkRetentionStatus,
    getDocumentsDueForDisposition,
    retrieveFromArchive,
  };
}

/**
 * Hook for document transmittals
 *
 * @description Manages document transmittal process
 * @returns {object} Transmittal management functions
 *
 * @example
 * ```tsx
 * const {
 *   transmittals,
 *   createTransmittal,
 *   acknowledgeTransmittal,
 *   getPendingTransmittals
 * } = useDocumentTransmittal();
 * ```
 */
export function useDocumentTransmittal() {
  const [transmittals, setTransmittals] = useState<DocumentTransmittal[]>([]);
  const { track } = useTracking();

  const createTransmittal = useCallback(
    (transmittal: DocumentTransmittal) => {
      setTransmittals((prev) => [...prev, transmittal]);
      track('transmittal_created', {
        transmittal_number: transmittal.transmittalNumber,
        document_count: transmittal.documents.length,
      });
    },
    [track]
  );

  const acknowledgeTransmittal = useCallback(
    (transmittalId: string, receivedBy: string) => {
      setTransmittals((prev) =>
        prev.map((t) =>
          t.id === transmittalId
            ? {
                ...t,
                received: true,
                receivedDate: new Date(),
                receivedBy,
              }
            : t
        )
      );
      track('transmittal_acknowledged', { transmittal_id: transmittalId });
    },
    [track]
  );

  const getPendingTransmittals = useCallback(() => {
    return transmittals.filter((t) => !t.received);
  }, [transmittals]);

  const getOverdueTransmittals = useCallback(() => {
    const now = new Date();
    return transmittals.filter((t) => !t.received && t.dueDate && t.dueDate < now);
  }, [transmittals]);

  return {
    transmittals,
    createTransmittal,
    acknowledgeTransmittal,
    getPendingTransmittals,
    getOverdueTransmittals,
  };
}

/**
 * Generate document metadata form
 *
 * @description Creates form for document metadata entry
 * @param {DocumentType} documentType - Type of document
 * @returns {FormConfig} Form configuration
 *
 * @example
 * ```tsx
 * const formConfig = generateDocumentMetadataForm('engineering_drawing');
 * <FormRenderer formConfig={formConfig} />
 * ```
 */
export function generateDocumentMetadataForm(documentType: DocumentType): FormConfig {
  const baseFields: any[] = [
    {
      id: 'documentNumber',
      name: 'documentNumber',
      type: 'text',
      label: 'Document Number',
      required: true,
    },
    {
      id: 'title',
      name: 'title',
      type: 'text',
      label: 'Document Title',
      required: true,
    },
    {
      id: 'classification',
      name: 'classification',
      type: 'select',
      label: 'Security Classification',
      required: true,
      options: [
        { label: 'Unclassified', value: 'unclassified' },
        { label: 'CUI', value: 'controlled_unclassified_information' },
        { label: 'FOUO', value: 'for_official_use_only' },
      ],
    },
  ];

  // Add type-specific fields
  if (documentType === 'engineering_drawing') {
    baseFields.push(
      {
        id: 'drawingScale',
        name: 'drawingScale',
        type: 'text',
        label: 'Drawing Scale',
      },
      {
        id: 'sheetSize',
        name: 'sheetSize',
        type: 'select',
        label: 'Sheet Size',
        options: [
          { label: 'A (8.5" x 11")', value: 'A' },
          { label: 'B (11" x 17")', value: 'B' },
          { label: 'C (17" x 22")', value: 'C' },
          { label: 'D (22" x 34")', value: 'D' },
          { label: 'E (34" x 44")', value: 'E' },
        ],
      }
    );
  }

  return {
    id: `document-metadata-${documentType}`,
    title: 'Document Metadata',
    description: 'Enter document metadata information',
    fields: baseFields,
  };
}

/**
 * Generate document number
 *
 * @description Generates standardized document number
 * @param {string} projectNumber - Project number
 * @param {DocumentType} documentType - Document type
 * @param {number} sequence - Sequence number
 * @returns {string} Generated document number
 *
 * @example
 * ```tsx
 * const docNumber = generateDocumentNumber('P1234', 'engineering_drawing', 1);
 * // Returns: "P1234-DWG-0001"
 * ```
 */
export function generateDocumentNumber(
  projectNumber: string,
  documentType: DocumentType,
  sequence: number
): string {
  const typePrefix: Record<DocumentType, string> = {
    engineering_drawing: 'DWG',
    technical_specification: 'SPEC',
    contract_document: 'CONT',
    environmental_assessment: 'ENV',
    project_plan: 'PLAN',
    design_report: 'RPT',
    quality_control_plan: 'QC',
    safety_plan: 'SAFE',
    cost_estimate: 'EST',
    schedule: 'SCH',
    correspondence: 'CORR',
    meeting_minutes: 'MIN',
    submittal: 'SUB',
    rfi: 'RFI',
    change_order: 'CO',
    as_built: 'ASBT',
    operating_manual: 'OM',
    standard: 'STD',
    policy: 'POL',
    other: 'DOC',
  };

  const prefix = typePrefix[documentType];
  const paddedSequence = sequence.toString().padStart(4, '0');

  return `${projectNumber}-${prefix}-${paddedSequence}`;
}

/**
 * Validate document metadata completeness
 *
 * @description Checks if all required metadata is present
 * @param {Document} document - Document to validate
 * @returns {object} Validation results
 *
 * @example
 * ```tsx
 * const validation = validateDocumentMetadata(document);
 * if (!validation.isValid) {
 *   console.log('Missing fields:', validation.missingFields);
 * }
 * ```
 */
export function validateDocumentMetadata(document: Document) {
  const requiredFields = ['documentNumber', 'title', 'documentType', 'author'];
  const missingFields: string[] = [];

  if (!document.documentNumber) missingFields.push('documentNumber');
  if (!document.title) missingFields.push('title');
  if (!document.documentType) missingFields.push('documentType');
  if (!document.author) missingFields.push('author');

  // Type-specific validation
  if (document.documentType === 'engineering_drawing') {
    if (!document.metadata.drawingScale) missingFields.push('drawingScale');
    if (!document.metadata.sheetSize) missingFields.push('sheetSize');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    completeness: Math.round(
      ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
    ),
  };
}

/**
 * Calculate version increment
 *
 * @description Determines next version number based on change type
 * @param {string} currentVersion - Current version (e.g., "1.2.3")
 * @param {string} changeType - Type of change
 * @returns {string} Next version number
 *
 * @example
 * ```tsx
 * const nextVersion = calculateVersionIncrement('1.2.3', 'minor');
 * // Returns: "1.3.0"
 * ```
 */
export function calculateVersionIncrement(
  currentVersion: string,
  changeType: 'major' | 'minor' | 'revision'
): string {
  const parts = currentVersion.split('.').map(Number);
  const [major, minor, patch] = parts;

  switch (changeType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'revision':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

/**
 * Export document register
 *
 * @description Exports document control register to CSV
 * @param {DocumentControlRegister} register - Register to export
 * @returns {string} CSV formatted data
 *
 * @example
 * ```tsx
 * const csv = exportDocumentRegister(register);
 * downloadFile('document-register.csv', csv);
 * ```
 */
export function exportDocumentRegister(register: DocumentControlRegister): string {
  const headers = [
    'Doc Number',
    'Title',
    'Type',
    'Status',
    'Version',
    'Author',
    'Date',
  ];

  const rows = register.documents.map((doc) => [
    doc.documentNumber,
    doc.title,
    doc.documentType,
    doc.status,
    doc.version,
    doc.author.name,
    doc.createdDate.toLocaleDateString(),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Check document supersession chain
 *
 * @description Validates document supersession relationships
 * @param {Document} document - Document to check
 * @param {Document[]} allDocuments - All documents
 * @returns {object} Supersession chain information
 *
 * @example
 * ```tsx
 * const chain = checkSupersessionChain(document, allDocuments);
 * console.log('Latest document:', chain.latestDocument);
 * ```
 */
export function checkSupersessionChain(
  document: Document,
  allDocuments: Document[]
) {
  const chain: Document[] = [document];
  let current = document;

  // Follow chain forward
  while (current.supersededBy) {
    const next = allDocuments.find((d) => d.id === current.supersededBy);
    if (!next) break;
    chain.push(next);
    current = next;
  }

  // Follow chain backward
  current = document;
  while (current.supersedes && current.supersedes.length > 0) {
    const prev = allDocuments.find((d) => d.id === current.supersedes![0]);
    if (!prev) break;
    chain.unshift(prev);
    current = prev;
  }

  return {
    chain,
    chainLength: chain.length,
    latestDocument: chain[chain.length - 1],
    originalDocument: chain[0],
    isCurrent: document.id === chain[chain.length - 1].id,
  };
}

/**
 * Generate transmittal cover sheet
 *
 * @description Creates formatted transmittal cover sheet
 * @param {DocumentTransmittal} transmittal - Transmittal to format
 * @returns {string} Formatted cover sheet
 *
 * @example
 * ```tsx
 * const coverSheet = generateTransmittalCoverSheet(transmittal);
 * printDocument(coverSheet);
 * ```
 */
export function generateTransmittalCoverSheet(
  transmittal: DocumentTransmittal
): string {
  return `
DOCUMENT TRANSMITTAL
====================

Transmittal Number: ${transmittal.transmittalNumber}
Date: ${transmittal.date.toLocaleDateString()}

FROM: ${transmittal.from}
TO: ${transmittal.to}

Project: ${transmittal.project}
Purpose: ${transmittal.purpose}

DOCUMENTS TRANSMITTED:
${transmittal.documents
  .map(
    (doc, index) =>
      `${index + 1}. ${doc.documentNumber} Rev ${doc.revision} - ${doc.title}
   Copies: ${doc.copies} | Action: ${doc.action}`
  )
  .join('\n')}

${transmittal.instructions ? `\nINSTRUCTIONS:\n${transmittal.instructions}` : ''}

${transmittal.dueDate ? `\nDUE DATE: ${transmittal.dueDate.toLocaleDateString()}` : ''}

Signature: ______________________ Date: __________
  `.trim();
}

/**
 * Calculate document lifecycle status
 *
 * @description Determines overall document lifecycle status
 * @param {Document} document - Document to analyze
 * @returns {object} Lifecycle status information
 */
export function calculateDocumentLifecycle(document: Document) {
  const daysSinceCreation = Math.floor(
    (new Date().getTime() - document.createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysSinceModification = Math.floor(
    (new Date().getTime() - document.modifiedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isStale = daysSinceModification > 365;
  const needsReview = document.status === 'approved' && daysSinceModification > 180;

  return {
    daysSinceCreation,
    daysSinceModification,
    isStale,
    needsReview,
    lifecycleStage:
      document.status === 'archived' || document.status === 'obsolete'
        ? 'archived'
        : document.status === 'approved' || document.status === 'issued_for_construction'
        ? 'active'
        : 'development',
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Hooks
  useDocumentManagement,
  useVersionControl,
  useDocumentApprovals,
  useDocumentDistribution,
  useDocumentReview,
  useRetentionManagement,
  useDocumentTransmittal,

  // Utility Functions
  generateDocumentMetadataForm,
  generateDocumentNumber,
  validateDocumentMetadata,
  calculateVersionIncrement,
  exportDocumentRegister,
  checkSupersessionChain,
  generateTransmittalCoverSheet,
  calculateDocumentLifecycle,
};
