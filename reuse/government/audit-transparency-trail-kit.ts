/**
 * LOC: AUDIT_TRANSPARENCY_TRAIL_KIT_001
 * File: /reuse/government/audit-transparency-trail-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Audit logging services
 *   - Transparency portal services
 *   - Public records management
 *   - FOIA request processing
 *   - Change tracking services
 *   - Data access monitoring
 */

/**
 * File: /reuse/government/audit-transparency-trail-kit.ts
 * Locator: WC-GOV-AUDIT-TRANSPARENCY-001
 * Purpose: Comprehensive Audit Trail and Transparency Management for Government Operations
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto, class-validator
 * Downstream: Audit services, Transparency portals, Public records, FOIA processing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, Sequelize 6+
 * Exports: 50+ audit trail, transparency, and public records management functions
 *
 * LLM Context: Enterprise-grade audit logging and transparency for government agencies.
 * Provides comprehensive audit logging, change history tracking, user activity monitoring,
 * transaction audit trails, data access logging, transparency portal integration, public
 * records management, FOIA request tracking, and extensive NestJS/Sequelize integration.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Comprehensive audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  userId: string;
  userName?: string;
  userRole?: string;
  departmentId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  resourceType: string;
  changes?: ChangeRecord[];
  beforeState?: any;
  afterState?: any;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  status: AuditStatus;
  severity: AuditSeverity;
  category: AuditCategory;
  tags?: string[];
  publiclyVisible: boolean;
  retentionYears: number;
  hash: string;
  chainHash?: string;
}

/**
 * Audit event types
 */
export enum AuditEventType {
  USER_ACTION = 'USER_ACTION',
  SYSTEM_EVENT = 'SYSTEM_EVENT',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  SECURITY = 'SECURITY',
  COMPLIANCE = 'COMPLIANCE',
  FINANCIAL = 'FINANCIAL',
  PUBLIC_REQUEST = 'PUBLIC_REQUEST',
}

/**
 * Audit actions
 */
export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SEARCH = 'SEARCH',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  DOWNLOAD = 'DOWNLOAD',
  PRINT = 'PRINT',
  SHARE = 'SHARE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SUBMIT = 'SUBMIT',
  REVIEW = 'REVIEW',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ACCESS_GRANTED = 'ACCESS_GRANTED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_CHANGED = 'PERMISSION_CHANGED',
  CONFIG_CHANGED = 'CONFIG_CHANGED',
}

/**
 * Audit status
 */
export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PARTIAL = 'PARTIAL',
  PENDING = 'PENDING',
  ERROR = 'ERROR',
}

/**
 * Audit severity levels
 */
export enum AuditSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Audit categories
 */
export enum AuditCategory {
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  DATA_MANAGEMENT = 'DATA_MANAGEMENT',
  FINANCIAL_TRANSACTION = 'FINANCIAL_TRANSACTION',
  SYSTEM_ADMINISTRATION = 'SYSTEM_ADMINISTRATION',
  SECURITY_INCIDENT = 'SECURITY_INCIDENT',
  POLICY_COMPLIANCE = 'POLICY_COMPLIANCE',
  PUBLIC_DISCLOSURE = 'PUBLIC_DISCLOSURE',
  RECORDS_MANAGEMENT = 'RECORDS_MANAGEMENT',
}

/**
 * Change record structure
 */
export interface ChangeRecord {
  field: string;
  fieldLabel?: string;
  oldValue: any;
  newValue: any;
  dataType: string;
  timestamp: Date;
  changeReason?: string;
  approvedBy?: string;
}

/**
 * Change history tracking
 */
export interface ChangeHistoryEntry {
  id: string;
  entityType: string;
  entityId: string;
  version: number;
  changeDate: Date;
  changedBy: string;
  changeType: ChangeType;
  changes: ChangeRecord[];
  snapshot?: any;
  comment?: string;
  reviewedBy?: string;
  reviewDate?: Date;
  publiclyVisible: boolean;
  metadata?: Record<string, any>;
}

/**
 * Change types
 */
export enum ChangeType {
  CREATED = 'CREATED',
  MODIFIED = 'MODIFIED',
  DELETED = 'DELETED',
  RESTORED = 'RESTORED',
  ARCHIVED = 'ARCHIVED',
  MERGED = 'MERGED',
  SPLIT = 'SPLIT',
}

/**
 * User activity monitoring
 */
export interface UserActivityLog {
  id: string;
  userId: string;
  userName: string;
  sessionId: string;
  activityType: ActivityType;
  activityDescription: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  resourcesAccessed: string[];
  actionsPerformed: number;
  ipAddress: string;
  deviceInfo?: string;
  location?: string;
  anomalyScore?: number;
  flaggedForReview: boolean;
  metadata?: Record<string, any>;
}

/**
 * Activity types
 */
export enum ActivityType {
  SESSION = 'SESSION',
  TRANSACTION = 'TRANSACTION',
  QUERY = 'QUERY',
  REPORT_GENERATION = 'REPORT_GENERATION',
  DATA_ENTRY = 'DATA_ENTRY',
  WORKFLOW = 'WORKFLOW',
  ADMINISTRATION = 'ADMINISTRATION',
}

/**
 * Transaction audit trail
 */
export interface TransactionAuditTrail {
  id: string;
  transactionId: string;
  transactionType: string;
  initiatedBy: string;
  initiatedAt: Date;
  completedAt?: Date;
  status: TransactionStatus;
  steps: TransactionStep[];
  totalAmount?: number;
  currency?: string;
  approvers?: string[];
  approvalChain?: ApprovalRecord[];
  relatedTransactions?: string[];
  reversalOf?: string;
  publicRecord: boolean;
  metadata?: Record<string, any>;
}

/**
 * Transaction status
 */
export enum TransactionStatus {
  INITIATED = 'INITIATED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
  CANCELLED = 'CANCELLED',
}

/**
 * Transaction step
 */
export interface TransactionStep {
  stepNumber: number;
  stepName: string;
  timestamp: Date;
  performedBy: string;
  status: 'pending' | 'completed' | 'failed' | 'skipped';
  details?: any;
  duration?: number;
}

/**
 * Approval record
 */
export interface ApprovalRecord {
  approverLevel: number;
  approverId: string;
  approverName: string;
  decision: 'approved' | 'rejected' | 'pending';
  timestamp?: Date;
  comments?: string;
  delegatedFrom?: string;
}

/**
 * Data access logging
 */
export interface DataAccessLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  accessType: AccessType;
  dataCategory: string;
  dataClassification: DataClassification;
  recordsAccessed: number;
  specificRecordIds?: string[];
  accessPurpose?: string;
  legalBasis?: string;
  approved: boolean;
  approvedBy?: string;
  accessDuration?: number;
  dataExported: boolean;
  exportFormat?: string;
  sensitivityScore: number;
  metadata?: Record<string, any>;
}

/**
 * Access types
 */
export enum AccessType {
  VIEW = 'VIEW',
  DOWNLOAD = 'DOWNLOAD',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
  BULK_ACCESS = 'BULK_ACCESS',
  QUERY = 'QUERY',
  EXPORT = 'EXPORT',
  SHARE = 'SHARE',
}

