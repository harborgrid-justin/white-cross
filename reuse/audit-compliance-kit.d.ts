/**
 * LOC: AUDCOMP1234567
 * File: /reuse/audit-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS audit services
 *   - Compliance reporting modules
 *   - GDPR compliance services
 *   - HIPAA audit logging
 *   - Activity tracking services
 */
/**
 * File: /reuse/audit-compliance-kit.ts
 * Locator: WC-UTL-AUDCOMP-001
 * Purpose: Comprehensive Audit & Compliance Kit - Complete audit logging and compliance toolkit for NestJS
 *
 * Upstream: Independent utility module for audit and compliance operations
 * Downstream: ../backend/*, Audit services, Compliance modules, Security services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize, crypto
 * Exports: 40+ utility functions for activity tracking, data retention, GDPR helpers, audit trails, compliance reports
 *
 * LLM Context: Enterprise-grade audit and compliance utilities for White Cross healthcare platform.
 * Provides comprehensive HIPAA-compliant audit logging, activity tracking, data retention policies,
 * GDPR compliance (right to access, erasure, portability), audit trail generation, compliance reports,
 * consent management, data anonymization, breach detection, access control logging, and regulatory reporting.
 */
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Model, Sequelize } from 'sequelize';
import { Observable } from 'rxjs';
interface AuditLogEntry {
    id?: string;
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    resourceType?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
    sessionId?: string;
    outcome: 'success' | 'failure' | 'partial';
    errorMessage?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
}
interface DataRetentionPolicy {
    resourceType: string;
    retentionPeriodDays: number;
    archiveBeforeDelete: boolean;
    anonymizeBeforeDelete: boolean;
    legalHoldExempt: boolean;
}
interface ConsentRecord {
    userId: string;
    consentType: string;
    purpose: string;
    granted: boolean;
    grantedAt?: Date;
    revokedAt?: Date;
    version: string;
    metadata?: Record<string, any>;
}
interface AccessControlLog {
    userId: string;
    resource: string;
    action: string;
    granted: boolean;
    reason?: string;
    context?: Record<string, any>;
    timestamp: Date;
}
interface ComplianceReport {
    reportType: string;
    startDate: Date;
    endDate: Date;
    generatedAt: Date;
    generatedBy: string;
    data: Record<string, any>;
    format: 'json' | 'csv' | 'pdf';
}
interface AnonymizationConfig {
    strategy: 'hash' | 'pseudonymize' | 'generalize' | 'suppress';
    fields: string[];
    preserveFormat?: boolean;
    salt?: string;
}
/**
 * Sequelize model for Audit Logs with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AuditLog model
 *
 * @example
 * const AuditLog = defineAuditLogModel(sequelize);
 * await AuditLog.create({
 *   userId: 'user-123',
 *   action: 'UPDATE',
 *   resource: 'patient',
 *   resourceId: 'patient-456',
 *   outcome: 'success'
 * });
 */
export declare function defineAuditLogModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for GDPR Requests tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GDPRRequest model
 *
 * @example
 * const GDPRRequest = defineGDPRRequestModel(sequelize);
 * await GDPRRequest.create({
 *   type: 'erasure',
 *   userId: 'user-123',
 *   requestedBy: 'user-123',
 *   status: 'pending'
 * });
 */
export declare function defineGDPRRequestModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Consent Management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ConsentRecord model
 *
 * @example
 * const ConsentRecord = defineConsentRecordModel(sequelize);
 * await ConsentRecord.create({
 *   userId: 'user-123',
 *   consentType: 'data_processing',
 *   purpose: 'Healthcare analytics',
 *   granted: true,
 *   version: '1.0'
 * });
 */
export declare function defineConsentRecordModel(sequelize: Sequelize): typeof Model;
/**
 * Zod schema for audit log entry validation.
 */
export declare const auditLogSchema: any;
/**
 * Zod schema for GDPR request validation.
 */
export declare const gdprRequestSchema: any;
/**
 * Zod schema for consent record validation.
 */
export declare const consentRecordSchema: any;
/**
 * Zod schema for data retention policy validation.
 */
export declare const dataRetentionPolicySchema: any;
/**
 * Zod schema for compliance report configuration.
 */
export declare const complianceReportSchema: any;
/**
 * Creates audit log entry with comprehensive tracking.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {AuditLogEntry} entry - Audit log entry
 * @returns {Promise<any>} Created audit log
 *
 * @example
 * await createAuditLog(AuditLog, {
 *   userId: 'user-123',
 *   action: 'UPDATE',
 *   resource: 'patient',
 *   resourceId: 'patient-456',
 *   outcome: 'success',
 *   severity: 'medium',
 *   timestamp: new Date()
 * });
 */
