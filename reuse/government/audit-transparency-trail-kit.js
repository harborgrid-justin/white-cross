"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransparencyMetricsResponse = exports.CreateFOIARequestDto = exports.CreateAuditLogDto = exports.AuditTransparencyServiceExample = exports.FOIARequestModel = exports.TransparencyRecordModel = exports.AuditLogEntryModel = exports.EvidenceType = exports.AuditReportType = exports.FOIAExemption = exports.ProcessingTrack = exports.FOIAStatus = exports.RequestPriority = exports.FOIACategory = exports.ArchiveStatus = exports.AccessLevel = exports.RecordFormat = exports.TransparencyRecordType = exports.DataClassification = exports.AccessType = exports.TransactionStatus = exports.ActivityType = exports.ChangeType = exports.AuditCategory = exports.AuditSeverity = exports.AuditStatus = exports.AuditAction = exports.AuditEventType = void 0;
exports.createAuditLogEntry = createAuditLogEntry;
exports.generateAuditHash = generateAuditHash;
exports.verifyAuditLogIntegrity = verifyAuditLogIntegrity;
exports.determineRetentionPeriod = determineRetentionPeriod;
exports.createAuditLogChain = createAuditLogChain;
exports.verifyAuditLogChain = verifyAuditLogChain;
exports.filterAuditLogs = filterAuditLogs;
exports.redactSensitiveAuditData = redactSensitiveAuditData;
exports.redactObject = redactObject;
exports.createChangeHistoryEntry = createChangeHistoryEntry;
exports.trackObjectChanges = trackObjectChanges;
exports.getEntityChangeHistory = getEntityChangeHistory;
exports.revertToVersion = revertToVersion;
exports.compareVersions = compareVersions;
exports.createUserActivityLog = createUserActivityLog;
exports.completeUserActivityLog = completeUserActivityLog;
exports.calculateActivityAnomalyScore = calculateActivityAnomalyScore;
exports.flagSuspiciousActivity = flagSuspiciousActivity;
exports.getUserActivities = getUserActivities;
exports.createTransactionAuditTrail = createTransactionAuditTrail;
exports.addTransactionStep = addTransactionStep;
exports.addTransactionApproval = addTransactionApproval;
exports.completeTransaction = completeTransaction;
exports.requiresApproval = requiresApproval;
exports.getPendingApprovals = getPendingApprovals;
exports.createDataAccessLog = createDataAccessLog;
exports.calculateSensitivityScore = calculateSensitivityScore;
exports.markDataExported = markDataExported;
exports.getHighSensitivityAccess = getHighSensitivityAccess;
exports.createTransparencyRecord = createTransparencyRecord;
exports.incrementViewCount = incrementViewCount;
exports.incrementDownloadCount = incrementDownloadCount;
exports.addRecordTags = addRecordTags;
exports.filterByAccessLevel = filterByAccessLevel;
exports.createPublicRecord = createPublicRecord;
exports.applyLegalHold = applyLegalHold;
exports.releaseLegalHold = releaseLegalHold;
exports.archivePublicRecord = archivePublicRecord;
exports.isEligibleForDisposal = isEligibleForDisposal;
exports.createFOIARequest = createFOIARequest;
exports.generateFOIARequestNumber = generateFOIARequestNumber;
exports.calculateFOIADueDate = calculateFOIADueDate;
exports.assignFOIARequest = assignFOIARequest;
exports.requestFOIAExtension = requestFOIAExtension;
exports.approveFOIAExtension = approveFOIAExtension;
exports.fulfillFOIARequest = fulfillFOIARequest;
exports.applyFOIAExemptions = applyFOIAExemptions;
exports.getOverdueFOIARequests = getOverdueFOIARequests;
exports.createAuditReport = createAuditReport;
exports.generateAuditReportSummary = generateAuditReportSummary;
exports.addAuditFinding = addAuditFinding;
exports.createAuditEvidence = createAuditEvidence;
exports.addCustodyRecord = addCustodyRecord;
exports.verifyAuditEvidence = verifyAuditEvidence;
exports.generateTransparencyMetrics = generateTransparencyMetrics;
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
const crypto = __importStar(require("crypto"));
/**
 * Audit event types
 */