/**
 * Data classification levels
 */
export enum DataClassification {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED = 'RESTRICTED',
  SECRET = 'SECRET',
}

/**
 * Transparency portal record
 */
export interface TransparencyRecord {
  id: string;
  recordType: TransparencyRecordType;
  title: string;
  description: string;
  publishDate: Date;
  lastUpdated: Date;
  fiscalYear?: string;
  department: string;
  category: string;
  data: any;
  attachments?: string[];
  format: RecordFormat;
  accessLevel: AccessLevel;
  downloadCount: number;
  viewCount: number;
  tags: string[];
  relatedRecords?: string[];
  dataQualityScore?: number;
  metadata?: Record<string, any>;
}

/**
 * Transparency record types
 */
export enum TransparencyRecordType {
  BUDGET = 'BUDGET',
  EXPENDITURE = 'EXPENDITURE',
  CONTRACT = 'CONTRACT',
  GRANT = 'GRANT',
  SALARY = 'SALARY',
  MEETING_MINUTES = 'MEETING_MINUTES',
  DECISION = 'DECISION',
  POLICY = 'POLICY',
  PERFORMANCE_METRIC = 'PERFORMANCE_METRIC',
  STATISTICAL_REPORT = 'STATISTICAL_REPORT',
}

/**
 * Record formats
 */
export enum RecordFormat {
  JSON = 'JSON',
  XML = 'XML',
  CSV = 'CSV',
  PDF = 'PDF',
  HTML = 'HTML',
  EXCEL = 'EXCEL',
}

/**
 * Access levels
 */
export enum AccessLevel {
  PUBLIC = 'PUBLIC',
  REGISTERED_USERS = 'REGISTERED_USERS',
  GOVERNMENT_ONLY = 'GOVERNMENT_ONLY',
  RESTRICTED = 'RESTRICTED',
}

/**
 * Public records management
 */
export interface PublicRecord {
  id: string;
  recordNumber: string;
  title: string;
  description: string;
  recordType: string;
  createdDate: Date;
  modifiedDate: Date;
  retentionSchedule: string;
  retentionYears: number;
  dispositionDate?: Date;
  legalHold: boolean;
  archiveStatus: ArchiveStatus;
  archiveLocation?: string;
  format: RecordFormat;
  sizeBytes: number;
  checksum: string;
  relatedRecords?: string[];
  accessRestrictions?: string;
  publiclyAvailable: boolean;
  redactionRequired: boolean;
  metadata?: Record<string, any>;
}

/**
 * Archive status
 */
export enum ArchiveStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  SCHEDULED_FOR_DISPOSAL = 'SCHEDULED_FOR_DISPOSAL',
  PERMANENTLY_RETAINED = 'PERMANENTLY_RETAINED',
  DISPOSED = 'DISPOSED',
}

/**
 * FOIA request tracking
 */
export interface FOIARequest {
  id: string;
  requestNumber: string;
  requestDate: Date;
  requesterName: string;
  requesterEmail: string;
  requesterOrganization?: string;
  requestDescription: string;
  requestCategory: FOIACategory;
  priority: RequestPriority;
  status: FOIAStatus;
  assignedTo?: string;
  dueDate: Date;
  extensions?: RequestExtension[];
  estimatedPages?: number;
  estimatedCost?: number;
  feesPaid?: number;
  processingTrack: ProcessingTrack;
  recordsIdentified?: number;
  recordsProvided?: number;
  exemptionsApplied?: FOIAExemption[];
  response?: string;
  responseDate?: Date;
  closedDate?: Date;
  appealFiled: boolean;
  appealDate?: Date;
  publicationRequired: boolean;
  metadata?: Record<string, any>;
}

/**
 * FOIA categories
 */
export enum FOIACategory {
  COMMERCIAL = 'COMMERCIAL',
  EDUCATIONAL = 'EDUCATIONAL',
  MEDIA = 'MEDIA',
  PUBLIC_INTEREST = 'PUBLIC_INTEREST',
  OTHER = 'OTHER',
}

/**
 * Request priority
 */
export enum RequestPriority {
  EXPEDITED = 'EXPEDITED',
  STANDARD = 'STANDARD',
  COMPLEX = 'COMPLEX',
}

/**
 * FOIA status
 */
export enum FOIAStatus {
  RECEIVED = 'RECEIVED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IN_REVIEW = 'IN_REVIEW',
  PROCESSING = 'PROCESSING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  READY_FOR_RELEASE = 'READY_FOR_RELEASE',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FULFILLED = 'FULFILLED',
  DENIED = 'DENIED',
  NO_RECORDS = 'NO_RECORDS',
  WITHDRAWN = 'WITHDRAWN',
}

/**
 * Processing track
 */
export enum ProcessingTrack {
  SIMPLE = 'SIMPLE',
  COMPLEX = 'COMPLEX',
  EXPEDITED = 'EXPEDITED',
}

/**
 * Request extension
 */
export interface RequestExtension {
  requestedDate: Date;
  approvedDate?: Date;
  additionalDays: number;
  reason: string;
  newDueDate: Date;
}

/**
 * FOIA exemptions
 */
export enum FOIAExemption {
  EXEMPTION_1 = 'EXEMPTION_1', // National security
  EXEMPTION_2 = 'EXEMPTION_2', // Internal personnel rules
  EXEMPTION_3 = 'EXEMPTION_3', // Statutory exemption
  EXEMPTION_4 = 'EXEMPTION_4', // Trade secrets
  EXEMPTION_5 = 'EXEMPTION_5', // Deliberative process
  EXEMPTION_6 = 'EXEMPTION_6', // Personal privacy
  EXEMPTION_7 = 'EXEMPTION_7', // Law enforcement
  EXEMPTION_8 = 'EXEMPTION_8', // Financial institutions
  EXEMPTION_9 = 'EXEMPTION_9', // Geological information
}

/**
 * Audit report generation
 */
export interface AuditReport {
  id: string;
  reportType: AuditReportType;
  title: string;
  reportPeriodStart: Date;
  reportPeriodEnd: Date;
  generatedDate: Date;
  generatedBy: string;
  scope: string[];
  filters: AuditReportFilters;
  summary: AuditReportSummary;
  findings: AuditFinding[];
  recommendations: string[];
  data: any;
  format: RecordFormat;
  confidentialityLevel: DataClassification;
  distributionList?: string[];
  metadata?: Record<string, any>;
}

/**
 * Audit report types
 */
export enum AuditReportType {
  ACCESS_AUDIT = 'ACCESS_AUDIT',
  CHANGE_AUDIT = 'CHANGE_AUDIT',
  TRANSACTION_AUDIT = 'TRANSACTION_AUDIT',
  SECURITY_AUDIT = 'SECURITY_AUDIT',
  COMPLIANCE_AUDIT = 'COMPLIANCE_AUDIT',
  USER_ACTIVITY = 'USER_ACTIVITY',
  DATA_ACCESS = 'DATA_ACCESS',
  CUSTOM = 'CUSTOM',
}

/**
 * Audit report filters
 */