export declare function createAuditLog(auditModel: typeof Model, entry: AuditLogEntry): Promise<any>;
/**
 * Queries audit logs with filtering and pagination.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Record<string, any>} filters - Query filters
 * @param {number} limit - Result limit
 * @param {number} offset - Result offset
 * @returns {Promise<{rows: any[], count: number}>} Audit logs
 *
 * @example
 * const logs = await queryAuditLogs(AuditLog, {
 *   userId: 'user-123',
 *   action: 'UPDATE',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * }, 100, 0);
 */
export declare function queryAuditLogs(auditModel: typeof Model, filters: Record<string, any>, limit?: number, offset?: number): Promise<{
    rows: any[];
    count: number;
}>;
/**
 * Tracks data access for HIPAA compliance.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {string} resourceType - Resource type (patient, medical_record)
 * @param {string} resourceId - Resource ID
 * @param {string} action - Action performed
 * @param {Record<string, any>} context - Additional context
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await trackDataAccess(AuditLog, 'user-123', 'patient', 'patient-456', 'READ', {
 *   ipAddress: '192.168.1.1'
 * });
 */
export declare function trackDataAccess(auditModel: typeof Model, userId: string, resourceType: string, resourceId: string, action: string, context?: Record<string, any>): Promise<any>;
/**
 * Logs security events (login, logout, failed attempts).
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {string} event - Security event type
 * @param {boolean} success - Whether event succeeded
 * @param {Record<string, any>} context - Additional context
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await logSecurityEvent(AuditLog, 'user-123', 'LOGIN', true, {
 *   ipAddress: '192.168.1.1'
 * });
 */
export declare function logSecurityEvent(auditModel: typeof Model, userId: string, event: string, success: boolean, context?: Record<string, any>): Promise<any>;
/**
 * Generates audit trail for a specific resource.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @returns {Promise<any[]>} Audit trail
 *
 * @example
 * const trail = await generateAuditTrail(AuditLog, 'patient', 'patient-456');
 */
export declare function generateAuditTrail(auditModel: typeof Model, resourceType: string, resourceId: string): Promise<any[]>;
/**
 * Exports audit logs to CSV format.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Record<string, any>} filters - Query filters
 * @returns {Promise<string>} CSV content
 *
 * @example
 * const csv = await exportAuditLogsToCSV(AuditLog, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 */
export declare function exportAuditLogsToCSV(auditModel: typeof Model, filters: Record<string, any>): Promise<string>;
/**
 * Processes GDPR data access request (right to access).
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {string} userId - User ID
 * @param {string} requestedBy - Requester ID
 * @param {() => Promise<any>} dataCollector - Function to collect user data
 * @returns {Promise<any>} GDPR request record
 *
 * @example
 * const request = await processDataAccessRequest(GDPRRequest, 'user-123', 'user-123', async () => {
 *   return await collectAllUserData('user-123');
 * });
 */
export declare function processDataAccessRequest(gdprModel: typeof Model, userId: string, requestedBy: string, dataCollector: () => Promise<any>): Promise<any>;
/**
 * Processes GDPR data erasure request (right to be forgotten).
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {string} userId - User ID
 * @param {string} requestedBy - Requester ID
 * @param {() => Promise<void>} dataEraser - Function to erase user data
 * @returns {Promise<any>} GDPR request record
 *
 * @example
 * const request = await processDataErasureRequest(GDPRRequest, 'user-123', 'user-123', async () => {
 *   await eraseAllUserData('user-123');
 * });
 */
export declare function processDataErasureRequest(gdprModel: typeof Model, userId: string, requestedBy: string, dataEraser: () => Promise<void>): Promise<any>;
/**
 * Processes GDPR data portability request.
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {string} userId - User ID
 * @param {string} requestedBy - Requester ID
 * @param {() => Promise<any>} dataExporter - Function to export user data
 * @param {string} format - Export format
 * @returns {Promise<any>} GDPR request record
 *
 * @example
 * const request = await processDataPortabilityRequest(GDPRRequest, 'user-123', 'user-123', async () => {
 *   return await exportUserData('user-123');
 * }, 'json');
 */
