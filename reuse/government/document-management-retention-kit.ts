/**
 * LOC: DOCUMENT_MANAGEMENT_RETENTION_KIT_001
 * File: /reuse/government/document-management-retention-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Government records management services
 *   - Document lifecycle systems
 *   - Electronic records management platforms
 *   - Compliance and audit systems
 *   - Legal hold management services
 */

/**
 * File: /reuse/government/document-management-retention-kit.ts
 * Locator: WC-GOV-DOC-MGMT-RETENTION-001
 * Purpose: Comprehensive Document Management and Retention Toolkit for Government Operations
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto, class-validator
 * Downstream: Government records management, Document lifecycle, Legal hold systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, Sequelize 6+
 * Exports: 50+ government document management and retention functions
 *
 * LLM Context: Enterprise-grade document management and retention for government agencies.
 * Provides comprehensive document classification, retention schedule management, document lifecycle
 * tracking, records retention compliance, document disposal workflows, legal hold management,
 * document versioning, metadata management, document search and retrieval, electronic records
 * management, document archival, and retention policy enforcement with full Sequelize/NestJS/Swagger integration.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Document classification levels
 */
export enum DocumentClassification {
  UNCLASSIFIED = 'UNCLASSIFIED',
  CONFIDENTIAL = 'CONFIDENTIAL',
  SECRET = 'SECRET',
  TOP_SECRET = 'TOP_SECRET',
  SENSITIVE_BUT_UNCLASSIFIED = 'SENSITIVE_BUT_UNCLASSIFIED',
  FOR_OFFICIAL_USE_ONLY = 'FOR_OFFICIAL_USE_ONLY',
  LAW_ENFORCEMENT_SENSITIVE = 'LAW_ENFORCEMENT_SENSITIVE',
  CONTROLLED_UNCLASSIFIED = 'CONTROLLED_UNCLASSIFIED',
}

/**
 * Document status
 */
export enum DocumentStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  PENDING_DISPOSAL = 'PENDING_DISPOSAL',
  DISPOSED = 'DISPOSED',
  LEGAL_HOLD = 'LEGAL_HOLD',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

/**
 * Document type categories
 */
export enum DocumentType {
  POLICY = 'POLICY',
  PROCEDURE = 'PROCEDURE',
  REGULATION = 'REGULATION',
  CONTRACT = 'CONTRACT',
  CORRESPONDENCE = 'CORRESPONDENCE',
  REPORT = 'REPORT',
  FORM = 'FORM',
  MEMO = 'MEMO',
  MEETING_MINUTES = 'MEETING_MINUTES',
  FINANCIAL_RECORD = 'FINANCIAL_RECORD',
  PERSONNEL_FILE = 'PERSONNEL_FILE',
  LEGAL_DOCUMENT = 'LEGAL_DOCUMENT',
  TECHNICAL_DOCUMENT = 'TECHNICAL_DOCUMENT',
}

/**
 * Retention schedule type
 */
export enum RetentionScheduleType {
  PERMANENT = 'PERMANENT',
  YEARS = 'YEARS',
  EVENT_BASED = 'EVENT_BASED',
  SUPERSEDED = 'SUPERSEDED',
  UNTIL_OBSOLETE = 'UNTIL_OBSOLETE',
}

/**
 * Disposal method
 */
export enum DisposalMethod {
  SECURE_SHREDDING = 'SECURE_SHREDDING',
  ELECTRONIC_DELETION = 'ELECTRONIC_DELETION',
  DEGAUSSING = 'DEGAUSSING',
  INCINERATION = 'INCINERATION',
  TRANSFER_TO_ARCHIVES = 'TRANSFER_TO_ARCHIVES',
  TRANSFER_TO_NARA = 'TRANSFER_TO_NARA',
  RECYCLING = 'RECYCLING',
}

/**
 * Document lifecycle stage
 */
export enum LifecycleStage {
  CREATION = 'CREATION',
  ACTIVE_USE = 'ACTIVE_USE',
  INACTIVE_STORAGE = 'INACTIVE_STORAGE',
  RETENTION_HOLD = 'RETENTION_HOLD',
  ARCHIVAL = 'ARCHIVAL',
  DISPOSAL = 'DISPOSAL',
}

/**
 * Legal hold status
 */