export interface AuditReportFilters {
  userIds?: string[];
  departments?: string[];
  eventTypes?: AuditEventType[];
  actions?: AuditAction[];
  severities?: AuditSeverity[];
  categories?: AuditCategory[];
  dateRange?: { start: Date; end: Date };
  resourceTypes?: string[];
  tags?: string[];
}

/**
 * Audit report summary
 */
export interface AuditReportSummary {
  totalEvents: number;
  uniqueUsers: number;
  successfulEvents: number;
  failedEvents: number;
  criticalEvents: number;
  topUsers: Array<{ userId: string; eventCount: number }>;
  topActions: Array<{ action: string; count: number }>;
  timeDistribution: Record<string, number>;
}

/**
 * Audit finding
 */
export interface AuditFinding {
  findingId: string;
  severity: AuditSeverity;
  category: string;
  title: string;
  description: string;
  evidence: string[];
  affectedResources: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted';
}

/**
 * Audit evidence collection
 */
export interface AuditEvidence {
  id: string;
  evidenceType: EvidenceType;
  collectionDate: Date;
  collectedBy: string;
  relatedAuditId?: string;
  relatedFindingId?: string;
  description: string;
  source: string;
  dataSnapshot: any;
  attachments?: string[];
  hash: string;
  chainOfCustody: CustodyRecord[];
  verified: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Evidence types
 */
export enum EvidenceType {
  LOG_ENTRY = 'LOG_ENTRY',
  SCREENSHOT = 'SCREENSHOT',
  DOCUMENT = 'DOCUMENT',
  DATABASE_RECORD = 'DATABASE_RECORD',
  SYSTEM_OUTPUT = 'SYSTEM_OUTPUT',
  USER_STATEMENT = 'USER_STATEMENT',
  CONFIGURATION = 'CONFIGURATION',
  EMAIL = 'EMAIL',
}

/**
 * Chain of custody record
 */
export interface CustodyRecord {
  timestamp: Date;
  custodian: string;
  action: 'collected' | 'transferred' | 'accessed' | 'analyzed' | 'stored';
  location?: string;
  notes?: string;
}

/**
 * Transparency reporting metrics
 */
export interface TransparencyMetrics {
  totalPublicRecords: number;
  recordsPublishedThisMonth: number;
  totalDownloads: number;
  totalViews: number;
  openFOIARequests: number;
  averageFOIAResponseDays: number;
  foiaFulfillmentRate: number;
  mostAccessedRecords: Array<{ recordId: string; title: string; accessCount: number }>;
  categoryBreakdown: Record<string, number>;
  monthlyTrends?: TransparencyTrend[];
}

/**
 * Transparency trend
 */
export interface TransparencyTrend {
  period: string;
  recordsPublished: number;
  foiaRequests: number;
  averageResponseDays: number;
  publicEngagement: number;
}

// ============================================================================
// COMPREHENSIVE AUDIT LOGGING
// ============================================================================

/**
 * Creates a comprehensive audit log entry
 */
export function createAuditLogEntry(params: {
  eventType: AuditEventType;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  resourceType: string;
  changes?: ChangeRecord[];
  beforeState?: any;
  afterState?: any;
  ipAddress?: string;
  sessionId?: string;
  status?: AuditStatus;
  severity?: AuditSeverity;
  category?: AuditCategory;
  publiclyVisible?: boolean;
}): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    eventType: params.eventType,
    userId: params.userId,
    action: params.action,
    resource: params.resource,
    resourceId: params.resourceId,
    resourceType: params.resourceType,
    changes: params.changes || [],
    beforeState: params.beforeState,
    afterState: params.afterState,
    ipAddress: params.ipAddress,
    sessionId: params.sessionId,
    status: params.status || AuditStatus.SUCCESS,
    severity: params.severity || AuditSeverity.INFO,
    category: params.category || AuditCategory.DATA_MANAGEMENT,
    tags: [],
    publiclyVisible: params.publiclyVisible ?? false,
    retentionYears: determineRetentionPeriod(params.eventType, params.category),
    hash: '',
    metadata: {},
  };

  entry.hash = generateAuditHash(entry);
  return entry;
}

/**
 * Generates cryptographic hash for audit log integrity
 */
export function generateAuditHash(entry: AuditLogEntry): string {
  const data = {
    id: entry.id,
    timestamp: entry.timestamp.toISOString(),
    userId: entry.userId,
    action: entry.action,
    resource: entry.resource,
    resourceId: entry.resourceId,
    changes: entry.changes,
  };

  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

/**
 * Verifies audit log integrity
 */
export function verifyAuditLogIntegrity(entry: AuditLogEntry): boolean {
  const expectedHash = generateAuditHash(entry);
  return entry.hash === expectedHash;
}

/**
 * Determines retention period based on event type
 */
export function determineRetentionPeriod(
  eventType: AuditEventType,
  category?: AuditCategory,
): number {
  const retentionMap: Record<string, number> = {
    [AuditEventType.FINANCIAL]: 7,
    [AuditEventType.SECURITY]: 10,
    [AuditEventType.COMPLIANCE]: 7,
    [AuditCategory.FINANCIAL_TRANSACTION]: 7,
    [AuditCategory.SECURITY_INCIDENT]: 10,
  };

  return retentionMap[eventType] || retentionMap[category || ''] || 3;
}

/**
 * Creates an audit log chain for tamper detection
 */
export function createAuditLogChain(
  entries: AuditLogEntry[],
  previousHash?: string,
): Array<AuditLogEntry & { chainHash: string }> {
  let currentHash = previousHash || '';

  return entries.map((entry) => {
    const chainData = {
      previousHash: currentHash,
      entryHash: entry.hash,
      timestamp: entry.timestamp.toISOString(),
    };

    currentHash = crypto.createHash('sha256').update(JSON.stringify(chainData)).digest('hex');

    return {
      ...entry,
      chainHash: currentHash,
    };
  });
}

/**
 * Verifies audit log chain integrity
 */
export function verifyAuditLogChain(
  chain: Array<AuditLogEntry & { chainHash: string }>,
  expectedFirstHash?: string,
): { valid: boolean; brokenAt?: number } {
  let previousHash = expectedFirstHash || '';

  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i];
    const chainData = {
      previousHash,
      entryHash: entry.hash,
      timestamp: entry.timestamp.toISOString(),
    };

    const expectedHash = crypto.createHash('sha256').update(JSON.stringify(chainData)).digest('hex');

    if (expectedHash !== entry.chainHash) {
      return { valid: false, brokenAt: i };
    }

    previousHash = entry.chainHash;
  }

  return { valid: true };
}

/**
 * Filters audit logs by criteria
 */