export declare function processDataPortabilityRequest(gdprModel: typeof Model, userId: string, requestedBy: string, dataExporter: () => Promise<any>, format?: string): Promise<any>;
/**
 * Anonymizes user data while preserving analytics capability.
 *
 * @param {Record<string, any>} userData - User data to anonymize
 * @param {AnonymizationConfig} config - Anonymization configuration
 * @returns {Record<string, any>} Anonymized data
 *
 * @example
 * const anonymized = anonymizeUserData(userData, {
 *   strategy: 'hash',
 *   fields: ['email', 'phone'],
 *   salt: 'random-salt'
 * });
 */
export declare function anonymizeUserData(userData: Record<string, any>, config: AnonymizationConfig): Record<string, any>;
/**
 * Checks if user has active consent for specific purpose.
 *
 * @param {typeof Model} consentModel - Consent record model
 * @param {string} userId - User ID
 * @param {string} consentType - Consent type
 * @returns {Promise<boolean>} Consent status
 *
 * @example
 * const hasConsent = await checkUserConsent(ConsentRecord, 'user-123', 'data_processing');
 */
export declare function checkUserConsent(consentModel: typeof Model, userId: string, consentType: string): Promise<boolean>;
/**
 * Records user consent with version tracking.
 *
 * @param {typeof Model} consentModel - Consent record model
 * @param {ConsentRecord} consent - Consent record
 * @returns {Promise<any>} Created consent record
 *
 * @example
 * await recordUserConsent(ConsentRecord, {
 *   userId: 'user-123',
 *   consentType: 'data_processing',
 *   purpose: 'Healthcare analytics',
 *   granted: true,
 *   version: '1.0'
 * });
 */
export declare function recordUserConsent(consentModel: typeof Model, consent: ConsentRecord): Promise<any>;
/**
 * Applies data retention policy to resources.
 *
 * @param {typeof Model} resourceModel - Resource model
 * @param {DataRetentionPolicy} policy - Retention policy
 * @param {(resource: any) => Promise<void>} archiver - Archive function
 * @returns {Promise<number>} Number of processed resources
 *
 * @example
 * const processed = await applyRetentionPolicy(Document, {
 *   resourceType: 'document',
 *   retentionPeriodDays: 365,
 *   archiveBeforeDelete: true,
 *   anonymizeBeforeDelete: false,
 *   legalHoldExempt: false
 * }, archiveDocument);
 */
export declare function applyRetentionPolicy(resourceModel: typeof Model, policy: DataRetentionPolicy, archiver?: (resource: any) => Promise<void>): Promise<number>;
/**
 * Creates legal hold on data to prevent deletion.
 *
 * @param {typeof Model} holdModel - Legal hold model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @param {string} reason - Hold reason
 * @param {string} initiatedBy - User who initiated hold
 * @returns {Promise<any>} Legal hold record
 *
 * @example
 * await createLegalHold(LegalHold, 'patient', 'patient-123', 'Litigation', 'admin-456');
 */
export declare function createLegalHold(holdModel: typeof Model, resourceType: string, resourceId: string, reason: string, initiatedBy: string): Promise<any>;
/**
 * Checks if resource is under legal hold.
 *
 * @param {typeof Model} holdModel - Legal hold model
 * @param {string} resourceType - Resource type
 * @param {string} resourceId - Resource ID
 * @returns {Promise<boolean>} Hold status
 *
 * @example
 * const onHold = await isUnderLegalHold(LegalHold, 'patient', 'patient-123');
 */
export declare function isUnderLegalHold(holdModel: typeof Model, resourceType: string, resourceId: string): Promise<boolean>;
/**
 * Archives old data to cold storage.
 *
 * @param {typeof Model} resourceModel - Resource model
 * @param {number} daysOld - Archive resources older than this
 * @param {(resource: any) => Promise<void>} archiver - Archive function
 * @returns {Promise<number>} Number of archived resources
 *
 * @example
 * const archived = await archiveOldData(Document, 365, async (doc) => {
 *   await uploadToGlacier(doc);
 * });
 */
export declare function archiveOldData(resourceModel: typeof Model, daysOld: number, archiver: (resource: any) => Promise<void>): Promise<number>;
/**
 * Purges expired audit logs based on retention policy.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {number} retentionDays - Retention period in days
 * @returns {Promise<number>} Number of purged logs
 *
 * @example
 * const purged = await purgeExpiredAuditLogs(AuditLog, 2555); // 7 years HIPAA
 */
export declare function purgeExpiredAuditLogs(auditModel: typeof Model, retentionDays: number): Promise<number>;
/**
 * Generates HIPAA compliance report.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<ComplianceReport>} Compliance report
 *
 * @example
 * const report = await generateHIPAAReport(AuditLog, new Date('2024-01-01'), new Date('2024-12-31'));
 */