export enum LegalHoldStatus {
  ACTIVE = 'ACTIVE',
  RELEASED = 'RELEASED',
  PARTIAL_RELEASE = 'PARTIAL_RELEASE',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

/**
 * Version control action
 */
export enum VersionAction {
  CREATED = 'CREATED',
  MODIFIED = 'MODIFIED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
  RESTORED = 'RESTORED',
}

/**
 * Document record structure
 */
export interface DocumentRecord {
  id: string;
  documentNumber: string;
  title: string;
  description: string;
  documentType: DocumentType;
  classification: DocumentClassification;
  status: DocumentStatus;
  lifecycleStage: LifecycleStage;
  createdBy: string;
  createdDate: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
  departmentId: string;
  agencyId: string;
  retentionScheduleId: string;
  disposalDate?: Date;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  metadata: DocumentMetadata;
  tags: string[];
  relatedDocuments: string[];
}

/**
 * Document metadata structure
 */
export interface DocumentMetadata {
  author?: string;
  subject?: string;
  keywords?: string[];
  projectNumber?: string;
  contractNumber?: string;
  fiscalYear?: number;
  grantNumber?: string;
  caseNumber?: string;
  recordSeries?: string;
  customFields?: Record<string, any>;
}

/**
 * Retention schedule structure
 */
export interface RetentionSchedule {
  id: string;
  scheduleCode: string;
  recordSeries: string;
  description: string;
  retentionType: RetentionScheduleType;
  retentionPeriodYears?: number;
  eventTrigger?: string;
  disposalMethod: DisposalMethod;
  legalAuthority: string;
  applicableDocumentTypes: DocumentType[];
  active: boolean;
  approvedBy: string;
  approvalDate: Date;
  reviewDate: Date;
  notes?: string;
  metadata?: Record<string, any>;
}

/**
 * Document lifecycle tracking
 */
export interface DocumentLifecycle {
  id: string;
  documentId: string;
  currentStage: LifecycleStage;
  stageHistory: LifecycleEvent[];
  retentionStartDate: Date;
  retentionEndDate?: Date;
  disposalEligibilityDate?: Date;
  legalHoldApplied: boolean;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  archivalDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Lifecycle event
 */
export interface LifecycleEvent {
  eventId: string;
  stage: LifecycleStage;
  eventDate: Date;
  performedBy: string;
  reason?: string;
  notes?: string;
}

/**
 * Retention compliance record
 */
export interface RetentionCompliance {
  id: string;
  documentId: string;
  scheduleId: string;
  complianceStatus: ComplianceStatus;
  lastAuditDate?: Date;
  nextAuditDate?: Date;
  violations: ComplianceViolation[];
  correctionActions: CorrectionAction[];
  verifiedBy?: string;
  verificationDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Compliance status
 */
export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REMEDIATION_IN_PROGRESS = 'REMEDIATION_IN_PROGRESS',
  WAIVED = 'WAIVED',
}

/**
 * Compliance violation
 */
export interface ComplianceViolation {
  violationId: string;
  violationType: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  discoveredDate: Date;
  discoveredBy: string;
}

/**
 * Correction action
 */
export interface CorrectionAction {
  actionId: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed';
}

/**
 * Document disposal workflow
 */
export interface DisposalWorkflow {
  id: string;
  documentIds: string[];
  requestedBy: string;
  requestDate: Date;
  disposalMethod: DisposalMethod;
  scheduledDate?: Date;
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  executedBy?: string;
  executionDate?: Date;
  status: DisposalStatus;
  certificateOfDestruction?: string;
  witnessedBy?: string[];
  metadata?: Record<string, any>;
}

/**
 * Disposal status
 */
export enum DisposalStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Legal hold record
 */
export interface LegalHold {
  id: string;
  holdName: string;
  caseNumber?: string;
  description: string;
  issuedBy: string;
  issuedDate: Date;
  status: LegalHoldStatus;
  affectedDocuments: string[];
  custodians: string[];
  releaseDate?: Date;
  releasedBy?: string;
  expirationDate?: Date;
  preservationInstructions: string;
  metadata?: Record<string, any>;
}

/**
 * Document version
 */
export interface DocumentVersion {
  versionId: string;
  documentId: string;
  versionNumber: string;
  action: VersionAction;
  createdBy: string;
  createdDate: Date;
  changeDescription: string;
  filePath: string;
  fileSize: number;
  checksum: string;
  previousVersionId?: string;
  isCurrent: boolean;
  metadata?: Record<string, any>;
}

/**
 * Document search criteria
 */
export interface DocumentSearchCriteria {
  keywords?: string;
  documentType?: DocumentType;
  classification?: DocumentClassification;
  status?: DocumentStatus;
  departmentId?: string;
  agencyId?: string;
  createdDateFrom?: Date;
  createdDateTo?: Date;
  author?: string;
  tags?: string[];
  recordSeries?: string;
  metadata?: Record<string, any>;
}

/**
 * Electronic records management policy
 */
export interface ERMPolicy {
  id: string;
  policyName: string;
  policyNumber: string;
  description: string;
  effectiveDate: Date;
  expirationDate?: Date;
  requirements: PolicyRequirement[];
  applicableAgencies: string[];
  approvedBy: string;
  approvalDate: Date;
  reviewFrequencyMonths: number;
  lastReviewDate?: Date;
  nextReviewDate: Date;
  metadata?: Record<string, any>;
}

/**
 * Policy requirement
 */
export interface PolicyRequirement {
  requirementId: string;
  title: string;
  description: string;
  mandatory: boolean;
  validationRules?: string[];
}

/**
 * Document archive record
 */
export interface DocumentArchive {
  id: string;
  archiveName: string;
  description: string;
  documentIds: string[];
  archiveDate: Date;
  archivedBy: string;
  storageLocation: string;
  archiveType: 'physical' | 'electronic' | 'hybrid';
  retrievalInstructions?: string;
  accessRestrictions?: string[];
  expirationDate?: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// DOCUMENT CLASSIFICATION
// ============================================================================

/**
 * Creates a new document record
 */
export function createDocumentRecord(params: {
  title: string;
  description: string;
  documentType: DocumentType;
  classification: DocumentClassification;
  createdBy: string;
  departmentId: string;
  agencyId: string;
  retentionScheduleId: string;
  metadata?: DocumentMetadata;
}): DocumentRecord {
  const documentNumber = generateDocumentNumber();

  return {
    id: crypto.randomUUID(),
    documentNumber,
    title: params.title,
    description: params.description,
    documentType: params.documentType,
    classification: params.classification,
    status: DocumentStatus.DRAFT,
    lifecycleStage: LifecycleStage.CREATION,
    createdBy: params.createdBy,
    createdDate: new Date(),
    departmentId: params.departmentId,
    agencyId: params.agencyId,
    retentionScheduleId: params.retentionScheduleId,
    metadata: params.metadata || {},
    tags: [],
    relatedDocuments: [],
  };
}

/**
 * Generates a unique document number
 */
export function generateDocumentNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `DOC-${timestamp}-${random}`;
}

/**
 * Classifies a document based on content analysis
 */
export function classifyDocument(
  documentContent: string,
  keywords: Record<DocumentClassification, string[]>,
): DocumentClassification {
  const contentLower = documentContent.toLowerCase();

  for (const [classification, classKeywords] of Object.entries(keywords)) {
    if (classKeywords.some(keyword => contentLower.includes(keyword.toLowerCase()))) {
      return classification as DocumentClassification;
    }
  }

  return DocumentClassification.UNCLASSIFIED;
}

/**
 * Updates document classification
 */
export function updateDocumentClassification(
  document: DocumentRecord,
  newClassification: DocumentClassification,
  modifiedBy: string,
): DocumentRecord {
  return {
    ...document,
    classification: newClassification,
    modifiedBy,
    modifiedDate: new Date(),
  };
}

/**
 * Validates document classification level
 */
export function validateClassificationLevel(
  classification: DocumentClassification,
  userClearanceLevel: DocumentClassification,
): boolean {
  const classificationHierarchy = [
    DocumentClassification.UNCLASSIFIED,
    DocumentClassification.FOR_OFFICIAL_USE_ONLY,
    DocumentClassification.SENSITIVE_BUT_UNCLASSIFIED,
    DocumentClassification.CONFIDENTIAL,
    DocumentClassification.SECRET,
    DocumentClassification.TOP_SECRET,
  ];

  const docLevel = classificationHierarchy.indexOf(classification);
  const userLevel = classificationHierarchy.indexOf(userClearanceLevel);

  return userLevel >= docLevel;
}

// ============================================================================
// RETENTION SCHEDULE MANAGEMENT
// ============================================================================

/**
 * Creates a retention schedule
 */
export function createRetentionSchedule(params: {
  scheduleCode: string;
  recordSeries: string;
  description: string;
  retentionType: RetentionScheduleType;
  retentionPeriodYears?: number;
  eventTrigger?: string;
  disposalMethod: DisposalMethod;
  legalAuthority: string;
  applicableDocumentTypes: DocumentType[];
  approvedBy: string;
}): RetentionSchedule {
  const reviewDate = new Date();
  reviewDate.setFullYear(reviewDate.getFullYear() + 3);

  return {
    id: crypto.randomUUID(),
    scheduleCode: params.scheduleCode,
    recordSeries: params.recordSeries,
    description: params.description,
    retentionType: params.retentionType,
    retentionPeriodYears: params.retentionPeriodYears,
    eventTrigger: params.eventTrigger,
    disposalMethod: params.disposalMethod,
    legalAuthority: params.legalAuthority,
    applicableDocumentTypes: params.applicableDocumentTypes,
    active: true,
    approvedBy: params.approvedBy,
    approvalDate: new Date(),
    reviewDate,
  };
}

/**
 * Calculates disposal eligibility date
 */
export function calculateDisposalDate(
  schedule: RetentionSchedule,
  documentCreationDate: Date,
  eventDate?: Date,
): Date | null {
  if (schedule.retentionType === RetentionScheduleType.PERMANENT) {
    return null;
  }

  if (schedule.retentionType === RetentionScheduleType.YEARS && schedule.retentionPeriodYears) {
    const disposalDate = new Date(documentCreationDate);
    disposalDate.setFullYear(disposalDate.getFullYear() + schedule.retentionPeriodYears);
    return disposalDate;
  }

  if (schedule.retentionType === RetentionScheduleType.EVENT_BASED && eventDate && schedule.retentionPeriodYears) {
    const disposalDate = new Date(eventDate);
    disposalDate.setFullYear(disposalDate.getFullYear() + schedule.retentionPeriodYears);
    return disposalDate;
  }

  return null;
}

/**
 * Gets schedules requiring review
 */
export function getSchedulesRequiringReview(
  schedules: RetentionSchedule[],
  currentDate: Date = new Date(),
): RetentionSchedule[] {
  return schedules.filter(schedule => schedule.reviewDate <= currentDate && schedule.active);
}

/**
 * Updates retention schedule
 */
export function updateRetentionSchedule(
  schedule: RetentionSchedule,
  updates: Partial<RetentionSchedule>,
): RetentionSchedule {
  return {
    ...schedule,
    ...updates,
  };
}

/**
 * Applies retention schedule to document
 */
export function applyRetentionSchedule(
  document: DocumentRecord,
  schedule: RetentionSchedule,
): DocumentRecord {
  if (!schedule.applicableDocumentTypes.includes(document.documentType)) {
    throw new Error('Schedule not applicable to document type');
  }

  return {
    ...document,
    retentionScheduleId: schedule.id,
  };
}

// ============================================================================
// DOCUMENT LIFECYCLE TRACKING
// ============================================================================

/**
 * Creates document lifecycle record
 */
export function createDocumentLifecycle(
  documentId: string,
  retentionStartDate: Date,
): DocumentLifecycle {
  return {
    id: crypto.randomUUID(),
    documentId,
    currentStage: LifecycleStage.CREATION,
    stageHistory: [],
    retentionStartDate,
    legalHoldApplied: false,
  };
}

/**
 * Advances document to next lifecycle stage
 */
export function advanceLifecycleStage(
  lifecycle: DocumentLifecycle,
  newStage: LifecycleStage,
  performedBy: string,
  reason?: string,
): DocumentLifecycle {
  const event: LifecycleEvent = {
    eventId: crypto.randomUUID(),
    stage: newStage,
    eventDate: new Date(),
    performedBy,
    reason,
  };

  return {
    ...lifecycle,
    currentStage: newStage,
    stageHistory: [...lifecycle.stageHistory, event],
  };
}

/**
 * Gets lifecycle duration in days
 */
export function getLifecycleDuration(lifecycle: DocumentLifecycle): number {
  const now = new Date();
  const diff = now.getTime() - lifecycle.retentionStartDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Gets documents eligible for archival
 */
export function getDocumentsEligibleForArchival(
  lifecycles: DocumentLifecycle[],
  inactiveDaysThreshold: number = 365,
): DocumentLifecycle[] {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - inactiveDaysThreshold);

  return lifecycles.filter(
    lc =>
      lc.currentStage === LifecycleStage.INACTIVE_STORAGE &&
      !lc.legalHoldApplied &&
      lc.lastReviewDate &&
      lc.lastReviewDate < thresholdDate,
  );
}

/**
 * Tracks lifecycle event
 */
export function trackLifecycleEvent(
  lifecycle: DocumentLifecycle,
  event: LifecycleEvent,
): DocumentLifecycle {
  return {
    ...lifecycle,
    stageHistory: [...lifecycle.stageHistory, event],
  };
}

// ============================================================================
// RECORDS RETENTION COMPLIANCE
// ============================================================================

/**
 * Creates retention compliance record
 */
export function createRetentionCompliance(
  documentId: string,
  scheduleId: string,
): RetentionCompliance {
  const nextAuditDate = new Date();
  nextAuditDate.setFullYear(nextAuditDate.getFullYear() + 1);

  return {
    id: crypto.randomUUID(),
    documentId,
    scheduleId,
    complianceStatus: ComplianceStatus.COMPLIANT,
    nextAuditDate,
    violations: [],
    correctionActions: [],
  };
}

/**
 * Audits document retention compliance
 */
export function auditRetentionCompliance(
  document: DocumentRecord,
  schedule: RetentionSchedule,
  lifecycle: DocumentLifecycle,
): ComplianceStatus {
  if (!schedule.applicableDocumentTypes.includes(document.documentType)) {
    return ComplianceStatus.NON_COMPLIANT;
  }

  if (lifecycle.legalHoldApplied && document.status === DocumentStatus.DISPOSED) {
    return ComplianceStatus.NON_COMPLIANT;
  }

  if (lifecycle.disposalEligibilityDate) {
    const now = new Date();
    const overdue = now.getTime() - lifecycle.disposalEligibilityDate.getTime();
    const daysOverdue = Math.floor(overdue / (1000 * 60 * 60 * 24));

    if (daysOverdue > 365 && document.status !== DocumentStatus.DISPOSED) {
      return ComplianceStatus.NON_COMPLIANT;
    }
  }

  return ComplianceStatus.COMPLIANT;
}

/**
 * Adds compliance violation
 */
export function addComplianceViolation(
  compliance: RetentionCompliance,
  violation: ComplianceViolation,
): RetentionCompliance {
  return {
    ...compliance,
    complianceStatus: ComplianceStatus.NON_COMPLIANT,
    violations: [...compliance.violations, violation],
  };
}

/**
 * Creates correction action
 */
export function createCorrectionAction(
  compliance: RetentionCompliance,
  action: CorrectionAction,
): RetentionCompliance {
  return {
    ...compliance,
    complianceStatus: ComplianceStatus.REMEDIATION_IN_PROGRESS,
    correctionActions: [...compliance.correctionActions, action],
  };
}

/**
 * Verifies compliance remediation
 */
export function verifyComplianceRemediation(
  compliance: RetentionCompliance,
  verifiedBy: string,
): RetentionCompliance {
  const allActionsCompleted = compliance.correctionActions.every(
    action => action.status === 'completed',
  );

  return {
    ...compliance,
    complianceStatus: allActionsCompleted ? ComplianceStatus.COMPLIANT : ComplianceStatus.REMEDIATION_IN_PROGRESS,
    verifiedBy,
    verificationDate: new Date(),
  };
}

// ============================================================================
// DOCUMENT DISPOSAL WORKFLOWS
// ============================================================================

/**
 * Creates a disposal workflow
 */
export function createDisposalWorkflow(params: {
  documentIds: string[];
  requestedBy: string;
  disposalMethod: DisposalMethod;
  approvalRequired?: boolean;
}): DisposalWorkflow {
  return {
    id: crypto.randomUUID(),
    documentIds: params.documentIds,
    requestedBy: params.requestedBy,
    requestDate: new Date(),
    disposalMethod: params.disposalMethod,
    approvalRequired: params.approvalRequired ?? true,
    status: params.approvalRequired ? DisposalStatus.PENDING_APPROVAL : DisposalStatus.APPROVED,
  };
}

/**
 * Approves disposal workflow
 */
export function approveDisposalWorkflow(
  workflow: DisposalWorkflow,
  approvedBy: string,
): DisposalWorkflow {
  return {
    ...workflow,
    approvedBy,
    approvalDate: new Date(),
    status: DisposalStatus.APPROVED,
  };
}

/**
 * Schedules disposal execution
 */
export function scheduleDisposal(
  workflow: DisposalWorkflow,
  scheduledDate: Date,
): DisposalWorkflow {
  return {
    ...workflow,
    scheduledDate,
    status: DisposalStatus.SCHEDULED,
  };
}

/**
 * Executes disposal
 */
export function executeDisposal(
  workflow: DisposalWorkflow,
  executedBy: string,
  witnessedBy: string[],
): DisposalWorkflow {
  const certificateNumber = generateCertificateOfDestruction();

  return {
    ...workflow,
    executedBy,
    executionDate: new Date(),
    witnessedBy,
    certificateOfDestruction: certificateNumber,
    status: DisposalStatus.COMPLETED,
  };
}

/**
 * Generates certificate of destruction number
 */
export function generateCertificateOfDestruction(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `COD-${timestamp}-${random}`;
}

/**
 * Validates disposal eligibility
 */
export function validateDisposalEligibility(
  document: DocumentRecord,
  lifecycle: DocumentLifecycle,
): { eligible: boolean; reason?: string } {
  if (lifecycle.legalHoldApplied) {
    return { eligible: false, reason: 'Document is under legal hold' };
  }

  if (!lifecycle.disposalEligibilityDate) {
    return { eligible: false, reason: 'Disposal date not calculated' };
  }

  if (lifecycle.disposalEligibilityDate > new Date()) {
    return { eligible: false, reason: 'Retention period not yet expired' };
  }

  return { eligible: true };
}

// ============================================================================
// LEGAL HOLD MANAGEMENT
// ============================================================================

/**
 * Creates a legal hold
 */
export function createLegalHold(params: {
  holdName: string;
  caseNumber?: string;
  description: string;
  issuedBy: string;
  affectedDocuments: string[];
  custodians: string[];
  preservationInstructions: string;
}): LegalHold {
  return {
    id: crypto.randomUUID(),
    holdName: params.holdName,
    caseNumber: params.caseNumber,
    description: params.description,
    issuedBy: params.issuedBy,
    issuedDate: new Date(),
    status: LegalHoldStatus.ACTIVE,
    affectedDocuments: params.affectedDocuments,
    custodians: params.custodians,
    preservationInstructions: params.preservationInstructions,
  };
}

/**
 * Applies legal hold to documents
 */
export function applyLegalHold(
  lifecycle: DocumentLifecycle,
  legalHoldId: string,
): DocumentLifecycle {
  return {
    ...lifecycle,
    legalHoldApplied: true,
    metadata: {
      ...lifecycle.metadata,
      legalHoldId,
    },
  };
}

/**
 * Releases legal hold
 */
export function releaseLegalHold(
  hold: LegalHold,
  releasedBy: string,
): LegalHold {
  return {
    ...hold,
    status: LegalHoldStatus.RELEASED,
    releaseDate: new Date(),
    releasedBy,
  };
}

/**
 * Adds documents to legal hold
 */
export function addDocumentsToLegalHold(
  hold: LegalHold,
  documentIds: string[],
): LegalHold {
  return {
    ...hold,
    affectedDocuments: [...new Set([...hold.affectedDocuments, ...documentIds])],
  };
}

/**
 * Gets active legal holds for document
 */
export function getActiveLegalHolds(
  documentId: string,
  allHolds: LegalHold[],
): LegalHold[] {
  return allHolds.filter(
    hold =>
      hold.status === LegalHoldStatus.ACTIVE &&
      hold.affectedDocuments.includes(documentId),
  );
}

// ============================================================================
// DOCUMENT VERSIONING
// ============================================================================

/**
 * Creates a new document version
 */
export function createDocumentVersion(params: {
  documentId: string;
  versionNumber: string;
  action: VersionAction;
  createdBy: string;
  changeDescription: string;
  filePath: string;
  fileSize: number;
  previousVersionId?: string;
}): DocumentVersion {
  const checksum = calculateChecksum(params.filePath);

  return {
    versionId: crypto.randomUUID(),
    documentId: params.documentId,
    versionNumber: params.versionNumber,
    action: params.action,
    createdBy: params.createdBy,
    createdDate: new Date(),
    changeDescription: params.changeDescription,
    filePath: params.filePath,
    fileSize: params.fileSize,
    checksum,
    previousVersionId: params.previousVersionId,
    isCurrent: true,
  };
}

/**
 * Calculates file checksum (SHA-256)
 */
export function calculateChecksum(filePath: string): string {
  // In production, this would read the actual file
  // For now, return a mock checksum
  const hash = crypto.createHash('sha256');
  hash.update(filePath + Date.now());
  return hash.digest('hex');
}

/**
 * Gets version history
 */
export function getVersionHistory(
  versions: DocumentVersion[],
  documentId: string,
): DocumentVersion[] {
  return versions
    .filter(v => v.documentId === documentId)
    .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
}

/**
 * Restores previous version
 */
export function restorePreviousVersion(
  currentVersion: DocumentVersion,
  restoredBy: string,
): DocumentVersion {
  return {
    ...currentVersion,
    action: VersionAction.RESTORED,
    createdBy: restoredBy,
    createdDate: new Date(),
    isCurrent: true,
  };
}

/**
 * Compares two versions
 */
export function compareVersions(
  version1: DocumentVersion,
  version2: DocumentVersion,
): { checksumMatch: boolean; sizeChange: number } {
  return {
    checksumMatch: version1.checksum === version2.checksum,
    sizeChange: version2.fileSize - version1.fileSize,
  };
}

// ============================================================================
// METADATA MANAGEMENT
// ============================================================================

/**
 * Updates document metadata
 */
export function updateDocumentMetadata(
  document: DocumentRecord,
  metadata: Partial<DocumentMetadata>,
): DocumentRecord {
  return {
    ...document,
    metadata: {
      ...document.metadata,
      ...metadata,
    },
    modifiedDate: new Date(),
  };
}

/**
 * Adds custom metadata field
 */
export function addCustomMetadataField(
  metadata: DocumentMetadata,
  fieldName: string,
  fieldValue: any,
): DocumentMetadata {
  return {
    ...metadata,
    customFields: {
      ...metadata.customFields,
      [fieldName]: fieldValue,
    },
  };
}

/**
 * Validates metadata completeness
 */
export function validateMetadataCompleteness(
  metadata: DocumentMetadata,
  requiredFields: string[],
): { complete: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => !metadata[field as keyof DocumentMetadata]);