export function filterAuditLogs(
  logs: AuditLogEntry[],
  filters: Partial<AuditReportFilters>,
): AuditLogEntry[] {
  return logs.filter((log) => {
    if (filters.userIds && !filters.userIds.includes(log.userId)) return false;
    if (filters.eventTypes && !filters.eventTypes.includes(log.eventType)) return false;
    if (filters.actions && !filters.actions.includes(log.action)) return false;
    if (filters.severities && !filters.severities.includes(log.severity)) return false;
    if (filters.categories && !filters.categories.includes(log.category)) return false;
    if (filters.resourceTypes && !filters.resourceTypes.includes(log.resourceType)) return false;
    if (filters.dateRange) {
      if (log.timestamp < filters.dateRange.start || log.timestamp > filters.dateRange.end) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Redacts sensitive information from audit logs
 */
export function redactSensitiveAuditData(
  entry: AuditLogEntry,
  fieldsToRedact: string[] = ['ssn', 'password', 'token', 'secret'],
): AuditLogEntry {
  const redacted = { ...entry };

  if (redacted.changes) {
    redacted.changes = redacted.changes.map((change) => {
      if (fieldsToRedact.some((field) => change.field.toLowerCase().includes(field))) {
        return {
          ...change,
          oldValue: '***REDACTED***',
          newValue: '***REDACTED***',
        };
      }
      return change;
    });
  }

  if (redacted.beforeState) {
    redacted.beforeState = redactObject(redacted.beforeState, fieldsToRedact);
  }

  if (redacted.afterState) {
    redacted.afterState = redactObject(redacted.afterState, fieldsToRedact);
  }

  return redacted;
}

/**
 * Redacts sensitive fields from an object
 */
export function redactObject(obj: any, fieldsToRedact: string[]): any {
  if (typeof obj !== 'object' || obj === null) return obj;

  const redacted = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in redacted) {
    if (fieldsToRedact.some((field) => key.toLowerCase().includes(field))) {
      redacted[key] = '***REDACTED***';
    } else if (typeof redacted[key] === 'object') {
      redacted[key] = redactObject(redacted[key], fieldsToRedact);
    }
  }

  return redacted;
}

// ============================================================================
// CHANGE HISTORY TRACKING
// ============================================================================

/**
 * Creates a change history entry
 */
export function createChangeHistoryEntry(params: {
  entityType: string;
  entityId: string;
  version: number;
  changedBy: string;
  changeType: ChangeType;
  changes: ChangeRecord[];
  snapshot?: any;
  comment?: string;
  publiclyVisible?: boolean;
}): ChangeHistoryEntry {
  return {
    id: crypto.randomUUID(),
    entityType: params.entityType,
    entityId: params.entityId,
    version: params.version,
    changeDate: new Date(),
    changedBy: params.changedBy,
    changeType: params.changeType,
    changes: params.changes,
    snapshot: params.snapshot,
    comment: params.comment,
    publiclyVisible: params.publiclyVisible ?? false,
    metadata: {},
  };
}

/**
 * Tracks changes between two objects
 */
export function trackObjectChanges(
  oldObject: any,
  newObject: any,
  prefix: string = '',
): ChangeRecord[] {
  const changes: ChangeRecord[] = [];

  const allKeys = new Set([...Object.keys(oldObject || {}), ...Object.keys(newObject || {})]);

  allKeys.forEach((key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const oldValue = oldObject?.[key];
    const newValue = newObject?.[key];

    if (
      typeof oldValue === 'object' &&
      typeof newValue === 'object' &&
      !Array.isArray(oldValue) &&
      oldValue !== null &&
      newValue !== null
    ) {
      changes.push(...trackObjectChanges(oldValue, newValue, fullKey));
    } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes.push({
        field: fullKey,
        oldValue,
        newValue,
        dataType: typeof newValue,
        timestamp: new Date(),
      });
    }
  });

  return changes;
}

/**
 * Gets change history for an entity
 */
export function getEntityChangeHistory(
  allChanges: ChangeHistoryEntry[],
  entityType: string,
  entityId: string,
): ChangeHistoryEntry[] {
  return allChanges
    .filter((change) => change.entityType === entityType && change.entityId === entityId)
    .sort((a, b) => b.version - a.version);
}

/**
 * Reverts to a previous version
 */
export function revertToVersion(
  history: ChangeHistoryEntry[],
  targetVersion: number,
): { snapshot: any; changes: ChangeRecord[] } | null {
  const versionEntry = history.find((entry) => entry.version === targetVersion);
  if (!versionEntry || !versionEntry.snapshot) {
    return null;
  }

  return {
    snapshot: versionEntry.snapshot,
    changes: versionEntry.changes,
  };
}

/**
 * Compares two versions
 */
export function compareVersions(
  version1: ChangeHistoryEntry,
  version2: ChangeHistoryEntry,
): ChangeRecord[] {
  if (!version1.snapshot || !version2.snapshot) {
    return [];
  }

  return trackObjectChanges(version1.snapshot, version2.snapshot);
}

// ============================================================================
// USER ACTIVITY MONITORING
// ============================================================================

/**
 * Creates a user activity log
 */
export function createUserActivityLog(params: {
  userId: string;
  userName: string;
  sessionId: string;
  activityType: ActivityType;
  activityDescription: string;
  ipAddress: string;
  resourcesAccessed?: string[];
}): UserActivityLog {
  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    userName: params.userName,
    sessionId: params.sessionId,
    activityType: params.activityType,
    activityDescription: params.activityDescription,
    startTime: new Date(),
    resourcesAccessed: params.resourcesAccessed || [],
    actionsPerformed: 0,
    ipAddress: params.ipAddress,
    anomalyScore: 0,
    flaggedForReview: false,
    metadata: {},
  };
}

/**
 * Completes a user activity log
 */
export function completeUserActivityLog(
  activity: UserActivityLog,
  actionsPerformed: number,
): UserActivityLog {
  const endTime = new Date();
  const duration = endTime.getTime() - activity.startTime.getTime();

  return {
    ...activity,
    endTime,
    duration,
    actionsPerformed,
  };
}

/**
 * Calculates anomaly score for user activity
 */
export function calculateActivityAnomalyScore(activity: UserActivityLog): number {
  let score = 0;

  // Unusual time (late night/early morning)
  const hour = activity.startTime.getHours();
  if (hour < 6 || hour > 22) score += 20;

  // High number of actions
  if (activity.actionsPerformed > 100) score += 15;

  // Long session duration (over 8 hours)
  if (activity.duration && activity.duration > 8 * 60 * 60 * 1000) score += 10;

  // Many resources accessed
  if (activity.resourcesAccessed.length > 50) score += 15;

  return score;
}

/**
 * Flags suspicious user activity
 */
export function flagSuspiciousActivity(activity: UserActivityLog): UserActivityLog {
  const anomalyScore = calculateActivityAnomalyScore(activity);

  return {
    ...activity,
    anomalyScore,
    flaggedForReview: anomalyScore > 30,
  };
}

/**
 * Gets activities by user
 */
export function getUserActivities(
  activities: UserActivityLog[],
  userId: string,
  dateRange?: { start: Date; end: Date },
): UserActivityLog[] {
  return activities.filter((activity) => {
    if (activity.userId !== userId) return false;
    if (dateRange) {
      if (activity.startTime < dateRange.start || activity.startTime > dateRange.end) {
        return false;
      }
    }
    return true;
  });
}

// ============================================================================
// TRANSACTION AUDIT TRAILS
// ============================================================================

/**
 * Creates a transaction audit trail
 */
export function createTransactionAuditTrail(params: {
  transactionId: string;
  transactionType: string;
  initiatedBy: string;
  totalAmount?: number;
  currency?: string;
  publicRecord?: boolean;
}): TransactionAuditTrail {
  return {
    id: crypto.randomUUID(),
    transactionId: params.transactionId,
    transactionType: params.transactionType,
    initiatedBy: params.initiatedBy,
    initiatedAt: new Date(),
    status: TransactionStatus.INITIATED,
    steps: [],
    totalAmount: params.totalAmount,
    currency: params.currency,
    approvalChain: [],
    publicRecord: params.publicRecord ?? false,
    appealFiled: false,
    metadata: {},
  };
}

/**
 * Adds a step to transaction trail
 */
export function addTransactionStep(
  trail: TransactionAuditTrail,
  step: TransactionStep,
): TransactionAuditTrail {
  return {
    ...trail,
    steps: [...trail.steps, step],
  };
}

/**
 * Adds approval to transaction
 */
export function addTransactionApproval(
  trail: TransactionAuditTrail,
  approval: ApprovalRecord,
): TransactionAuditTrail {
  return {
    ...trail,
    approvalChain: [...(trail.approvalChain || []), approval],
  };
}

/**
 * Completes a transaction
 */
export function completeTransaction(
  trail: TransactionAuditTrail,
  success: boolean,
): TransactionAuditTrail {
  return {
    ...trail,
    completedAt: new Date(),
    status: success ? TransactionStatus.COMPLETED : TransactionStatus.FAILED,
  };
}

/**
 * Checks if transaction requires approval
 */
export function requiresApproval(
  trail: TransactionAuditTrail,
  approvalThreshold: number,
): boolean {
  if (!trail.totalAmount) return false;
  return trail.totalAmount >= approvalThreshold;
}

/**
 * Gets pending approvals
 */
export function getPendingApprovals(trail: TransactionAuditTrail): ApprovalRecord[] {
  return (trail.approvalChain || []).filter((approval) => approval.decision === 'pending');
}

// ============================================================================
// DATA ACCESS LOGGING
// ============================================================================

/**
 * Creates a data access log
 */
export function createDataAccessLog(params: {
  userId: string;
  userName: string;
  accessType: AccessType;
  dataCategory: string;
  dataClassification: DataClassification;
  recordsAccessed: number;
  specificRecordIds?: string[];
  accessPurpose?: string;
  approved?: boolean;
}): DataAccessLog {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    userId: params.userId,
    userName: params.userName,
    accessType: params.accessType,
    dataCategory: params.dataCategory,
    dataClassification: params.dataClassification,
    recordsAccessed: params.recordsAccessed,
    specificRecordIds: params.specificRecordIds,
    accessPurpose: params.accessPurpose,
    approved: params.approved ?? true,
    dataExported: false,
    sensitivityScore: calculateSensitivityScore(params.dataClassification, params.recordsAccessed),
    metadata: {},
  };
}

