"use strict";
/**
 * LOC: COMPLIANCE_AUDIT_KIT_001
 * File: /reuse/engineer/compliance-audit-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/testing
 *   - typeorm
 *   - crypto (Node.js built-in)
 *   - jest
 *
 * DOWNSTREAM (imported by):
 *   - Audit logging services
 *   - Compliance monitoring services
 *   - Regulatory reporting modules
 *   - Change tracking services
 *   - Data retention services
 *   - Access control audit services
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
exports.AuditTestingUtils = exports.AuditLogTestHelper = exports.ComplianceCategory = exports.AuditSeverity = exports.AuditAction = void 0;
exports.createAuditLog = createAuditLog;
exports.createBatchAuditLogs = createBatchAuditLogs;
exports.generateAuditHash = generateAuditHash;
exports.verifyAuditLogIntegrity = verifyAuditLogIntegrity;
exports.determineComplianceFlags = determineComplianceFlags;
exports.enrichAuditLog = enrichAuditLog;
exports.maskSensitiveAuditData = maskSensitiveAuditData;
exports.createComplianceRule = createComplianceRule;
exports.evaluateComplianceRules = evaluateComplianceRules;
exports.evaluateRuleConditions = evaluateRuleConditions;
exports.evaluateCondition = evaluateCondition;
exports.getNestedValue = getNestedValue;
exports.executeComplianceActions = executeComplianceActions;
exports.buildAuditTrailQuery = buildAuditTrailQuery;
exports.filterAuditLogs = filterAuditLogs;
exports.generateAuditReport = generateAuditReport;
exports.groupAuditLogs = groupAuditLogs;
exports.performAggregations = performAggregations;
exports.generateChartData = generateChartData;
exports.exportAuditReportToCSV = exportAuditReportToCSV;
exports.trackChanges = trackChanges;
exports.createVersionRecord = createVersionRecord;
exports.generateVersionChecksum = generateVersionChecksum;
exports.compareVersions = compareVersions;
exports.revertToVersion = revertToVersion;
exports.createComplianceChecklistItem = createComplianceChecklistItem;
exports.updateComplianceStatus = updateComplianceStatus;
exports.generateHIPAAChecklist = generateHIPAAChecklist;
exports.calculateComplianceScore = calculateComplianceScore;
exports.createRetentionPolicy = createRetentionPolicy;
exports.shouldRetainData = shouldRetainData;
exports.identifyRecordsForArchival = identifyRecordsForArchival;
exports.logAccessControlEvent = logAccessControlEvent;
exports.analyzeAccessPatterns = analyzeAccessPatterns;
exports.encryptAuditLogFields = encryptAuditLogFields;
exports.encryptField = encryptField;
exports.decryptField = decryptField;
exports.createAuditLogChain = createAuditLogChain;
exports.verifyAuditLogChain = verifyAuditLogChain;
exports.createMockAuditLogRepository = createMockAuditLogRepository;
exports.createMockComplianceRules = createMockComplianceRules;
exports.generateTestAuditLogs = generateTestAuditLogs;
exports.createAuditTestModule = createAuditTestModule;
exports.assertAuditLogCreated = assertAuditLogCreated;
exports.mockComplianceEvaluation = mockComplianceEvaluation;
/**
 * File: /reuse/engineer/compliance-audit-kit.ts
 * Locator: WC-COMPLIANCE-AUDIT-KIT-001
 * Purpose: Comprehensive Compliance and Audit Trail Toolkit
 *
 * Upstream: @nestjs/common, @nestjs/testing, typeorm, crypto, jest
 * Downstream: Audit services, Compliance modules, Regulatory reporting, Change tracking
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, TypeORM 0.3+
 * Exports: 45 compliance and audit functions with extensive testing utilities
 *
 * LLM Context: Enterprise-grade compliance and audit trail management for healthcare applications.
 * Provides HIPAA-compliant audit logging, compliance rule engine, audit trail querying, change
 * tracking, versioning, regulatory reporting, data retention policies, access control logging,
 * violation detection, encryption, and comprehensive NestJS testing utilities for audit features.
 */