var AuditEventType;
(function (AuditEventType) {
    AuditEventType["USER_ACTION"] = "USER_ACTION";
    AuditEventType["SYSTEM_EVENT"] = "SYSTEM_EVENT";
    AuditEventType["DATA_ACCESS"] = "DATA_ACCESS";
    AuditEventType["DATA_MODIFICATION"] = "DATA_MODIFICATION";
    AuditEventType["ADMINISTRATIVE"] = "ADMINISTRATIVE";
    AuditEventType["SECURITY"] = "SECURITY";
    AuditEventType["COMPLIANCE"] = "COMPLIANCE";
    AuditEventType["FINANCIAL"] = "FINANCIAL";
    AuditEventType["PUBLIC_REQUEST"] = "PUBLIC_REQUEST";
})(AuditEventType || (exports.AuditEventType = AuditEventType = {}));
/**
 * Audit actions
 */
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["READ"] = "READ";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["SEARCH"] = "SEARCH";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["IMPORT"] = "IMPORT";
    AuditAction["DOWNLOAD"] = "DOWNLOAD";
    AuditAction["PRINT"] = "PRINT";
    AuditAction["SHARE"] = "SHARE";
    AuditAction["APPROVE"] = "APPROVE";
    AuditAction["REJECT"] = "REJECT";
    AuditAction["SUBMIT"] = "SUBMIT";
    AuditAction["REVIEW"] = "REVIEW";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["ACCESS_GRANTED"] = "ACCESS_GRANTED";
    AuditAction["ACCESS_DENIED"] = "ACCESS_DENIED";
    AuditAction["PERMISSION_CHANGED"] = "PERMISSION_CHANGED";
    AuditAction["CONFIG_CHANGED"] = "CONFIG_CHANGED";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
/**
 * Audit status
 */
var AuditStatus;
(function (AuditStatus) {
    AuditStatus["SUCCESS"] = "SUCCESS";
    AuditStatus["FAILURE"] = "FAILURE";
    AuditStatus["PARTIAL"] = "PARTIAL";
    AuditStatus["PENDING"] = "PENDING";
    AuditStatus["ERROR"] = "ERROR";
})(AuditStatus || (exports.AuditStatus = AuditStatus = {}));
/**
 * Audit severity levels
 */
var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["INFO"] = "INFO";
    AuditSeverity["LOW"] = "LOW";
    AuditSeverity["MEDIUM"] = "MEDIUM";
    AuditSeverity["HIGH"] = "HIGH";
    AuditSeverity["CRITICAL"] = "CRITICAL";
})(AuditSeverity || (exports.AuditSeverity = AuditSeverity = {}));
/**
 * Audit categories
 */
var AuditCategory;
(function (AuditCategory) {
    AuditCategory["ACCESS_CONTROL"] = "ACCESS_CONTROL";
    AuditCategory["DATA_MANAGEMENT"] = "DATA_MANAGEMENT";
    AuditCategory["FINANCIAL_TRANSACTION"] = "FINANCIAL_TRANSACTION";
    AuditCategory["SYSTEM_ADMINISTRATION"] = "SYSTEM_ADMINISTRATION";
    AuditCategory["SECURITY_INCIDENT"] = "SECURITY_INCIDENT";
    AuditCategory["POLICY_COMPLIANCE"] = "POLICY_COMPLIANCE";
    AuditCategory["PUBLIC_DISCLOSURE"] = "PUBLIC_DISCLOSURE";
    AuditCategory["RECORDS_MANAGEMENT"] = "RECORDS_MANAGEMENT";
})(AuditCategory || (exports.AuditCategory = AuditCategory = {}));
/**
 * Change types
 */
var ChangeType;
(function (ChangeType) {
    ChangeType["CREATED"] = "CREATED";
    ChangeType["MODIFIED"] = "MODIFIED";
    ChangeType["DELETED"] = "DELETED";
    ChangeType["RESTORED"] = "RESTORED";
    ChangeType["ARCHIVED"] = "ARCHIVED";
    ChangeType["MERGED"] = "MERGED";
    ChangeType["SPLIT"] = "SPLIT";
})(ChangeType || (exports.ChangeType = ChangeType = {}));
/**
 * Activity types
 */