/**
 * Calculates sensitivity score for data access
 */
export function calculateSensitivityScore(
  classification: DataClassification,
  recordsAccessed: number,
): number {
  const classificationScores = {
    [DataClassification.PUBLIC]: 1,
    [DataClassification.INTERNAL]: 2,
    [DataClassification.CONFIDENTIAL]: 3,
    [DataClassification.RESTRICTED]: 4,
    [DataClassification.SECRET]: 5,
  };

  const baseScore = classificationScores[classification] || 1;
  const volumeMultiplier = recordsAccessed > 1000 ? 2 : recordsAccessed > 100 ? 1.5 : 1;

  return baseScore * volumeMultiplier * 10;
}

/**
 * Marks data as exported
 */
export function markDataExported(
  log: DataAccessLog,
  exportFormat: string,
): DataAccessLog {
  return {
    ...log,
    dataExported: true,
    exportFormat,
  };
}

/**
 * Gets high-sensitivity access logs
 */
export function getHighSensitivityAccess(
  logs: DataAccessLog[],
  threshold: number = 30,
): DataAccessLog[] {
  return logs.filter((log) => log.sensitivityScore >= threshold);
}

// ============================================================================
// TRANSPARENCY PORTAL INTEGRATION
// ============================================================================

/**
 * Creates a transparency record
 */
export function createTransparencyRecord(params: {
  recordType: TransparencyRecordType;
  title: string;
  description: string;
  fiscalYear?: string;
  department: string;
  category: string;
  data: any;
  format?: RecordFormat;
  accessLevel?: AccessLevel;
}): TransparencyRecord {
  return {
    id: crypto.randomUUID(),
    recordType: params.recordType,
    title: params.title,
    description: params.description,
    publishDate: new Date(),
    lastUpdated: new Date(),
    fiscalYear: params.fiscalYear,
    department: params.department,
    category: params.category,
    data: params.data,
    attachments: [],
    format: params.format || RecordFormat.JSON,
    accessLevel: params.accessLevel || AccessLevel.PUBLIC,
    downloadCount: 0,
    viewCount: 0,
    tags: [],
    metadata: {},
  };
}

/**
 * Increments record view count
 */
export function incrementViewCount(record: TransparencyRecord): TransparencyRecord {
  return {
    ...record,
    viewCount: record.viewCount + 1,
  };
}

/**
 * Increments record download count
 */
export function incrementDownloadCount(record: TransparencyRecord): TransparencyRecord {
  return {
    ...record,
    downloadCount: record.downloadCount + 1,
  };
}

/**
 * Adds tags to transparency record
 */
export function addRecordTags(record: TransparencyRecord, tags: string[]): TransparencyRecord {
  return {
    ...record,
    tags: [...new Set([...record.tags, ...tags])],
  };
}

/**
 * Filters transparency records by access level
 */
export function filterByAccessLevel(
  records: TransparencyRecord[],
  userAccessLevel: AccessLevel,
): TransparencyRecord[] {
  const accessHierarchy = {
    [AccessLevel.PUBLIC]: 1,
    [AccessLevel.REGISTERED_USERS]: 2,
    [AccessLevel.GOVERNMENT_ONLY]: 3,
    [AccessLevel.RESTRICTED]: 4,
  };

  const userLevel = accessHierarchy[userAccessLevel];

  return records.filter((record) => accessHierarchy[record.accessLevel] <= userLevel);
}

// ============================================================================
// PUBLIC RECORDS MANAGEMENT
// ============================================================================

/**
 * Creates a public record
 */
export function createPublicRecord(params: {
  recordNumber: string;
  title: string;
  description: string;
  recordType: string;
  retentionSchedule: string;
  retentionYears: number;
  format: RecordFormat;
  sizeBytes: number;
  publiclyAvailable?: boolean;
  redactionRequired?: boolean;
}): PublicRecord {
  const content = JSON.stringify(params);
  const checksum = crypto.createHash('sha256').update(content).digest('hex');

  return {
    id: crypto.randomUUID(),
    recordNumber: params.recordNumber,
    title: params.title,
    description: params.description,
    recordType: params.recordType,
    createdDate: new Date(),
    modifiedDate: new Date(),
    retentionSchedule: params.retentionSchedule,
    retentionYears: params.retentionYears,
    legalHold: false,
    archiveStatus: ArchiveStatus.ACTIVE,
    format: params.format,
    sizeBytes: params.sizeBytes,
    checksum,
    publiclyAvailable: params.publiclyAvailable ?? false,
    redactionRequired: params.redactionRequired ?? false,
    metadata: {},
  };
}