  return {
    complete: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Extracts metadata from file
 */
export function extractMetadataFromFile(filePath: string): Partial<DocumentMetadata> {
  // In production, this would use actual file parsing libraries
  return {
    keywords: [],
    customFields: {
      extractedDate: new Date().toISOString(),
    },
  };
}

// ============================================================================
// DOCUMENT SEARCH AND RETRIEVAL
// ============================================================================

/**
 * Searches documents by criteria
 */
export function searchDocuments(
  documents: DocumentRecord[],
  criteria: DocumentSearchCriteria,
): DocumentRecord[] {
  return documents.filter(doc => {
    if (criteria.keywords && !doc.title.toLowerCase().includes(criteria.keywords.toLowerCase()) &&
        !doc.description.toLowerCase().includes(criteria.keywords.toLowerCase())) {
      return false;
    }

    if (criteria.documentType && doc.documentType !== criteria.documentType) {
      return false;
    }

    if (criteria.classification && doc.classification !== criteria.classification) {
      return false;
    }

    if (criteria.status && doc.status !== criteria.status) {
      return false;
    }

    if (criteria.departmentId && doc.departmentId !== criteria.departmentId) {
      return false;
    }

    if (criteria.agencyId && doc.agencyId !== criteria.agencyId) {
      return false;
    }

    if (criteria.createdDateFrom && doc.createdDate < criteria.createdDateFrom) {
      return false;
    }

    if (criteria.createdDateTo && doc.createdDate > criteria.createdDateTo) {
      return false;
    }

    if (criteria.tags && criteria.tags.length > 0 &&
        !criteria.tags.some(tag => doc.tags.includes(tag))) {
      return false;
    }

    return true;
  });
}

/**
 * Retrieves document by number
 */
export function retrieveDocumentByNumber(
  documents: DocumentRecord[],
  documentNumber: string,
): DocumentRecord | undefined {
  return documents.find(doc => doc.documentNumber === documentNumber);
}

/**
 * Gets related documents
 */
export function getRelatedDocuments(
  document: DocumentRecord,
  allDocuments: DocumentRecord[],
): DocumentRecord[] {
  return allDocuments.filter(doc => document.relatedDocuments.includes(doc.id));
}

/**
 * Builds search index
 */
export function buildSearchIndex(documents: DocumentRecord[]): Record<string, string[]> {
  const index: Record<string, string[]> = {};

  documents.forEach(doc => {
    const keywords = [
      doc.title,
      doc.description,
      doc.documentNumber,
      ...doc.tags,
    ].join(' ').toLowerCase().split(/\s+/);

    keywords.forEach(keyword => {
      if (!index[keyword]) {
        index[keyword] = [];
      }
      if (!index[keyword].includes(doc.id)) {
        index[keyword].push(doc.id);
      }
    });
  });

  return index;
}

// ============================================================================
// ELECTRONIC RECORDS MANAGEMENT
// ============================================================================

/**
 * Creates ERM policy
 */
export function createERMPolicy(params: {
  policyName: string;
  policyNumber: string;
  description: string;
  effectiveDate: Date;
  requirements: PolicyRequirement[];
  applicableAgencies: string[];
  approvedBy: string;
  reviewFrequencyMonths: number;
}): ERMPolicy {
  const nextReviewDate = new Date(params.effectiveDate);
  nextReviewDate.setMonth(nextReviewDate.getMonth() + params.reviewFrequencyMonths);

  return {
    id: crypto.randomUUID(),
    policyName: params.policyName,
    policyNumber: params.policyNumber,
    description: params.description,
    effectiveDate: params.effectiveDate,
    requirements: params.requirements,
    applicableAgencies: params.applicableAgencies,
    approvedBy: params.approvedBy,
    approvalDate: new Date(),
    reviewFrequencyMonths: params.reviewFrequencyMonths,
    nextReviewDate,
  };
}

/**
 * Validates document against ERM policy
 */
export function validateAgainstERMPolicy(
  document: DocumentRecord,
  policy: ERMPolicy,
): { compliant: boolean; violations: string[] } {
  const violations: string[] = [];

  policy.requirements.forEach(req => {
    if (req.mandatory) {
      // Check policy-specific validation rules
      if (req.validationRules) {
        req.validationRules.forEach(rule => {
          // In production, implement actual rule validation
          if (!document.metadata) {
            violations.push(`Missing metadata required by: ${req.title}`);
          }
        });
      }
    }
  });

  return {
    compliant: violations.length === 0,
    violations,
  };
}

/**
 * Gets ERM policy compliance rate
 */
export function calculateERMComplianceRate(
  documents: DocumentRecord[],
  policy: ERMPolicy,
): number {
  if (documents.length === 0) return 100;

  const compliantDocs = documents.filter(doc => {
    const result = validateAgainstERMPolicy(doc, policy);
    return result.compliant;
  });

  return (compliantDocs.length / documents.length) * 100;
}

// ============================================================================
// DOCUMENT ARCHIVAL
// ============================================================================

/**
 * Creates document archive
 */
export function createDocumentArchive(params: {
  archiveName: string;
  description: string;
  documentIds: string[];
  archivedBy: string;
  storageLocation: string;
  archiveType: 'physical' | 'electronic' | 'hybrid';
  retrievalInstructions?: string;
}): DocumentArchive {
  return {
    id: crypto.randomUUID(),
    archiveName: params.archiveName,
    description: params.description,
    documentIds: params.documentIds,
    archiveDate: new Date(),
    archivedBy: params.archivedBy,
    storageLocation: params.storageLocation,
    archiveType: params.archiveType,
    retrievalInstructions: params.retrievalInstructions,
  };
}

/**
 * Archives documents
 */
export function archiveDocuments(
  documents: DocumentRecord[],
  archive: DocumentArchive,
): DocumentRecord[] {
  return documents.map(doc => {
    if (archive.documentIds.includes(doc.id)) {
      return {
        ...doc,
        status: DocumentStatus.ARCHIVED,
        modifiedDate: new Date(),
      };
    }
    return doc;
  });
}

/**
 * Retrieves archived documents
 */
export function retrieveArchivedDocuments(
  archive: DocumentArchive,
  allDocuments: DocumentRecord[],
): DocumentRecord[] {
  return allDocuments.filter(doc => archive.documentIds.includes(doc.id));
}

// ============================================================================
// RETENTION POLICY ENFORCEMENT
// ============================================================================

/**
 * Enforces retention policy across documents
 */
export function enforceRetentionPolicy(
  documents: DocumentRecord[],
  schedules: RetentionSchedule[],
  lifecycles: DocumentLifecycle[],
): { eligible: string[]; notEligible: string[]; onHold: string[] } {
  const eligible: string[] = [];
  const notEligible: string[] = [];
  const onHold: string[] = [];

  documents.forEach(doc => {
    const lifecycle = lifecycles.find(lc => lc.documentId === doc.id);

    if (!lifecycle) {
      notEligible.push(doc.id);
      return;
    }

    if (lifecycle.legalHoldApplied) {
      onHold.push(doc.id);
      return;
    }

    const eligibility = validateDisposalEligibility(doc, lifecycle);
    if (eligibility.eligible) {
      eligible.push(doc.id);
    } else {
      notEligible.push(doc.id);
    }
  });

  return { eligible, notEligible, onHold };
}

/**
 * Generates retention policy report
 */
export function generateRetentionPolicyReport(params: {
  documents: DocumentRecord[];
  schedules: RetentionSchedule[];
  lifecycles: DocumentLifecycle[];
  compliance: RetentionCompliance[];
}): {
  totalDocuments: number;
  compliantDocuments: number;
  nonCompliantDocuments: number;
  documentsOnHold: number;
  eligibleForDisposal: number;
  complianceRate: number;
} {
  const enforcement = enforceRetentionPolicy(
    params.documents,
    params.schedules,
    params.lifecycles,
  );

  const compliantDocs = params.compliance.filter(
    c => c.complianceStatus === ComplianceStatus.COMPLIANT,
  ).length;

  return {
    totalDocuments: params.documents.length,
    compliantDocuments: compliantDocs,
    nonCompliantDocuments: params.documents.length - compliantDocs,
    documentsOnHold: enforcement.onHold.length,
    eligibleForDisposal: enforcement.eligible.length,
    complianceRate: params.documents.length > 0
      ? (compliantDocs / params.documents.length) * 100
      : 100,
  };
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize model for DocumentRecord
 */
export const DocumentRecordModel = {
  tableName: 'document_records',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    documentNumber: { type: 'STRING', allowNull: false, unique: true },
    title: { type: 'STRING', allowNull: false },
    description: { type: 'TEXT', allowNull: false },
    documentType: { type: 'ENUM', values: Object.values(DocumentType) },
    classification: { type: 'ENUM', values: Object.values(DocumentClassification) },
    status: { type: 'ENUM', values: Object.values(DocumentStatus) },
    lifecycleStage: { type: 'ENUM', values: Object.values(LifecycleStage) },
    createdBy: { type: 'STRING', allowNull: false },
    createdDate: { type: 'DATE', allowNull: false },
    modifiedBy: { type: 'STRING', allowNull: true },
    modifiedDate: { type: 'DATE', allowNull: true },
    departmentId: { type: 'UUID', allowNull: false },
    agencyId: { type: 'UUID', allowNull: false },
    retentionScheduleId: { type: 'UUID', allowNull: false },
    disposalDate: { type: 'DATE', allowNull: true },
    filePath: { type: 'STRING', allowNull: true },
    fileSize: { type: 'INTEGER', allowNull: true },
    mimeType: { type: 'STRING', allowNull: true },
    metadata: { type: 'JSON', defaultValue: {} },
    tags: { type: 'JSON', defaultValue: [] },
    relatedDocuments: { type: 'JSON', defaultValue: [] },
  },
  indexes: [
    { fields: ['documentNumber'] },
    { fields: ['documentType'] },
    { fields: ['classification'] },
    { fields: ['status'] },
    { fields: ['departmentId'] },
    { fields: ['agencyId'] },
    { fields: ['createdDate'] },
  ],
};

/**
 * Sequelize model for RetentionSchedule
 */
export const RetentionScheduleModel = {
  tableName: 'retention_schedules',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    scheduleCode: { type: 'STRING', allowNull: false, unique: true },
    recordSeries: { type: 'STRING', allowNull: false },
    description: { type: 'TEXT', allowNull: false },
    retentionType: { type: 'ENUM', values: Object.values(RetentionScheduleType) },
    retentionPeriodYears: { type: 'INTEGER', allowNull: true },
    eventTrigger: { type: 'STRING', allowNull: true },
    disposalMethod: { type: 'ENUM', values: Object.values(DisposalMethod) },
    legalAuthority: { type: 'STRING', allowNull: false },
    applicableDocumentTypes: { type: 'JSON', defaultValue: [] },
    active: { type: 'BOOLEAN', defaultValue: true },
    approvedBy: { type: 'STRING', allowNull: false },
    approvalDate: { type: 'DATE', allowNull: false },
    reviewDate: { type: 'DATE', allowNull: false },
    notes: { type: 'TEXT', allowNull: true },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['scheduleCode'] },
    { fields: ['recordSeries'] },
    { fields: ['active'] },
    { fields: ['reviewDate'] },
  ],
};

/**
 * Sequelize model for DocumentLifecycle
 */
export const DocumentLifecycleModel = {
  tableName: 'document_lifecycles',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    documentId: { type: 'UUID', allowNull: false },
    currentStage: { type: 'ENUM', values: Object.values(LifecycleStage) },
    stageHistory: { type: 'JSON', defaultValue: [] },
    retentionStartDate: { type: 'DATE', allowNull: false },
    retentionEndDate: { type: 'DATE', allowNull: true },
    disposalEligibilityDate: { type: 'DATE', allowNull: true },
    legalHoldApplied: { type: 'BOOLEAN', defaultValue: false },
    lastReviewDate: { type: 'DATE', allowNull: true },
    nextReviewDate: { type: 'DATE', allowNull: true },
    archivalDate: { type: 'DATE', allowNull: true },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['documentId'] },
    { fields: ['currentStage'] },
    { fields: ['disposalEligibilityDate'] },
    { fields: ['legalHoldApplied'] },
  ],
};