const crypto = __importStar(require("crypto"));
/**
 * Audit action types
 */
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["READ"] = "READ";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["ACCESS_GRANTED"] = "ACCESS_GRANTED";
    AuditAction["ACCESS_DENIED"] = "ACCESS_DENIED";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["IMPORT"] = "IMPORT";
    AuditAction["DOWNLOAD"] = "DOWNLOAD";
    AuditAction["PRINT"] = "PRINT";
    AuditAction["SHARE"] = "SHARE";
    AuditAction["ENCRYPT"] = "ENCRYPT";
    AuditAction["DECRYPT"] = "DECRYPT";
    AuditAction["BACKUP"] = "BACKUP";
    AuditAction["RESTORE"] = "RESTORE";
    AuditAction["CONSENT_GRANTED"] = "CONSENT_GRANTED";
    AuditAction["CONSENT_REVOKED"] = "CONSENT_REVOKED";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
/**
 * Audit severity levels
 */
var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["LOW"] = "LOW";
    AuditSeverity["MEDIUM"] = "MEDIUM";
    AuditSeverity["HIGH"] = "HIGH";
    AuditSeverity["CRITICAL"] = "CRITICAL";
})(AuditSeverity || (exports.AuditSeverity = AuditSeverity = {}));
/**
 * Compliance categories
 */
var ComplianceCategory;
(function (ComplianceCategory) {
    ComplianceCategory["DATA_PROTECTION"] = "DATA_PROTECTION";
    ComplianceCategory["ACCESS_CONTROL"] = "ACCESS_CONTROL";
    ComplianceCategory["DATA_RETENTION"] = "DATA_RETENTION";
    ComplianceCategory["ENCRYPTION"] = "ENCRYPTION";
    ComplianceCategory["AUDIT_LOGGING"] = "AUDIT_LOGGING";
    ComplianceCategory["CONSENT_MANAGEMENT"] = "CONSENT_MANAGEMENT";
    ComplianceCategory["BREACH_NOTIFICATION"] = "BREACH_NOTIFICATION";
    ComplianceCategory["DATA_MINIMIZATION"] = "DATA_MINIMIZATION";
    ComplianceCategory["RIGHT_TO_ACCESS"] = "RIGHT_TO_ACCESS";
    ComplianceCategory["RIGHT_TO_ERASURE"] = "RIGHT_TO_ERASURE";
})(ComplianceCategory || (exports.ComplianceCategory = ComplianceCategory = {}));
// ============================================================================
// AUDIT LOG CREATION AND MANAGEMENT
// ============================================================================
/**
 * Creates a new audit log entry
 */
function createAuditLog(params) {
    const entry = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        resourceType: params.resourceType,
        changes: params.changes || [],
        metadata: params.metadata || {},
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        sessionId: params.sessionId,
        status: params.status || 'success',
        severity: params.severity || AuditSeverity.LOW,
        complianceFlags: determineComplianceFlags(params.action, params.resourceType),
    };
    entry.hash = generateAuditHash(entry);
    return entry;
}
/**
 * Creates a batch of audit log entries
 */
function createBatchAuditLogs(entries, userId) {
    return entries.map((entry) => createAuditLog({ ...entry, userId }));
}
/**
 * Generates a cryptographic hash for audit log integrity
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
    return crypto
        .createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex');
}
/**
 * Verifies audit log integrity using hash
 */
function verifyAuditLogIntegrity(entry) {
    const expectedHash = generateAuditHash(entry);
    return entry.hash === expectedHash;
}
/**
 * Determines compliance flags based on action and resource type
 */
function determineComplianceFlags(action, resourceType) {
    const flags = [];
    // HIPAA PHI access flags
    if (resourceType.includes('Patient') || resourceType.includes('Medical')) {
        flags.push('HIPAA_PHI_ACCESS');
    }
    // Sensitive action flags
    if ([AuditAction.DELETE, AuditAction.EXPORT, AuditAction.DOWNLOAD].includes(action)) {
        flags.push('SENSITIVE_ACTION');
    }
    // Access control flags
    if ([AuditAction.ACCESS_GRANTED, AuditAction.ACCESS_DENIED].includes(action)) {
        flags.push('ACCESS_CONTROL');
    }
    return flags;
}
/**
 * Enriches audit log with additional user and session information
 */