export declare function generateHIPAAReport(auditModel: typeof Model, startDate: Date, endDate: Date): Promise<ComplianceReport>;
/**
 * Generates GDPR compliance report.
 *
 * @param {typeof Model} gdprModel - GDPR request model
 * @param {typeof Model} consentModel - Consent record model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<ComplianceReport>} Compliance report
 *
 * @example
 * const report = await generateGDPRReport(GDPRRequest, ConsentRecord, startDate, endDate);
 */
export declare function generateGDPRReport(gdprModel: typeof Model, consentModel: typeof Model, startDate: Date, endDate: Date): Promise<ComplianceReport>;
/**
 * Generates user activity report.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Activity report
 *
 * @example
 * const report = await generateUserActivityReport(AuditLog, 'user-123', startDate, endDate);
 */
export declare function generateUserActivityReport(auditModel: typeof Model, userId: string, startDate: Date, endDate: Date): Promise<Record<string, any>>;
/**
 * Detects suspicious activity patterns.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User ID
 * @param {number} hours - Hours to analyze
 * @returns {Promise<Array<{pattern: string, count: number, severity: string}>>} Detected patterns
 *
 * @example
 * const patterns = await detectSuspiciousActivity(AuditLog, 'user-123', 24);
 */
export declare function detectSuspiciousActivity(auditModel: typeof Model, userId: string, hours?: number): Promise<Array<{
    pattern: string;
    count: number;
    severity: string;
}>>;
/**
 * Generates data breach impact assessment.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} resourceType - Affected resource type
 * @param {string[]} resourceIds - Affected resource IDs
 * @param {Date} breachDate - Breach date
 * @returns {Promise<Record<string, any>>} Impact assessment
 *
 * @example
 * const assessment = await generateBreachAssessment(AuditLog, 'patient', ['p1', 'p2'], new Date());
 */
export declare function generateBreachAssessment(auditModel: typeof Model, resourceType: string, resourceIds: string[], breachDate: Date): Promise<Record<string, any>>;
/**
 * Logs access control decision.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {AccessControlLog} accessLog - Access control log
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await logAccessControl(AuditLog, {
 *   userId: 'user-123',
 *   resource: 'patient',
 *   action: 'READ',
 *   granted: true,
 *   timestamp: new Date()
 * });
 */
export declare function logAccessControl(auditModel: typeof Model, accessLog: AccessControlLog): Promise<any>;
/**
 * Tracks permission changes.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User whose permissions changed
 * @param {string} changedBy - User who made the change
 * @param {any} oldPermissions - Old permissions
 * @param {any} newPermissions - New permissions
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await trackPermissionChange(AuditLog, 'user-123', 'admin-456', oldPerms, newPerms);
 */
export declare function trackPermissionChange(auditModel: typeof Model, userId: string, changedBy: string, oldPermissions: any, newPermissions: any): Promise<any>;
/**
 * Logs role assignment changes.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} userId - User whose role changed
 * @param {string} changedBy - User who made the change
 * @param {string[]} oldRoles - Old roles
 * @param {string[]} newRoles - New roles
 * @returns {Promise<any>} Audit log entry
 *
 * @example
 * await logRoleChange(AuditLog, 'user-123', 'admin-456', ['user'], ['user', 'admin']);
 */
export declare function logRoleChange(auditModel: typeof Model, userId: string, changedBy: string, oldRoles: string[], newRoles: string[]): Promise<any>;
/**
 * Generates access control report.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Access control report
 *
 * @example
 * const report = await generateAccessControlReport(AuditLog, startDate, endDate);
 */
export declare function generateAccessControlReport(auditModel: typeof Model, startDate: Date, endDate: Date): Promise<Record<string, any>>;
/**
 * Validates data minimization compliance.
 *
 * @param {Record<string, any>} data - Data to validate
 * @param {string[]} requiredFields - Required fields only
 * @returns {boolean} Validation result
 *
 * @example
 * const compliant = validateDataMinimization(userData, ['id', 'name', 'email']);
 */
export declare function validateDataMinimization(data: Record<string, any>, requiredFields: string[]): boolean;
/**
 * Tracks data processing activities (GDPR Article 30).
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} processingActivity - Activity description
 * @param {string} purpose - Processing purpose
 * @param {string} legalBasis - Legal basis
 * @param {string[]} dataCategories - Data categories
 * @param {string[]} recipients - Data recipients
 * @returns {Promise<any>} Processing record
 *
 * @example
 * await trackDataProcessing(AuditLog, 'Patient analytics', 'Healthcare improvement', 'Legitimate interest', ['health'], ['analysts']);
 */