var ActivityType;
(function (ActivityType) {
    ActivityType["SESSION"] = "SESSION";
    ActivityType["TRANSACTION"] = "TRANSACTION";
    ActivityType["QUERY"] = "QUERY";
    ActivityType["REPORT_GENERATION"] = "REPORT_GENERATION";
    ActivityType["DATA_ENTRY"] = "DATA_ENTRY";
    ActivityType["WORKFLOW"] = "WORKFLOW";
    ActivityType["ADMINISTRATION"] = "ADMINISTRATION";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
/**
 * Transaction status
 */
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["INITIATED"] = "INITIATED";
    TransactionStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    TransactionStatus["APPROVED"] = "APPROVED";
    TransactionStatus["REJECTED"] = "REJECTED";
    TransactionStatus["PROCESSING"] = "PROCESSING";
    TransactionStatus["COMPLETED"] = "COMPLETED";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["REVERSED"] = "REVERSED";
    TransactionStatus["CANCELLED"] = "CANCELLED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
/**
 * Access types
 */
var AccessType;
(function (AccessType) {
    AccessType["VIEW"] = "VIEW";
    AccessType["DOWNLOAD"] = "DOWNLOAD";
    AccessType["MODIFY"] = "MODIFY";
    AccessType["DELETE"] = "DELETE";
    AccessType["BULK_ACCESS"] = "BULK_ACCESS";
    AccessType["QUERY"] = "QUERY";
    AccessType["EXPORT"] = "EXPORT";
    AccessType["SHARE"] = "SHARE";
})(AccessType || (exports.AccessType = AccessType = {}));
/**
 * Data classification levels
 */
var DataClassification;
(function (DataClassification) {
    DataClassification["PUBLIC"] = "PUBLIC";
    DataClassification["INTERNAL"] = "INTERNAL";
    DataClassification["CONFIDENTIAL"] = "CONFIDENTIAL";
    DataClassification["RESTRICTED"] = "RESTRICTED";
    DataClassification["SECRET"] = "SECRET";
})(DataClassification || (exports.DataClassification = DataClassification = {}));
/**
 * Transparency record types
 */
var TransparencyRecordType;
(function (TransparencyRecordType) {
    TransparencyRecordType["BUDGET"] = "BUDGET";
    TransparencyRecordType["EXPENDITURE"] = "EXPENDITURE";
    TransparencyRecordType["CONTRACT"] = "CONTRACT";
    TransparencyRecordType["GRANT"] = "GRANT";
    TransparencyRecordType["SALARY"] = "SALARY";
    TransparencyRecordType["MEETING_MINUTES"] = "MEETING_MINUTES";
    TransparencyRecordType["DECISION"] = "DECISION";
    TransparencyRecordType["POLICY"] = "POLICY";
    TransparencyRecordType["PERFORMANCE_METRIC"] = "PERFORMANCE_METRIC";
    TransparencyRecordType["STATISTICAL_REPORT"] = "STATISTICAL_REPORT";
})(TransparencyRecordType || (exports.TransparencyRecordType = TransparencyRecordType = {}));
/**
 * Record formats
 */
var RecordFormat;
(function (RecordFormat) {
    RecordFormat["JSON"] = "JSON";
    RecordFormat["XML"] = "XML";
    RecordFormat["CSV"] = "CSV";
    RecordFormat["PDF"] = "PDF";
    RecordFormat["HTML"] = "HTML";
    RecordFormat["EXCEL"] = "EXCEL";
})(RecordFormat || (exports.RecordFormat = RecordFormat = {}));
/**
 * Access levels
 */
var AccessLevel;
(function (AccessLevel) {
    AccessLevel["PUBLIC"] = "PUBLIC";
    AccessLevel["REGISTERED_USERS"] = "REGISTERED_USERS";
    AccessLevel["GOVERNMENT_ONLY"] = "GOVERNMENT_ONLY";
    AccessLevel["RESTRICTED"] = "RESTRICTED";
})(AccessLevel || (exports.AccessLevel = AccessLevel = {}));
/**
 * Archive status
 */
var ArchiveStatus;
(function (ArchiveStatus) {
    ArchiveStatus["ACTIVE"] = "ACTIVE";
    ArchiveStatus["INACTIVE"] = "INACTIVE";
    ArchiveStatus["ARCHIVED"] = "ARCHIVED";
    ArchiveStatus["SCHEDULED_FOR_DISPOSAL"] = "SCHEDULED_FOR_DISPOSAL";
    ArchiveStatus["PERMANENTLY_RETAINED"] = "PERMANENTLY_RETAINED";
    ArchiveStatus["DISPOSED"] = "DISPOSED";
})(ArchiveStatus || (exports.ArchiveStatus = ArchiveStatus = {}));
/**
 * FOIA categories
 */
var FOIACategory;
(function (FOIACategory) {
    FOIACategory["COMMERCIAL"] = "COMMERCIAL";
    FOIACategory["EDUCATIONAL"] = "EDUCATIONAL";
    FOIACategory["MEDIA"] = "MEDIA";
    FOIACategory["PUBLIC_INTEREST"] = "PUBLIC_INTEREST";
    FOIACategory["OTHER"] = "OTHER";
})(FOIACategory || (exports.FOIACategory = FOIACategory = {}));
/**
 * Request priority
 */
var RequestPriority;
(function (RequestPriority) {
    RequestPriority["EXPEDITED"] = "EXPEDITED";
    RequestPriority["STANDARD"] = "STANDARD";
    RequestPriority["COMPLEX"] = "COMPLEX";
})(RequestPriority || (exports.RequestPriority = RequestPriority = {}));
/**
 * FOIA status
 */
var FOIAStatus;
(function (FOIAStatus) {
    FOIAStatus["RECEIVED"] = "RECEIVED";
    FOIAStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    FOIAStatus["IN_REVIEW"] = "IN_REVIEW";
    FOIAStatus["PROCESSING"] = "PROCESSING";
    FOIAStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    FOIAStatus["AWAITING_PAYMENT"] = "AWAITING_PAYMENT";
    FOIAStatus["READY_FOR_RELEASE"] = "READY_FOR_RELEASE";
    FOIAStatus["PARTIALLY_FULFILLED"] = "PARTIALLY_FULFILLED";
    FOIAStatus["FULFILLED"] = "FULFILLED";
    FOIAStatus["DENIED"] = "DENIED";
    FOIAStatus["NO_RECORDS"] = "NO_RECORDS";
    FOIAStatus["WITHDRAWN"] = "WITHDRAWN";
})(FOIAStatus || (exports.FOIAStatus = FOIAStatus = {}));
/**
 * Processing track
 */
var ProcessingTrack;
(function (ProcessingTrack) {
    ProcessingTrack["SIMPLE"] = "SIMPLE";
    ProcessingTrack["COMPLEX"] = "COMPLEX";
    ProcessingTrack["EXPEDITED"] = "EXPEDITED";
})(ProcessingTrack || (exports.ProcessingTrack = ProcessingTrack = {}));
/**
 * FOIA exemptions
 */
var FOIAExemption;
(function (FOIAExemption) {
    FOIAExemption["EXEMPTION_1"] = "EXEMPTION_1";
    FOIAExemption["EXEMPTION_2"] = "EXEMPTION_2";
    FOIAExemption["EXEMPTION_3"] = "EXEMPTION_3";
    FOIAExemption["EXEMPTION_4"] = "EXEMPTION_4";
    FOIAExemption["EXEMPTION_5"] = "EXEMPTION_5";
    FOIAExemption["EXEMPTION_6"] = "EXEMPTION_6";
    FOIAExemption["EXEMPTION_7"] = "EXEMPTION_7";
    FOIAExemption["EXEMPTION_8"] = "EXEMPTION_8";
    FOIAExemption["EXEMPTION_9"] = "EXEMPTION_9";
})(FOIAExemption || (exports.FOIAExemption = FOIAExemption = {}));
/**
 * Audit report types
 */
var AuditReportType;
(function (AuditReportType) {
    AuditReportType["ACCESS_AUDIT"] = "ACCESS_AUDIT";
    AuditReportType["CHANGE_AUDIT"] = "CHANGE_AUDIT";
    AuditReportType["TRANSACTION_AUDIT"] = "TRANSACTION_AUDIT";
    AuditReportType["SECURITY_AUDIT"] = "SECURITY_AUDIT";
    AuditReportType["COMPLIANCE_AUDIT"] = "COMPLIANCE_AUDIT";
    AuditReportType["USER_ACTIVITY"] = "USER_ACTIVITY";
    AuditReportType["DATA_ACCESS"] = "DATA_ACCESS";
    AuditReportType["CUSTOM"] = "CUSTOM";
})(AuditReportType || (exports.AuditReportType = AuditReportType = {}));
/**
 * Evidence types
 */
var EvidenceType;
(function (EvidenceType) {
    EvidenceType["LOG_ENTRY"] = "LOG_ENTRY";
    EvidenceType["SCREENSHOT"] = "SCREENSHOT";
    EvidenceType["DOCUMENT"] = "DOCUMENT";
    EvidenceType["DATABASE_RECORD"] = "DATABASE_RECORD";
    EvidenceType["SYSTEM_OUTPUT"] = "SYSTEM_OUTPUT";
    EvidenceType["USER_STATEMENT"] = "USER_STATEMENT";
    EvidenceType["CONFIGURATION"] = "CONFIGURATION";
    EvidenceType["EMAIL"] = "EMAIL";
})(EvidenceType || (exports.EvidenceType = EvidenceType = {}));
// ============================================================================
// COMPREHENSIVE AUDIT LOGGING
// ============================================================================
/**
 * Creates a comprehensive audit log entry
 */
function createAuditLogEntry(params) {
    const entry = {
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
function generateAuditHash(entry) {
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
function verifyAuditLogIntegrity(entry) {
    const expectedHash = generateAuditHash(entry);
    return entry.hash === expectedHash;
}
/**
 * Determines retention period based on event type
 */
function determineRetentionPeriod(eventType, category) {
    const retentionMap = {
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
function createAuditLogChain(entries, previousHash) {
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
function verifyAuditLogChain(chain, expectedFirstHash) {
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
function filterAuditLogs(logs, filters) {
    return logs.filter((log) => {
        if (filters.userIds && !filters.userIds.includes(log.userId))
            return false;
        if (filters.eventTypes && !filters.eventTypes.includes(log.eventType))
            return false;
        if (filters.actions && !filters.actions.includes(log.action))
            return false;
        if (filters.severities && !filters.severities.includes(log.severity))
            return false;
        if (filters.categories && !filters.categories.includes(log.category))
            return false;
        if (filters.resourceTypes && !filters.resourceTypes.includes(log.resourceType))
            return false;
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
function redactSensitiveAuditData(entry, fieldsToRedact = ['ssn', 'password', 'token', 'secret']) {
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
function redactObject(obj, fieldsToRedact) {
    if (typeof obj !== 'object' || obj === null)
        return obj;
    const redacted = Array.isArray(obj) ? [...obj] : { ...obj };
    for (const key in redacted) {
        if (fieldsToRedact.some((field) => key.toLowerCase().includes(field))) {
            redacted[key] = '***REDACTED***';
        }
        else if (typeof redacted[key] === 'object') {
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
function createChangeHistoryEntry(params) {
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
function trackObjectChanges(oldObject, newObject, prefix = '') {
    const changes = [];
    const allKeys = new Set([...Object.keys(oldObject || {}), ...Object.keys(newObject || {})]);
    allKeys.forEach((key) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const oldValue = oldObject?.[key];
        const newValue = newObject?.[key];
        if (typeof oldValue === 'object' &&
            typeof newValue === 'object' &&
            !Array.isArray(oldValue) &&
            oldValue !== null &&
            newValue !== null) {
            changes.push(...trackObjectChanges(oldValue, newValue, fullKey));
        }
        else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
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
function getEntityChangeHistory(allChanges, entityType, entityId) {
    return allChanges
        .filter((change) => change.entityType === entityType && change.entityId === entityId)
        .sort((a, b) => b.version - a.version);
}
/**
 * Reverts to a previous version
 */
function revertToVersion(history, targetVersion) {
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
function compareVersions(version1, version2) {
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
function createUserActivityLog(params) {
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
function completeUserActivityLog(activity, actionsPerformed) {
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
function calculateActivityAnomalyScore(activity) {
    let score = 0;
    // Unusual time (late night/early morning)
    const hour = activity.startTime.getHours();
    if (hour < 6 || hour > 22)
        score += 20;
    // High number of actions
    if (activity.actionsPerformed > 100)
        score += 15;
    // Long session duration (over 8 hours)
    if (activity.duration && activity.duration > 8 * 60 * 60 * 1000)
        score += 10;
    // Many resources accessed
    if (activity.resourcesAccessed.length > 50)
        score += 15;
    return score;
}
/**
 * Flags suspicious user activity
 */
function flagSuspiciousActivity(activity) {
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
function getUserActivities(activities, userId, dateRange) {
    return activities.filter((activity) => {
        if (activity.userId !== userId)
            return false;
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
function createTransactionAuditTrail(params) {
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
function addTransactionStep(trail, step) {
    return {
        ...trail,
        steps: [...trail.steps, step],
    };
}
/**
 * Adds approval to transaction
 */
function addTransactionApproval(trail, approval) {
    return {
        ...trail,
        approvalChain: [...(trail.approvalChain || []), approval],
    };
}
/**
 * Completes a transaction
 */
function completeTransaction(trail, success) {
    return {
        ...trail,
        completedAt: new Date(),
        status: success ? TransactionStatus.COMPLETED : TransactionStatus.FAILED,
    };
}
/**
 * Checks if transaction requires approval
 */
function requiresApproval(trail, approvalThreshold) {
    if (!trail.totalAmount)
        return false;
    return trail.totalAmount >= approvalThreshold;
}
/**
 * Gets pending approvals
 */
function getPendingApprovals(trail) {
    return (trail.approvalChain || []).filter((approval) => approval.decision === 'pending');
}
// ============================================================================
// DATA ACCESS LOGGING
// ============================================================================
/**
 * Creates a data access log
 */
function createDataAccessLog(params) {
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
function calculateSensitivityScore(classification, recordsAccessed) {
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
function markDataExported(log, exportFormat) {
    return {
        ...log,
        dataExported: true,
        exportFormat,
    };
}
/**
 * Gets high-sensitivity access logs
 */
function getHighSensitivityAccess(logs, threshold = 30) {
    return logs.filter((log) => log.sensitivityScore >= threshold);
}
// ============================================================================
// TRANSPARENCY PORTAL INTEGRATION
// ============================================================================
/**
 * Creates a transparency record
 */
function createTransparencyRecord(params) {
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
function incrementViewCount(record) {
    return {
        ...record,
        viewCount: record.viewCount + 1,
    };
}
/**
 * Increments record download count
 */
function incrementDownloadCount(record) {
    return {
        ...record,
        downloadCount: record.downloadCount + 1,
    };
}
/**
 * Adds tags to transparency record
 */
function addRecordTags(record, tags) {
    return {
        ...record,
        tags: [...new Set([...record.tags, ...tags])],
    };
}
/**
 * Filters transparency records by access level
 */
function filterByAccessLevel(records, userAccessLevel) {
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
function createPublicRecord(params) {
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
function applyLegalHold(record) {
    return {
        ...record,
        legalHold: true,
    };
}
/**
 * Releases legal hold from record
 */
function releaseLegalHold(record) {
    return {
        ...record,
        legalHold: false,
    };
}
/**
 * Archives a public record
 */
function archivePublicRecord(record, archiveLocation) {
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
function isEligibleForDisposal(record, currentDate = new Date()) {
    if (record.legalHold)
        return false;
    if (record.archiveStatus === ArchiveStatus.PERMANENTLY_RETAINED)
        return false;
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
function createFOIARequest(params) {
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
function generateFOIARequestNumber() {
    const year = new Date().getFullYear();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `FOIA-${year}-${random}`;
}
/**
 * Calculates FOIA due date based on priority
 */
function calculateFOIADueDate(priority = RequestPriority.STANDARD) {
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
function assignFOIARequest(request, assignedTo) {
    return {
        ...request,
        assignedTo,
        status: FOIAStatus.IN_REVIEW,
    };
}
/**
 * Requests FOIA extension
 */
function requestFOIAExtension(request, additionalDays, reason) {
    const extension = {
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
function approveFOIAExtension(request, extensionIndex) {
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
function fulfillFOIARequest(request, recordsProvided, response) {
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
function applyFOIAExemptions(request, exemptions) {
    return {
        ...request,
        exemptionsApplied: [...new Set([...(request.exemptionsApplied || []), ...exemptions])],
    };
}
/**
 * Gets overdue FOIA requests
 */
function getOverdueFOIARequests(requests, currentDate = new Date()) {
    return requests.filter((request) => ![FOIAStatus.FULFILLED, FOIAStatus.DENIED, FOIAStatus.WITHDRAWN].includes(request.status) &&
        request.dueDate < currentDate);
}
// ============================================================================
// AUDIT REPORT GENERATION
// ============================================================================
/**
 * Creates an audit report
 */
function createAuditReport(params) {
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
function generateAuditReportSummary(logs) {
    const uniqueUsers = new Set(logs.map((log) => log.userId)).size;
    const successfulEvents = logs.filter((log) => log.status === AuditStatus.SUCCESS).length;
    const failedEvents = logs.filter((log) => log.status === AuditStatus.FAILURE).length;
    const criticalEvents = logs.filter((log) => log.severity === AuditSeverity.CRITICAL).length;
    const userCounts = logs.reduce((acc, log) => {
        acc[log.userId] = (acc[log.userId] || 0) + 1;
        return acc;
    }, {});
    const topUsers = Object.entries(userCounts)
        .map(([userId, eventCount]) => ({ userId, eventCount }))
        .sort((a, b) => b.eventCount - a.eventCount)
        .slice(0, 10);
    const actionCounts = logs.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
    }, {});
    const topActions = Object.entries(actionCounts)
        .map(([action, count]) => ({ action, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    const timeDistribution = logs.reduce((acc, log) => {
        const hour = log.timestamp.getHours();
        acc[`${hour}:00`] = (acc[`${hour}:00`] || 0) + 1;
        return acc;
    }, {});
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
function addAuditFinding(report, finding) {
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
function createAuditEvidence(params) {
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
function addCustodyRecord(evidence, custodyRecord) {
    return {
        ...evidence,
        chainOfCustody: [...evidence.chainOfCustody, custodyRecord],
    };
}
/**
 * Verifies audit evidence
 */
function verifyAuditEvidence(evidence, verifiedBy) {
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
function generateTransparencyMetrics(params) {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const recordsThisMonth = params.transparencyRecords.filter((record) => record.publishDate >= currentMonth).length;
    const totalDownloads = params.transparencyRecords.reduce((sum, record) => sum + record.downloadCount, 0);
    const totalViews = params.transparencyRecords.reduce((sum, record) => sum + record.viewCount, 0);
    const openFOIA = params.foiaRequests.filter((request) => ![FOIAStatus.FULFILLED, FOIAStatus.DENIED, FOIAStatus.WITHDRAWN].includes(request.status)).length;
    const fulfilledRequests = params.foiaRequests.filter((request) => request.status === FOIAStatus.FULFILLED && request.responseDate);
    const avgResponseDays = fulfilledRequests.length > 0
        ? fulfilledRequests.reduce((sum, request) => {
            const days = Math.ceil((request.responseDate.getTime() - request.requestDate.getTime()) /
                (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0) / fulfilledRequests.length
        : 0;
    const fulfillmentRate = params.foiaRequests.length > 0
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
    }, {});
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
exports.AuditLogEntryModel = {
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
exports.TransparencyRecordModel = {
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
exports.FOIARequestModel = {
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
exports.AuditTransparencyServiceExample = `
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
exports.CreateAuditLogDto = {
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
exports.CreateFOIARequestDto = {
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
exports.TransparencyMetricsResponse = {
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
//# sourceMappingURL=audit-transparency-trail-kit.js.map