/**
 * Sequelize model for LegalHold
 */
export const LegalHoldModel = {
  tableName: 'legal_holds',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    holdName: { type: 'STRING', allowNull: false },
    caseNumber: { type: 'STRING', allowNull: true },
    description: { type: 'TEXT', allowNull: false },
    issuedBy: { type: 'STRING', allowNull: false },
    issuedDate: { type: 'DATE', allowNull: false },
    status: { type: 'ENUM', values: Object.values(LegalHoldStatus) },
    affectedDocuments: { type: 'JSON', defaultValue: [] },
    custodians: { type: 'JSON', defaultValue: [] },
    releaseDate: { type: 'DATE', allowNull: true },
    releasedBy: { type: 'STRING', allowNull: true },
    expirationDate: { type: 'DATE', allowNull: true },
    preservationInstructions: { type: 'TEXT', allowNull: false },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['holdName'] },
    { fields: ['caseNumber'] },
    { fields: ['status'] },
    { fields: ['issuedDate'] },
  ],
};

// ============================================================================
// NESTJS SERVICE CLASS EXAMPLE
// ============================================================================

/**
 * Example NestJS service for document management
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class DocumentManagementService {
 *   constructor(
 *     @InjectModel(DocumentRecordModel)
 *     private documentRepo: Repository<DocumentRecord>,
 *   ) {}
 *
 *   async createDocument(dto: CreateDocumentDto): Promise<DocumentRecord> {
 *     const document = createDocumentRecord(dto);
 *     return this.documentRepo.save(document);
 *   }
 *
 *   async searchDocuments(criteria: DocumentSearchCriteria): Promise<DocumentRecord[]> {
 *     const allDocuments = await this.documentRepo.find();
 *     return searchDocuments(allDocuments, criteria);
 *   }
 * }
 * ```
 */