function enrichAuditLog(entry, enrichmentData) {
    return {
        ...entry,
        userEmail: enrichmentData.userEmail || entry.userEmail,
        userRole: enrichmentData.userRole || entry.userRole,
        metadata: {
            ...entry.metadata,
            ...enrichmentData.additionalMetadata,
        },
    };
}
/**
 * Masks sensitive data in audit logs
 */
function maskSensitiveAuditData(entry, sensitiveFields = ['password', 'ssn', 'creditCard', 'apiKey']) {
    const maskedEntry = { ...entry };
    if (maskedEntry.changes) {
        maskedEntry.changes = maskedEntry.changes.map((change) => {
            if (sensitiveFields.some((field) => change.field.toLowerCase().includes(field.toLowerCase()))) {
                return {
                    ...change,
                    oldValue: '***MASKED***',
                    newValue: '***MASKED***',
                    encrypted: true,
                };
            }
            return change;
        });
    }
    if (maskedEntry.metadata) {
        const maskedMetadata = { ...maskedEntry.metadata };
        sensitiveFields.forEach((field) => {
            if (maskedMetadata[field]) {
                maskedMetadata[field] = '***MASKED***';
            }
        });
        maskedEntry.metadata = maskedMetadata;
    }
    return maskedEntry;
}
// ============================================================================
// COMPLIANCE RULE ENGINE
// ============================================================================
/**
 * Creates a compliance rule
 */
function createComplianceRule(params) {
    return {
        id: crypto.randomUUID(),
        name: params.name,
        description: params.description,
        category: params.category,
        regulation: params.regulation,
        severity: params.severity,
        conditions: params.conditions,
        actions: params.actions,
        enabled: true,
        metadata: {},
    };
}
/**
 * Evaluates compliance rules against an audit log entry
 */
function evaluateComplianceRules(entry, rules) {
    const violations = [];
    for (const rule of rules.filter((r) => r.enabled)) {
        if (evaluateRuleConditions(entry, rule.conditions)) {
            violations.push({
                id: crypto.randomUUID(),
                timestamp: new Date(),
                ruleId: rule.id,
                ruleName: rule.name,
                severity: rule.severity,
                userId: entry.userId,
                resource: entry.resource,
                resourceId: entry.resourceId,
                description: rule.description,
                details: { entry, rule },
                status: 'open',
            });
            // Execute compliance actions
            executeComplianceActions(rule.actions, entry);
        }
    }
    return violations;
}
/**
 * Evaluates rule conditions
 */
function evaluateRuleConditions(entry, conditions) {
    if (conditions.length === 0)
        return false;
    let result = evaluateCondition(entry, conditions[0]);
    for (let i = 1; i < conditions.length; i++) {
        const condition = conditions[i];
        const conditionResult = evaluateCondition(entry, condition);
        if (condition.logicalOperator === 'OR') {
            result = result || conditionResult;
        }
        else {
            result = result && conditionResult;
        }
    }
    return result;
}
/**
 * Evaluates a single condition
 */
function evaluateCondition(entry, condition) {
    const fieldValue = getNestedValue(entry, condition.field);
    switch (condition.operator) {
        case 'equals':
            return fieldValue === condition.value;
        case 'notEquals':
            return fieldValue !== condition.value;
        case 'contains':
            return String(fieldValue).includes(String(condition.value));
        case 'greaterThan':
            return Number(fieldValue) > Number(condition.value);
        case 'lessThan':
            return Number(fieldValue) < Number(condition.value);
        case 'matches':
            return new RegExp(condition.value).test(String(fieldValue));
        default:
            return false;
    }
}
/**
 * Gets nested value from object using dot notation
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}
/**
 * Executes compliance actions
 */