/**
 * Applies legal hold to record
 */
export function applyLegalHold(record: PublicRecord): PublicRecord {
  return {
    ...record,
    legalHold: true,
  };
}

/**
 * Releases legal hold from record
 */
export function releaseLegalHold(record: PublicRecord): PublicRecord {
  return {
    ...record,
    legalHold: false,
  };
}

/**
 * Archives a public record
 */
export function archivePublicRecord(
  record: PublicRecord,
  archiveLocation: string,
): PublicRecord {
  return {
    ...record,
    archiveStatus: ArchiveStatus.ARCHIVED,
    archiveLocation,
    modifiedDate: new Date(),
  };
}

/**
 * Checks if record is eligible for disposal
 */
export function isEligibleForDisposal(
  record: PublicRecord,
  currentDate: Date = new Date(),
): boolean {
  if (record.legalHold) return false;
  if (record.archiveStatus === ArchiveStatus.PERMANENTLY_RETAINED) return false;

  const retentionEndDate = new Date(record.createdDate);
  retentionEndDate.setFullYear(retentionEndDate.getFullYear() + record.retentionYears);

  return currentDate >= retentionEndDate;
}

// ============================================================================
// FOIA REQUEST TRACKING
// ============================================================================

/**
 * Creates a FOIA request
 */
export function createFOIARequest(params: {
  requesterName: string;
  requesterEmail: string;
  requestDescription: string;
  requestCategory: FOIACategory;
  priority?: RequestPriority;
}): FOIARequest {
  const requestNumber = generateFOIARequestNumber();
  const dueDate = calculateFOIADueDate(params.priority);

  return {
    id: crypto.randomUUID(),
    requestNumber,
    requestDate: new Date(),
    requesterName: params.requesterName,
    requesterEmail: params.requesterEmail,
    requesterOrganization: undefined,
    requestDescription: params.requestDescription,
    requestCategory: params.requestCategory,
    priority: params.priority || RequestPriority.STANDARD,
    status: FOIAStatus.RECEIVED,
    dueDate,
    extensions: [],
    processingTrack: ProcessingTrack.SIMPLE,
    appealFiled: false,
    publicationRequired: false,
    metadata: {},
  };
}

/**
 * Generates a FOIA request number
 */
export function generateFOIARequestNumber(): string {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `FOIA-${year}-${random}`;
}

/**
 * Calculates FOIA due date based on priority
 */
export function calculateFOIADueDate(priority: RequestPriority = RequestPriority.STANDARD): Date {
  const dueDate = new Date();

  switch (priority) {
    case RequestPriority.EXPEDITED:
      dueDate.setDate(dueDate.getDate() + 10);
      break;
    case RequestPriority.STANDARD:
      dueDate.setDate(dueDate.getDate() + 20);
      break;
    case RequestPriority.COMPLEX:
      dueDate.setDate(dueDate.getDate() + 40);
      break;
  }

  return dueDate;
}

/**
 * Assigns FOIA request to processor
 */
export function assignFOIARequest(request: FOIARequest, assignedTo: string): FOIARequest {
  return {
    ...request,
    assignedTo,
    status: FOIAStatus.IN_REVIEW,
  };
}

/**
 * Requests FOIA extension
 */
export function requestFOIAExtension(
  request: FOIARequest,
  additionalDays: number,
  reason: string,
): FOIARequest {
  const extension: RequestExtension = {
    requestedDate: new Date(),
    additionalDays,
    reason,
    newDueDate: new Date(request.dueDate.getTime() + additionalDays * 24 * 60 * 60 * 1000),
  };

  return {
    ...request,
    extensions: [...(request.extensions || []), extension],
  };
}

/**
 * Approves FOIA extension
 */
export function approveFOIAExtension(request: FOIARequest, extensionIndex: number): FOIARequest {
  const updatedExtensions = [...(request.extensions || [])];
  if (updatedExtensions[extensionIndex]) {
    updatedExtensions[extensionIndex] = {
      ...updatedExtensions[extensionIndex],
      approvedDate: new Date(),
    };

    return {
      ...request,
      extensions: updatedExtensions,
      dueDate: updatedExtensions[extensionIndex].newDueDate,
    };
  }

  return request;
}

/**
 * Fulfills FOIA request
 */
export function fulfillFOIARequest(
  request: FOIARequest,
  recordsProvided: number,
  response: string,
): FOIARequest {
  return {
    ...request,
    status: FOIAStatus.FULFILLED,
    recordsProvided,
    response,
    responseDate: new Date(),
    closedDate: new Date(),
  };
}

/**
 * Applies FOIA exemptions
 */
export function applyFOIAExemptions(
  request: FOIARequest,
  exemptions: FOIAExemption[],
): FOIARequest {
  return {
    ...request,
    exemptionsApplied: [...new Set([...(request.exemptionsApplied || []), ...exemptions])],
  };
}

/**
 * Gets overdue FOIA requests
 */
export function getOverdueFOIARequests(
  requests: FOIARequest[],
  currentDate: Date = new Date(),
): FOIARequest[] {
  return requests.filter(
    (request) =>
      ![FOIAStatus.FULFILLED, FOIAStatus.DENIED, FOIAStatus.WITHDRAWN].includes(request.status) &&
      request.dueDate < currentDate,
  );
}

// ============================================================================
// AUDIT REPORT GENERATION
// ============================================================================

/**
 * Creates an audit report
 */
export function createAuditReport(params: {
  reportType: AuditReportType;
  title: string;
  reportPeriodStart: Date;
  reportPeriodEnd: Date;
  generatedBy: string;
  scope: string[];
  filters: AuditReportFilters;
}): AuditReport {
  return {
    id: crypto.randomUUID(),
    reportType: params.reportType,
    title: params.title,
    reportPeriodStart: params.reportPeriodStart,
    reportPeriodEnd: params.reportPeriodEnd,
    generatedDate: new Date(),
    generatedBy: params.generatedBy,
    scope: params.scope,
    filters: params.filters,
    summary: {
      totalEvents: 0,
      uniqueUsers: 0,
      successfulEvents: 0,
      failedEvents: 0,
      criticalEvents: 0,
      topUsers: [],
      topActions: [],
      timeDistribution: {},
    },
    findings: [],
    recommendations: [],
    data: {},
    format: RecordFormat.PDF,
    confidentialityLevel: DataClassification.INTERNAL,
    metadata: {},
  };
}

/**
 * Generates audit report summary
 */