export const DocumentManagementServiceExample = `
@Injectable()
export class DocumentManagementService {
  constructor(
    @InjectModel(DocumentRecordModel)
    private documentRepo: Repository<DocumentRecord>,
    @InjectModel(RetentionScheduleModel)
    private scheduleRepo: Repository<RetentionSchedule>,
    @InjectModel(DocumentLifecycleModel)
    private lifecycleRepo: Repository<DocumentLifecycle>,
    @InjectModel(LegalHoldModel)
    private legalHoldRepo: Repository<LegalHold>,
  ) {}

  async createDocument(dto: CreateDocumentDto): Promise<DocumentRecord> {
    const document = createDocumentRecord(dto);
    const lifecycle = createDocumentLifecycle(document.id, new Date());

    await this.documentRepo.save(document);
    await this.lifecycleRepo.save(lifecycle);

    return document;
  }

  async enforceRetentionPolicies(): Promise<void> {
    const documents = await this.documentRepo.find();
    const schedules = await this.scheduleRepo.find({ where: { active: true } });
    const lifecycles = await this.lifecycleRepo.find();

    const enforcement = enforceRetentionPolicy(documents, schedules, lifecycles);

    // Process eligible documents for disposal
    for (const docId of enforcement.eligible) {
      const workflow = createDisposalWorkflow({
        documentIds: [docId],
        requestedBy: 'system',
        disposalMethod: DisposalMethod.SECURE_SHREDDING,
      });
      // Save workflow for approval
    }
  }
}
`;