function executeComplianceActions(actions, entry) {
    actions.forEach((action) => {
        switch (action.type) {
            case 'alert':
                // In production, integrate with alerting service
                console.warn(`COMPLIANCE ALERT: ${action.message}`, { entry, action });
                break;
            case 'block':
                // In production, integrate with access control
                console.error(`COMPLIANCE BLOCK: ${action.message}`, { entry, action });
                break;
            case 'log':
                console.log(`COMPLIANCE LOG: ${action.message}`, { entry, action });
                break;
            case 'notify':
                // In production, integrate with notification service
                console.info(`COMPLIANCE NOTIFY: ${action.message}`, { entry, action });
                break;
            case 'escalate':
                // In production, integrate with incident management
                console.error(`COMPLIANCE ESCALATE: ${action.message}`, { entry, action });
                break;
        }
    });
}
// ============================================================================
// AUDIT TRAIL QUERYING AND REPORTING
// ============================================================================
/**
 * Builds a query for audit trail search
 */
function buildAuditTrailQuery(params) {
    const query = {};
    if (params.startDate || params.endDate) {
        query.timestamp = {};
        if (params.startDate)
            query.timestamp.$gte = params.startDate;
        if (params.endDate)
            query.timestamp.$lte = params.endDate;
    }
    if (params.userId)
        query.userId = params.userId;
    if (params.userEmail)
        query.userEmail = params.userEmail;
    if (params.actions?.length)
        query.action = { $in: params.actions };
    if (params.resources?.length)
        query.resource = { $in: params.resources };
    if (params.resourceIds?.length)
        query.resourceId = { $in: params.resourceIds };
    if (params.severity?.length)
        query.severity = { $in: params.severity };
    if (params.status?.length)
        query.status = { $in: params.status };
    if (params.ipAddress)
        query.ipAddress = params.ipAddress;
    if (params.complianceFlags?.length) {
        query.complianceFlags = { $in: params.complianceFlags };
    }
    return query;
}
/**
 * Filters audit logs based on query parameters
 */
function filterAuditLogs(logs, query) {
    let filtered = [...logs];
    if (query.startDate) {
        filtered = filtered.filter((log) => log.timestamp >= query.startDate);
    }
    if (query.endDate) {
        filtered = filtered.filter((log) => log.timestamp <= query.endDate);
    }
    if (query.userId) {
        filtered = filtered.filter((log) => log.userId === query.userId);
    }
    if (query.actions?.length) {
        filtered = filtered.filter((log) => query.actions.includes(log.action));
    }
    if (query.resources?.length) {
        filtered = filtered.filter((log) => query.resources.includes(log.resource));
    }
    if (query.severity?.length) {
        filtered = filtered.filter((log) => query.severity.includes(log.severity));
    }
    if (query.status?.length) {
        filtered = filtered.filter((log) => query.status.includes(log.status));
    }
    // Sort
    if (query.sortBy) {
        filtered.sort((a, b) => {
            const aVal = getNestedValue(a, query.sortBy);
            const bVal = getNestedValue(b, query.sortBy);
            const order = query.sortOrder === 'DESC' ? -1 : 1;
            return aVal > bVal ? order : -order;
        });
    }
    // Pagination
    if (query.offset) {
        filtered = filtered.slice(query.offset);
    }
    if (query.limit) {
        filtered = filtered.slice(0, query.limit);
    }
    return filtered;
}
/**
 * Generates an audit report
 */
function generateAuditReport(logs, config) {
    const filteredLogs = filterAuditLogs(logs, config.query);
    const report = {
        title: config.title,
        type: config.type,
        generatedAt: new Date(),
        totalRecords: filteredLogs.length,
        data: filteredLogs,
    };
    // Group by
    if (config.groupBy?.length) {
        report.groupedData = groupAuditLogs(filteredLogs, config.groupBy);
    }
    // Aggregations
    if (config.aggregations?.length) {
        report.aggregations = performAggregations(filteredLogs, config.aggregations);
    }
    // Charts data
    if (config.includeCharts) {
        report.chartData = generateChartData(filteredLogs);
    }
    return report;
}
/**
 * Groups audit logs by specified fields
 */