export function generateAuditReportSummary(logs: AuditLogEntry[]): AuditReportSummary {
  const uniqueUsers = new Set(logs.map((log) => log.userId)).size;
  const successfulEvents = logs.filter((log) => log.status === AuditStatus.SUCCESS).length;
  const failedEvents = logs.filter((log) => log.status === AuditStatus.FAILURE).length;
  const criticalEvents = logs.filter((log) => log.severity === AuditSeverity.CRITICAL).length;

  const userCounts = logs.reduce((acc, log) => {
    acc[log.userId] = (acc[log.userId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topUsers = Object.entries(userCounts)
    .map(([userId, eventCount]) => ({ userId, eventCount }))
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, 10);

  const actionCounts = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topActions = Object.entries(actionCounts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const timeDistribution = logs.reduce((acc, log) => {
    const hour = log.timestamp.getHours();
    acc[`${hour}:00`] = (acc[`${hour}:00`] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalEvents: logs.length,
    uniqueUsers,
    successfulEvents,
    failedEvents,
    criticalEvents,
    topUsers,
    topActions,
    timeDistribution,
  };
}

/**
 * Adds finding to audit report
 */
export function addAuditFinding(report: AuditReport, finding: AuditFinding): AuditReport {
  return {
    ...report,
    findings: [...report.findings, finding],
  };
}

// ============================================================================
// AUDIT EVIDENCE COLLECTION
// ============================================================================

/**
 * Creates audit evidence
 */
export function createAuditEvidence(params: {
  evidenceType: EvidenceType;
  collectedBy: string;
  description: string;
  source: string;
  dataSnapshot: any;
  relatedAuditId?: string;
  relatedFindingId?: string;
}): AuditEvidence {
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(params.dataSnapshot))
    .digest('hex');

  return {
    id: crypto.randomUUID(),
    evidenceType: params.evidenceType,
    collectionDate: new Date(),
    collectedBy: params.collectedBy,
    relatedAuditId: params.relatedAuditId,
    relatedFindingId: params.relatedFindingId,
    description: params.description,
    source: params.source,
    dataSnapshot: params.dataSnapshot,
    attachments: [],
    hash,
    chainOfCustody: [
      {
        timestamp: new Date(),
        custodian: params.collectedBy,
        action: 'collected',
      },
    ],
    verified: false,
    metadata: {},
  };
}

/**
 * Adds custody record to evidence
 */
export function addCustodyRecord(
  evidence: AuditEvidence,
  custodyRecord: CustodyRecord,
): AuditEvidence {
  return {
    ...evidence,
    chainOfCustody: [...evidence.chainOfCustody, custodyRecord],
  };
}

/**
 * Verifies audit evidence
 */
export function verifyAuditEvidence(
  evidence: AuditEvidence,
  verifiedBy: string,
): AuditEvidence {
  return {
    ...evidence,
    verified: true,
    verifiedBy,
    verificationDate: new Date(),
  };
}

// ============================================================================
// TRANSPARENCY REPORTING
// ============================================================================

/**
 * Generates transparency metrics
 */
export function generateTransparencyMetrics(params: {
  transparencyRecords: TransparencyRecord[];
  foiaRequests: FOIARequest[];
}): TransparencyMetrics {
  const currentMonth = new Date();
  currentMonth.setDate(1);

  const recordsThisMonth = params.transparencyRecords.filter(
    (record) => record.publishDate >= currentMonth,
  ).length;

  const totalDownloads = params.transparencyRecords.reduce(
    (sum, record) => sum + record.downloadCount,
    0,
  );
  const totalViews = params.transparencyRecords.reduce((sum, record) => sum + record.viewCount, 0);

  const openFOIA = params.foiaRequests.filter(
    (request) =>
      ![FOIAStatus.FULFILLED, FOIAStatus.DENIED, FOIAStatus.WITHDRAWN].includes(request.status),
  ).length;

  const fulfilledRequests = params.foiaRequests.filter(
    (request) => request.status === FOIAStatus.FULFILLED && request.responseDate,
  );

  const avgResponseDays =
    fulfilledRequests.length > 0
      ? fulfilledRequests.reduce((sum, request) => {
          const days = Math.ceil(
            (request.responseDate!.getTime() - request.requestDate.getTime()) /
              (1000 * 60 * 60 * 24),
          );
          return sum + days;
        }, 0) / fulfilledRequests.length
      : 0;

  const fulfillmentRate =
    params.foiaRequests.length > 0
      ? (fulfilledRequests.length / params.foiaRequests.length) * 100
      : 0;

  const mostAccessed = params.transparencyRecords
    .sort((a, b) => b.downloadCount + b.viewCount - (a.downloadCount + a.viewCount))
    .slice(0, 10)
    .map((record) => ({
      recordId: record.id,
      title: record.title,
      accessCount: record.downloadCount + record.viewCount,
    }));

  const categoryBreakdown = params.transparencyRecords.reduce((acc, record) => {
    acc[record.category] = (acc[record.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalPublicRecords: params.transparencyRecords.length,
    recordsPublishedThisMonth: recordsThisMonth,
    totalDownloads,
    totalViews,
    openFOIARequests: openFOIA,
    averageFOIAResponseDays: avgResponseDays,
    foiaFulfillmentRate: fulfillmentRate,
    mostAccessedRecords: mostAccessed,
    categoryBreakdown,
  };
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

/**
 * Sequelize model for AuditLogEntry
 */
export const AuditLogEntryModel = {
  tableName: 'audit_log_entries',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    timestamp: { type: 'DATE', allowNull: false },
    eventType: { type: 'ENUM', values: Object.values(AuditEventType) },
    userId: { type: 'STRING', allowNull: false },
    userName: { type: 'STRING', allowNull: true },
    userRole: { type: 'STRING', allowNull: true },
    departmentId: { type: 'UUID', allowNull: true },
    action: { type: 'ENUM', values: Object.values(AuditAction) },
    resource: { type: 'STRING', allowNull: false },
    resourceId: { type: 'STRING', allowNull: true },
    resourceType: { type: 'STRING', allowNull: false },
    changes: { type: 'JSON', defaultValue: [] },
    beforeState: { type: 'JSON', allowNull: true },
    afterState: { type: 'JSON', allowNull: true },
    metadata: { type: 'JSON', defaultValue: {} },
    ipAddress: { type: 'STRING', allowNull: true },
    userAgent: { type: 'TEXT', allowNull: true },
    sessionId: { type: 'STRING', allowNull: true },
    requestId: { type: 'STRING', allowNull: true },
    status: { type: 'ENUM', values: Object.values(AuditStatus) },
    severity: { type: 'ENUM', values: Object.values(AuditSeverity) },
    category: { type: 'ENUM', values: Object.values(AuditCategory) },
    tags: { type: 'JSON', defaultValue: [] },
    publiclyVisible: { type: 'BOOLEAN', defaultValue: false },
    retentionYears: { type: 'INTEGER', allowNull: false },
    hash: { type: 'STRING', allowNull: false },
    chainHash: { type: 'STRING', allowNull: true },
  },
  indexes: [
    { fields: ['timestamp'] },
    { fields: ['userId'] },
    { fields: ['eventType'] },
    { fields: ['action'] },
    { fields: ['resourceType'] },
    { fields: ['severity'] },
    { fields: ['category'] },
    { fields: ['sessionId'] },
  ],
};

/**
 * Sequelize model for TransparencyRecord
 */
export const TransparencyRecordModel = {
  tableName: 'transparency_records',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    recordType: { type: 'ENUM', values: Object.values(TransparencyRecordType) },
    title: { type: 'STRING', allowNull: false },
    description: { type: 'TEXT', allowNull: false },
    publishDate: { type: 'DATE', allowNull: false },
    lastUpdated: { type: 'DATE', allowNull: false },
    fiscalYear: { type: 'STRING', allowNull: true },
    department: { type: 'STRING', allowNull: false },
    category: { type: 'STRING', allowNull: false },
    data: { type: 'JSON', allowNull: false },
    attachments: { type: 'JSON', defaultValue: [] },
    format: { type: 'ENUM', values: Object.values(RecordFormat) },
    accessLevel: { type: 'ENUM', values: Object.values(AccessLevel) },
    downloadCount: { type: 'INTEGER', defaultValue: 0 },
    viewCount: { type: 'INTEGER', defaultValue: 0 },
    tags: { type: 'JSON', defaultValue: [] },
    relatedRecords: { type: 'JSON', defaultValue: [] },
    dataQualityScore: { type: 'FLOAT', allowNull: true },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['recordType'] },
    { fields: ['department'] },
    { fields: ['category'] },
    { fields: ['publishDate'] },
    { fields: ['accessLevel'] },
  ],
};

/**
 * Sequelize model for FOIARequest
 */
export const FOIARequestModel = {
  tableName: 'foia_requests',
  columns: {
    id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
    requestNumber: { type: 'STRING', allowNull: false, unique: true },
    requestDate: { type: 'DATE', allowNull: false },
    requesterName: { type: 'STRING', allowNull: false },
    requesterEmail: { type: 'STRING', allowNull: false },
    requesterOrganization: { type: 'STRING', allowNull: true },
    requestDescription: { type: 'TEXT', allowNull: false },
    requestCategory: { type: 'ENUM', values: Object.values(FOIACategory) },
    priority: { type: 'ENUM', values: Object.values(RequestPriority) },
    status: { type: 'ENUM', values: Object.values(FOIAStatus) },
    assignedTo: { type: 'STRING', allowNull: true },
    dueDate: { type: 'DATE', allowNull: false },
    extensions: { type: 'JSON', defaultValue: [] },
    estimatedPages: { type: 'INTEGER', allowNull: true },
    estimatedCost: { type: 'DECIMAL', allowNull: true },
    feesPaid: { type: 'DECIMAL', allowNull: true },
    processingTrack: { type: 'ENUM', values: Object.values(ProcessingTrack) },
    recordsIdentified: { type: 'INTEGER', allowNull: true },
    recordsProvided: { type: 'INTEGER', allowNull: true },
    exemptionsApplied: { type: 'JSON', defaultValue: [] },
    response: { type: 'TEXT', allowNull: true },
    responseDate: { type: 'DATE', allowNull: true },
    closedDate: { type: 'DATE', allowNull: true },
    appealFiled: { type: 'BOOLEAN', defaultValue: false },
    appealDate: { type: 'DATE', allowNull: true },
    publicationRequired: { type: 'BOOLEAN', defaultValue: false },
    metadata: { type: 'JSON', defaultValue: {} },
  },
  indexes: [
    { fields: ['requestNumber'] },
    { fields: ['requestDate'] },
    { fields: ['status'] },
    { fields: ['dueDate'] },
    { fields: ['assignedTo'] },
  ],
};

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

/**
 * Example NestJS service for audit and transparency
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class AuditTransparencyService {
 *   async logAuditEvent(dto: CreateAuditLogDto): Promise<AuditLogEntry> {
 *     const entry = createAuditLogEntry(dto);
 *     return this.auditRepo.save(entry);
 *   }
 *
 *   async getTransparencyMetrics(): Promise<TransparencyMetrics> {
 *     const records = await this.transparencyRepo.find();
 *     const requests = await this.foiaRepo.find();
 *     return generateTransparencyMetrics({ transparencyRecords: records, foiaRequests: requests });
 *   }
 * }
 * ```
 */
export const AuditTransparencyServiceExample = `
@Injectable()
export class AuditTransparencyService {
  constructor(
    @InjectModel(AuditLogEntryModel)
    private auditRepo: Repository<AuditLogEntry>,
    @InjectModel(TransparencyRecordModel)
    private transparencyRepo: Repository<TransparencyRecord>,
    @InjectModel(FOIARequestModel)
    private foiaRepo: Repository<FOIARequest>,
  ) {}

  async createAuditChain(entries: AuditLogEntry[]): Promise<AuditLogEntry[]> {
    const chain = createAuditLogChain(entries);
    return this.auditRepo.save(chain);
  }

  async verifyAuditIntegrity(entryId: string): Promise<boolean> {
    const entry = await this.auditRepo.findOne({ where: { id: entryId } });
    return verifyAuditLogIntegrity(entry);
  }
}
`;

// ============================================================================
// SWAGGER API SCHEMA DEFINITIONS
// ============================================================================

/**
 * Swagger DTO for creating audit log
 */
export const CreateAuditLogDto = {
  schema: {
    type: 'object',
    required: ['eventType', 'userId', 'action', 'resource', 'resourceType'],
    properties: {
      eventType: { type: 'string', enum: Object.values(AuditEventType) },
      userId: { type: 'string', example: 'user-123' },
      action: { type: 'string', enum: Object.values(AuditAction) },
      resource: { type: 'string', example: 'Contract' },
      resourceId: { type: 'string', example: 'contract-456' },
      resourceType: { type: 'string', example: 'GovernmentContract' },
      ipAddress: { type: 'string', example: '192.168.1.1' },
      sessionId: { type: 'string', example: 'session-789' },
      publiclyVisible: { type: 'boolean', default: false },
    },
  },
};

/**
 * Swagger DTO for creating FOIA request
 */
export const CreateFOIARequestDto = {
  schema: {
    type: 'object',
    required: ['requesterName', 'requesterEmail', 'requestDescription', 'requestCategory'],
    properties: {
      requesterName: { type: 'string', example: 'John Doe' },
      requesterEmail: { type: 'string', format: 'email', example: 'john@example.com' },
      requesterOrganization: { type: 'string', example: 'Example News Corp' },
      requestDescription: { type: 'string', example: 'Requesting all contracts awarded in 2024' },
      requestCategory: { type: 'string', enum: Object.values(FOIACategory) },
      priority: { type: 'string', enum: Object.values(RequestPriority) },
    },
  },
};

/**
 * Swagger response for transparency metrics
 */
export const TransparencyMetricsResponse = {
  schema: {
    type: 'object',
    properties: {
      totalPublicRecords: { type: 'number', example: 1250 },
      recordsPublishedThisMonth: { type: 'number', example: 45 },
      totalDownloads: { type: 'number', example: 8750 },
      totalViews: { type: 'number', example: 15230 },
      openFOIARequests: { type: 'number', example: 23 },
      averageFOIAResponseDays: { type: 'number', example: 18.5 },
      foiaFulfillmentRate: { type: 'number', example: 94.2 },
      mostAccessedRecords: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            recordId: { type: 'string' },
            title: { type: 'string' },
            accessCount: { type: 'number' },
          },
        },
      },
      categoryBreakdown: {
        type: 'object',
        additionalProperties: { type: 'number' },
      },
    },
  },
};