export declare function trackDataProcessing(auditModel: typeof Model, processingActivity: string, purpose: string, legalBasis: string, dataCategories: string[], recipients: string[]): Promise<any>;
/**
 * Generates data protection impact assessment (DPIA).
 *
 * @param {string} processingActivity - Processing activity
 * @param {string[]} risks - Identified risks
 * @param {string[]} mitigations - Mitigation measures
 * @returns {Record<string, any>} DPIA report
 *
 * @example
 * const dpia = generateDPIA('AI analytics', ['bias'], ['regular audits']);
 */
export declare function generateDPIA(processingActivity: string, risks: string[], mitigations: string[]): Record<string, any>;
/**
 * Implements purpose limitation checks.
 *
 * @param {string} dataPurpose - Original data collection purpose
 * @param {string} usagePurpose - Current usage purpose
 * @returns {boolean} Compliance status
 *
 * @example
 * const compliant = checkPurposeLimitation('Treatment', 'Research');
 */
export declare function checkPurposeLimitation(dataPurpose: string, usagePurpose: string): boolean;
/**
 * Tracks cross-border data transfers.
 *
 * @param {typeof Model} auditModel - Audit log model
 * @param {string} dataType - Type of data transferred
 * @param {string} sourceCountry - Source country
 * @param {string} destCountry - Destination country
 * @param {string} legalMechanism - Legal mechanism (adequacy, BCR, SCC)
 * @returns {Promise<any>} Transfer record
 *
 * @example
 * await trackCrossBorderTransfer(AuditLog, 'patient_data', 'US', 'EU', 'SCC');
 */
export declare function trackCrossBorderTransfer(auditModel: typeof Model, dataType: string, sourceCountry: string, destCountry: string, legalMechanism: string): Promise<any>;
/**
 * Implements data accuracy verification.
 *
 * @param {Record<string, any>} data - Data to verify
 * @param {Date} lastUpdated - Last update date
 * @param {number} staleDays - Days before data is stale
 * @returns {boolean} Accuracy status
 *
 * @example
 * const accurate = verifyDataAccuracy(userData, lastUpdated, 90);
 */
export declare function verifyDataAccuracy(data: Record<string, any>, lastUpdated: Date, staleDays?: number): boolean;
/**
 * Generates privacy notice template.
 *
 * @param {string} organization - Organization name
 * @param {string[]} purposes - Data processing purposes
 * @param {string[]} categories - Data categories
 * @returns {Record<string, any>} Privacy notice
 *
 * @example
 * const notice = generatePrivacyNotice('Hospital', ['Treatment'], ['Health data']);
 */
export declare function generatePrivacyNotice(organization: string, purposes: string[], categories: string[]): Record<string, any>;
/**
 * Implements storage limitation checks.
 *
 * @param {Date} dataCreatedAt - Data creation date
 * @param {number} retentionDays - Retention period
 * @returns {boolean} Should delete
 *
 * @example
 * const shouldDelete = checkStorageLimitation(createdAt, 365);
 */
export declare function checkStorageLimitation(dataCreatedAt: Date, retentionDays: number): boolean;
/**
 * NestJS Injectable Audit Service with comprehensive logging.
 *
 * @example
 * @Injectable()
 * export class UserService {
 *   constructor(private auditService: AuditService) {}
 *
 *   async updateUser(id: string, data: any) {
 *     await this.auditService.log('UPDATE', 'user', id, 'success');
 *     return this.userRepo.update(id, data);
 *   }
 * }
 */
export declare class AuditService {
    private auditModel;
    constructor(auditModel: typeof Model);
    log(action: string, resource: string, resourceId: string | undefined, outcome: 'success' | 'failure' | 'partial', metadata?: Record<string, any>): Promise<any>;
    trackAccess(userId: string, resource: string, resourceId: string, context: Record<string, any>): Promise<any>;
}
/**
 * NestJS Audit Interceptor for automatic request logging.
 *
 * @example
 * @UseInterceptors(AuditInterceptor)
 * @Controller('patients')
 * export class PatientController {
 *   @Get(':id')
 *   getPatient(@Param('id') id: string) {
 *     return this.patientService.findOne(id);
 *   }
 * }
 */
export declare class AuditInterceptor implements NestInterceptor {
    private auditService;
    constructor(auditService: AuditService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
export {};
//# sourceMappingURL=audit-compliance-kit.d.ts.map