function groupAuditLogs(logs, groupByFields) {
    const grouped = {};
    logs.forEach((log) => {
        const key = groupByFields.map((field) => getNestedValue(log, field)).join('|');
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(log);
    });
    return grouped;
}
/**
 * Performs aggregations on audit logs
 */
function performAggregations(logs, aggregations) {
    const results = {};
    aggregations.forEach((agg) => {
        const key = agg.alias || `${agg.function}_${agg.field}`;
        const values = logs.map((log) => getNestedValue(log, agg.field)).filter((v) => v != null);
        switch (agg.function) {
            case 'count':
                results[key] = values.length;
                break;
            case 'sum':
                results[key] = values.reduce((sum, val) => sum + Number(val), 0);
                break;
            case 'avg':
                results[key] = values.reduce((sum, val) => sum + Number(val), 0) / values.length;
                break;
            case 'min':
                results[key] = Math.min(...values.map(Number));
                break;
            case 'max':
                results[key] = Math.max(...values.map(Number));
                break;
        }
    });
    return results;
}
/**
 * Generates chart data from audit logs
 */
function generateChartData(logs) {
    return {
        actionDistribution: logs.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {}),
        severityDistribution: logs.reduce((acc, log) => {
            acc[log.severity] = (acc[log.severity] || 0) + 1;
            return acc;
        }, {}),
        dailyActivity: logs.reduce((acc, log) => {
            const date = log.timestamp.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {}),
    };
}
/**
 * Exports audit report to CSV format
 */
function exportAuditReportToCSV(logs) {
    const headers = [
        'ID',
        'Timestamp',
        'User ID',
        'Action',
        'Resource',
        'Resource ID',
        'Status',
        'Severity',
        'IP Address',
    ];
    const rows = logs.map((log) => [
        log.id,
        log.timestamp.toISOString(),
        log.userId,
        log.action,
        log.resource,
        log.resourceId || '',
        log.status,
        log.severity,
        log.ipAddress || '',
    ]);
    return [headers, ...rows].map((row) => row.join(',')).join('\n');
}
// ============================================================================
// CHANGE TRACKING AND VERSIONING
// ============================================================================
/**
 * Tracks changes between two objects
 */
function trackChanges(oldData, newData, prefix = '') {
    const changes = [];
    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);
    allKeys.forEach((key) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const oldValue = oldData?.[key];
        const newValue = newData?.[key];
        if (typeof oldValue === 'object' && typeof newValue === 'object' && !Array.isArray(oldValue)) {
            changes.push(...trackChanges(oldValue, newValue, fullKey));
        }
        else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push({
                field: fullKey,
                oldValue,
                newValue,
                dataType: typeof newValue,
            });
        }
    });
    return changes;
}
/**
 * Creates a version record
 */
function createVersionRecord(params) {
    const record = {
        id: crypto.randomUUID(),
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        version: params.version,
        data: params.data,
        changes: params.changes || [],
        createdBy: params.createdBy,
        createdAt: new Date(),
        checksum: '',
        metadata: {},
    };
    record.checksum = generateVersionChecksum(record);
    return record;
}
/**
 * Generates checksum for version integrity
 */
function generateVersionChecksum(version) {
    return crypto
        .createHash('sha256')
        .update(JSON.stringify({
        resourceType: version.resourceType,
        resourceId: version.resourceId,
        version: version.version,
        data: version.data,
    }))
        .digest('hex');
}
/**
 * Compares two versions
 */
function compareVersions(version1, version2) {
    return trackChanges(version1.data, version2.data);
}
/**
 * Reverts to a previous version
 */
function revertToVersion(currentData, targetVersion) {
    const changes = trackChanges(currentData, targetVersion.data);
    return {
        data: targetVersion.data,
        changes,
    };
}
// ============================================================================
// COMPLIANCE CHECKLIST MANAGEMENT
// ============================================================================
/**
 * Creates a compliance checklist item
 */
function createComplianceChecklistItem(params) {
    return {
        id: crypto.randomUUID(),
        category: params.category,
        regulation: params.regulation,
        requirement: params.requirement,
        description: params.description,
        status: 'non_compliant',
        evidence: [],
        priority: params.priority || 'medium',
    };
}
/**
 * Updates compliance checklist item status
 */