// ============================================================================
// SWAGGER API SCHEMA DEFINITIONS
// ============================================================================

/**
 * Swagger DTO for creating document record
 */
export const CreateDocumentRecordDto = {
  schema: {
    type: 'object',
    required: [
      'title',
      'description',
      'documentType',
      'classification',
      'createdBy',
      'departmentId',
      'agencyId',
      'retentionScheduleId',
    ],
    properties: {
      title: { type: 'string', example: 'Annual Budget Report FY2024' },
      description: { type: 'string', example: 'Comprehensive budget analysis for fiscal year 2024' },
      documentType: { type: 'string', enum: Object.values(DocumentType) },
      classification: { type: 'string', enum: Object.values(DocumentClassification) },
      createdBy: { type: 'string', example: 'user-123' },
      departmentId: { type: 'string', format: 'uuid' },
      agencyId: { type: 'string', format: 'uuid' },
      retentionScheduleId: { type: 'string', format: 'uuid' },
      metadata: {
        type: 'object',
        properties: {
          author: { type: 'string' },
          subject: { type: 'string' },
          keywords: { type: 'array', items: { type: 'string' } },
          fiscalYear: { type: 'number' },
        },
      },
    },
  },
};

/**
 * Swagger DTO for retention schedule
 */
export const CreateRetentionScheduleDto = {
  schema: {
    type: 'object',
    required: [
      'scheduleCode',
      'recordSeries',
      'description',
      'retentionType',
      'disposalMethod',
      'legalAuthority',
      'applicableDocumentTypes',
      'approvedBy',
    ],
    properties: {
      scheduleCode: { type: 'string', example: 'GRS-6.1' },
      recordSeries: { type: 'string', example: 'Financial Records' },
      description: { type: 'string', example: 'Financial transaction records' },
      retentionType: { type: 'string', enum: Object.values(RetentionScheduleType) },
      retentionPeriodYears: { type: 'number', example: 7 },
      eventTrigger: { type: 'string', example: 'End of fiscal year' },
      disposalMethod: { type: 'string', enum: Object.values(DisposalMethod) },
      legalAuthority: { type: 'string', example: '36 CFR 1229' },
      applicableDocumentTypes: {
        type: 'array',
        items: { type: 'string', enum: Object.values(DocumentType) },
      },
      approvedBy: { type: 'string', example: 'records-manager-001' },
    },
  },
};