function updateComplianceStatus(item, status, checkedBy, notes, evidence) {
    return {
        ...item,
        status,
        lastChecked: new Date(),
        checkedBy,
        notes,
        evidence: evidence || item.evidence,
    };
}
/**
 * Generates HIPAA compliance checklist
 */
function generateHIPAAChecklist() {
    return [
        createComplianceChecklistItem({
            category: ComplianceCategory.ACCESS_CONTROL,
            regulation: 'HIPAA',
            requirement: '164.308(a)(3)',
            description: 'Implement procedures for authorization and supervision of workforce members',
            priority: 'critical',
        }),
        createComplianceChecklistItem({
            category: ComplianceCategory.AUDIT_LOGGING,
            regulation: 'HIPAA',
            requirement: '164.312(b)',
            description: 'Implement hardware, software, and procedural mechanisms to record and examine activity',
            priority: 'critical',
        }),
        createComplianceChecklistItem({
            category: ComplianceCategory.ENCRYPTION,
            regulation: 'HIPAA',
            requirement: '164.312(a)(2)(iv)',
            description: 'Implement mechanism to encrypt and decrypt ePHI',
            priority: 'high',
        }),
        createComplianceChecklistItem({
            category: ComplianceCategory.DATA_RETENTION,
            regulation: 'HIPAA',
            requirement: '164.316(b)(2)',
            description: 'Retain documentation for 6 years from date of creation or last effective date',
            priority: 'high',
        }),
    ];
}
/**
 * Calculates compliance score
 */
function calculateComplianceScore(items) {
    const compliantCount = items.filter((item) => item.status === 'compliant').length;
    const totalCount = items.filter((item) => item.status !== 'not_applicable').length;
    const score = totalCount > 0 ? (compliantCount / totalCount) * 100 : 0;
    const breakdown = items.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {});
    return { score, compliantCount, totalCount, breakdown };
}
// ============================================================================
// DATA RETENTION POLICIES
// ============================================================================
/**
 * Creates a data retention policy
 */