/**
 * Swagger DTO for legal hold
 */
export const CreateLegalHoldDto = {
  schema: {
    type: 'object',
    required: [
      'holdName',
      'description',
      'issuedBy',
      'affectedDocuments',
      'custodians',
      'preservationInstructions',
    ],
    properties: {
      holdName: { type: 'string', example: 'Civil Case #2024-001 Hold' },
      caseNumber: { type: 'string', example: '2024-001' },
      description: { type: 'string', example: 'Legal hold for pending litigation' },
      issuedBy: { type: 'string', example: 'legal-dept-head' },
      affectedDocuments: { type: 'array', items: { type: 'string', format: 'uuid' } },
      custodians: { type: 'array', items: { type: 'string' } },
      preservationInstructions: {
        type: 'string',
        example: 'Preserve all documents related to contract negotiations',
      },
    },
  },
};

/**
 * Swagger response schema for retention policy report
 */
export const RetentionPolicyReportResponse = {
  schema: {
    type: 'object',
    properties: {
      totalDocuments: { type: 'number', example: 15000 },
      compliantDocuments: { type: 'number', example: 14250 },
      nonCompliantDocuments: { type: 'number', example: 750 },
      documentsOnHold: { type: 'number', example: 120 },
      eligibleForDisposal: { type: 'number', example: 450 },
      complianceRate: { type: 'number', example: 95.0 },
    },
  },
};