function createRetentionPolicy(params) {
    return {
        id: crypto.randomUUID(),
        name: params.name,
        resourceType: params.resourceType,
        retentionPeriodDays: params.retentionPeriodDays,
        archiveBeforeDelete: params.archiveBeforeDelete || false,
        archiveLocation: params.archiveLocation,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Determines if data should be retained or deleted
 */
function shouldRetainData(createdAt, policy) {
    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = policy.retentionPeriodDays - ageInDays;
    return {
        retain: daysRemaining > 0,
        daysRemaining: Math.max(0, daysRemaining),
    };
}
/**
 * Identifies records eligible for archival
 */
function identifyRecordsForArchival(records, policy) {
    return records
        .filter((record) => {
        const { retain, daysRemaining } = shouldRetainData(record.createdAt, policy);
        return !retain || daysRemaining <= 30; // Archive 30 days before deletion
    })
        .map((record) => record.id);
}
// ============================================================================
// ACCESS CONTROL AUDIT LOGGING
// ============================================================================
/**
 * Logs access control event
 */
function logAccessControlEvent(params) {
    const actionMap = {
        grant: AuditAction.ACCESS_GRANTED,
        deny: AuditAction.ACCESS_DENIED,
        revoke: AuditAction.ACCESS_DENIED,
        modify: AuditAction.UPDATE,
    };
    return createAuditLog({
        userId: params.userId,
        action: actionMap[params.action],
        resource: params.resource,
        resourceId: params.resourceId,
        resourceType: 'AccessControl',
        metadata: {
            permission: params.permission,
            reason: params.reason,
            controlAction: params.action,
        },
        ipAddress: params.ipAddress,
        severity: params.action === 'deny' ? AuditSeverity.MEDIUM : AuditSeverity.LOW,
        status: 'success',
    });
}
/**
 * Analyzes access patterns for anomalies
 */
function analyzeAccessPatterns(logs) {
    const anomalies = [];
    const patterns = {};
    // Group by user
    const userLogs = groupAuditLogs(logs, ['userId']);
    Object.entries(userLogs).forEach(([userId, userLogEntries]) => {
        // Check for unusual access times
        const nightAccess = userLogEntries.filter((log) => {
            const hour = log.timestamp.getHours();
            return hour < 6 || hour > 22;
        });
        if (nightAccess.length > 5) {
            anomalies.push({
                type: 'unusual_access_time',
                severity: 'medium',
                description: `User ${userId} has ${nightAccess.length} access events during unusual hours`,
                logs: nightAccess,
            });
        }
        // Check for rapid access attempts
        const sortedLogs = userLogEntries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        let rapidAccessCount = 0;
        for (let i = 1; i < sortedLogs.length; i++) {
            const timeDiff = sortedLogs[i].timestamp.getTime() - sortedLogs[i - 1].timestamp.getTime();
            if (timeDiff < 1000) {
                // Less than 1 second apart
                rapidAccessCount++;
            }
        }
        if (rapidAccessCount > 10) {
            anomalies.push({
                type: 'rapid_access',
                severity: 'high',
                description: `User ${userId} has ${rapidAccessCount} rapid access attempts`,
                logs: sortedLogs,
            });
        }
        // Track patterns
        patterns[`user_${userId}_access_count`] = userLogEntries.length;
    });
    return { anomalies, patterns };
}
// ============================================================================
// AUDIT LOG ENCRYPTION AND SECURITY
// ============================================================================
/**
 * Encrypts sensitive audit log fields
 */
function encryptAuditLogFields(entry, fieldsToEncrypt, encryptionKey) {
    const encrypted = { ...entry };
    if (encrypted.changes) {
        encrypted.changes = encrypted.changes.map((change) => {
            if (fieldsToEncrypt.includes(change.field)) {
                return {
                    ...change,
                    oldValue: encryptField(String(change.oldValue), encryptionKey),
                    newValue: encryptField(String(change.newValue), encryptionKey),
                    encrypted: true,
                };
            }
            return change;
        });
    }
    encrypted.encrypted = true;
    return encrypted;
}
/**
 * Encrypts a field value
 */
function encryptField(value, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', crypto.createHash('sha256').update(key).digest(), iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}
/**
 * Decrypts a field value
 */
function decryptField(encryptedValue, key) {
    const [ivHex, encrypted] = encryptedValue.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.createHash('sha256').update(key).digest(), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
/**
 * Creates a tamper-evident audit log chain
 */
function createAuditLogChain(entries, previousHash) {
    let currentHash = previousHash || '';
    return entries.map((entry) => {
        const chainData = {
            previousHash: currentHash,
            entryHash: entry.hash,
            timestamp: entry.timestamp.toISOString(),
        };
        currentHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(chainData))
            .digest('hex');
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
        const expectedHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(chainData))
            .digest('hex');
        if (expectedHash !== entry.chainHash) {
            return { valid: false, brokenAt: i };
        }
        previousHash = entry.chainHash;
    }
    return { valid: true };
}
// ============================================================================
// NESTJS TESTING UTILITIES
// ============================================================================
/**
 * Creates a mock audit log repository for testing
 */
function createMockAuditLogRepository() {
    const logs = [];
    return {
        save: jest.fn((entry) => {
            logs.push(entry);
            return Promise.resolve(entry);
        }),
        find: jest.fn((query) => {
            if (!query)
                return Promise.resolve(logs);
            // Simple filtering for tests
            return Promise.resolve(logs);
        }),
        findOne: jest.fn((query) => {
            return Promise.resolve(logs.find((log) => log.id === query.where?.id));
        }),
        count: jest.fn(() => Promise.resolve(logs.length)),
        clear: jest.fn(() => {
            logs.length = 0;
            return Promise.resolve();
        }),
        remove: jest.fn((entry) => {
            const index = logs.findIndex((log) => log.id === entry.id);
            if (index > -1)
                logs.splice(index, 1);
            return Promise.resolve(entry);
        }),
        getLogs: () => logs,
    };
}
/**
 * Creates mock compliance rules for testing
 */
function createMockComplianceRules() {
    return [
        createComplianceRule({
            name: 'PHI Access After Hours',
            description: 'Detect PHI access outside business hours',
            category: ComplianceCategory.ACCESS_CONTROL,
            regulation: 'HIPAA',
            severity: AuditSeverity.MEDIUM,
            conditions: [
                { field: 'resourceType', operator: 'contains', value: 'Patient' },
            ],
            actions: [{ type: 'alert', message: 'PHI accessed after hours' }],
        }),
        createComplianceRule({
            name: 'Bulk Data Export',
            description: 'Detect bulk data export operations',
            category: ComplianceCategory.DATA_PROTECTION,
            regulation: 'HIPAA',
            severity: AuditSeverity.HIGH,
            conditions: [
                { field: 'action', operator: 'equals', value: AuditAction.EXPORT },
            ],
            actions: [{ type: 'alert', message: 'Bulk export detected' }],
        }),
    ];
}
/**
 * Generates test audit log data
 */
function generateTestAuditLogs(count) {
    const actions = Object.values(AuditAction);
    const severities = Object.values(AuditSeverity);
    const resources = ['Patient', 'Appointment', 'Prescription', 'User', 'Report'];
    return Array.from({ length: count }, (_, i) => {
        const action = actions[Math.floor(Math.random() * actions.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const resource = resources[Math.floor(Math.random() * resources.length)];
        return createAuditLog({
            userId: `user-${Math.floor(Math.random() * 10)}`,
            action,
            resource,
            resourceId: `res-${i}`,
            resourceType: resource,
            status: Math.random() > 0.1 ? 'success' : 'failure',
            severity,
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        });
    });
}
/**
 * Creates a NestJS test module with audit services
 */
function createAuditTestModule() {
    return {
        module: class TestAuditModule {
        },
        providers: [
            {
                provide: 'AUDIT_LOG_REPOSITORY',
                useValue: createMockAuditLogRepository(),
            },
            {
                provide: 'COMPLIANCE_RULES',
                useValue: createMockComplianceRules(),
            },
        ],
    };
}
/**
 * Asserts audit log was created correctly
 */
function assertAuditLogCreated(log, expected) {
    expect(log.id).toBeDefined();
    expect(log.timestamp).toBeInstanceOf(Date);
    expect(log.hash).toBeDefined();
    Object.entries(expected).forEach(([key, value]) => {
        expect(log[key]).toEqual(value);
    });
}
/**
 * Mocks compliance rule evaluation
 */
function mockComplianceEvaluation(shouldViolate = false) {
    return jest.fn(() => {
        if (shouldViolate) {
            return [
                {
                    id: crypto.randomUUID(),
                    timestamp: new Date(),
                    ruleId: 'test-rule',
                    ruleName: 'Test Rule',
                    severity: AuditSeverity.HIGH,
                    status: 'open',
                },
            ];
        }
        return [];
    });
}
/**
 * Creates test helper for audit log assertions
 */
class AuditLogTestHelper {
    constructor() {
        this.logs = [];
    }
    addLog(log) {
        this.logs.push(log);
    }
    getLogs() {
        return this.logs;
    }
    findByAction(action) {
        return this.logs.filter((log) => log.action === action);
    }
    findByUserId(userId) {
        return this.logs.filter((log) => log.userId === userId);
    }
    findByResource(resource) {
        return this.logs.filter((log) => log.resource === resource);
    }
    assertLogExists(criteria) {
        const found = this.logs.some((log) => Object.entries(criteria).every(([key, value]) => log[key] === value));
        expect(found).toBe(true);
    }
    assertLogCount(expected) {
        expect(this.logs.length).toBe(expected);
    }
    clear() {
        this.logs = [];
    }
}
exports.AuditLogTestHelper = AuditLogTestHelper;
/**
 * Export all testing utilities
 */
exports.AuditTestingUtils = {
    createMockAuditLogRepository,
    createMockComplianceRules,
    generateTestAuditLogs,
    createAuditTestModule,
    assertAuditLogCreated,
    mockComplianceEvaluation,
    AuditLogTestHelper,
};
//# sourceMappingURL=compliance-audit-kit.js.map