/**
 * LOC: LEGLH2345678
 * File: /reuse/legal/legal-hold-preservation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable legal utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend legal services
 *   - Compliance management modules
 *   - Discovery processing services
 *   - Records management systems
 */
/**
 * File: /reuse/legal/legal-hold-preservation-kit.ts
 * Locator: WC-LEGAL-LH-001
 * Purpose: Enterprise-grade Legal Hold and Data Preservation - hold notices, custodian management, preservation scope, data source tracking, release procedures
 *
 * Upstream: Independent utility module for legal hold operations
 * Downstream: ../backend/legal/*, legal controllers, compliance services, discovery processors, records management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38 functions for legal hold operations for litigation readiness and compliance
 *
 * LLM Context: Comprehensive legal hold utilities for production-ready legal applications.
 * Provides legal hold notice creation, custodian acknowledgment tracking, preservation scope definition,
 * data source identification, release procedures, audit trails, compliance reporting, escalation workflows,
 * custodian interviews, preservation verification, and defensible disposition.
 */
import { Sequelize, Transaction } from 'sequelize';
interface LegalHoldNoticeData {
    matterName: string;
    matterNumber: string;
    issueDate: Date;
    effectiveDate: Date;
    description: string;
    preservationScope: string;
    relevantTimeframe: {
        startDate: Date;
        endDate?: Date;
    };
    keywords: string[];
    custodianIds: string[];
    dataSources: string[];
    issuedBy: string;
    legalCounsel?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'draft' | 'active' | 'released' | 'expired';
    metadata?: Record<string, any>;
}
interface CustodianData {
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    title: string;
    location: string;
    manager?: string;
    status: 'active' | 'inactive' | 'terminated';
    metadata?: Record<string, any>;
}
interface DataSourceIdentification {
    sourceId: string;
    sourceName: string;
    sourceType: 'email' | 'file_share' | 'database' | 'cloud_storage' | 'mobile_device' | 'physical_records' | 'application' | 'backup';
    location: string;
    custodianId?: string;
    preservationMethod: 'in_place' | 'collection' | 'backup' | 'litigation_hold_flag';
    collectionDate?: Date;
    preservationStatus: 'identified' | 'preserved' | 'collected' | 'failed' | 'excluded';
    volumeEstimate?: string;
    metadata?: Record<string, any>;
}
interface PreservationScope {
    holdId: string;
    scopeType: 'broad' | 'targeted' | 'keyword' | 'custodian_based' | 'time_based';
    includedDataTypes: string[];
    excludedDataTypes?: string[];
    keywordTerms?: string[];
    dateRange: {
        startDate: Date;
        endDate?: Date;
    };
    custodianScope: 'all' | 'specific' | 'role_based';
    geographicScope?: string[];
    businessUnits?: string[];
    preservationRationale: string;
}
interface HoldReleaseData {
    holdId: string;
    releaseDate: Date;
    releaseReason: string;
    releaseType: 'full' | 'partial' | 'custodian_specific' | 'data_source_specific';
    releasedCustodians?: string[];
    releasedDataSources?: string[];
    approvedBy: string;
    legalCounselApproval: boolean;
    dispositionInstructions?: string;
    retentionPeriod?: number;
    certificateOfDisposition?: string;
}
interface CustodianInterview {
    holdId: string;
    custodianId: string;
    interviewDate: Date;
    interviewer: string;
    interviewMethod: 'in_person' | 'video_conference' | 'phone' | 'questionnaire';
    dataSources: DataSourceIdentification[];
    relevantDocuments: string[];
    notes: string;
    followUpRequired: boolean;
    followUpDate?: Date;
    completionStatus: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}
interface PreservationVerification {
    holdId: string;
    verificationDate: Date;
    verifiedBy: string;
    dataSourcesVerified: string[];
    verificationMethod: 'automated' | 'manual' | 'sampling';
    custodianSampleSize?: number;
    complianceRate: number;
    issuesFound: string[];
    remediationRequired: boolean;
    remediationDeadline?: Date;
    verificationStatus: 'pass' | 'fail' | 'partial';
}
interface EscalationWorkflow {
    holdId: string;
    escalationType: 'non_acknowledgment' | 'non_compliance' | 'data_loss' | 'scope_clarification';
    custodianId?: string;
    escalationDate: Date;
    escalatedTo: string;
    escalationReason: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    resolution?: string;
    resolvedDate?: Date;
}
interface LegalHoldAuditEntry {
    entityType: 'hold' | 'custodian' | 'data_source' | 'acknowledgment' | 'release';
    entityId: string;
    action: 'create' | 'update' | 'delete' | 'acknowledge' | 'release' | 'escalate';
    userId: string;
    timestamp: Date;
    changes: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
interface ComplianceMetrics {
    holdId: string;
    totalCustodians: number;
    acknowledgedCustodians: number;
    acknowledgmentRate: number;
    averageAcknowledgmentTime: number;
    totalDataSources: number;
    preservedDataSources: number;
    preservationRate: number;
    escalations: number;
    complianceScore: number;
    lastVerificationDate?: Date;
}
/**
 * Sequelize model for Legal Hold with matter tracking and compliance monitoring.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     LegalHold:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         matterName:
 *           type: string
 *         matterNumber:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, active, released, expired]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LegalHold model
 *
 * @example
 * ```typescript
 * const LegalHold = createLegalHoldModel(sequelize);
 * const hold = await LegalHold.create({
 *   matterName: 'Smith v. Acme Corp',
 *   matterNumber: 'LIT-2024-001',
 *   issueDate: new Date(),
 *   effectiveDate: new Date(),
 *   status: 'active',
 *   priority: 'high'
 * });
 * ```
 */
export declare const createLegalHoldModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        matterName: string;
        matterNumber: string;
        issueDate: Date;
        effectiveDate: Date;
        releaseDate: Date | null;
        description: string;
        preservationScope: string;
        relevantTimeframeStart: Date;
        relevantTimeframeEnd: Date | null;
        keywords: string[];
        issuedBy: string;
        legalCounsel: string;
        priority: string;
        status: string;
        totalCustodians: number;
        acknowledgedCustodians: number;
        totalDataSources: number;
        preservedDataSources: number;
        lastVerificationDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Custodians with acknowledgment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HoldCustodian model
 *
 * @example
 * ```typescript
 * const HoldCustodian = createHoldCustodianModel(sequelize);
 * const custodian = await HoldCustodian.create({
 *   holdId: 'hold-uuid',
 *   custodianId: 'EMP001',
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   email: 'john.smith@example.com',
 *   status: 'active'
 * });
 * ```
 */
export declare const createHoldCustodianModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        holdId: string;
        custodianId: string;
        firstName: string;
        lastName: string;
        email: string;
        department: string;
        title: string;
        location: string;
        manager: string;
        notificationSent: Date | null;
        acknowledgedDate: Date | null;
        acknowledgmentMethod: string | null;
        remindersSent: number;
        lastReminderDate: Date | null;
        exemptionRequested: boolean;
        exemptionReason: string | null;
        exemptionApproved: boolean;
        interviewCompleted: boolean;
        interviewDate: Date | null;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Data Source tracking with preservation status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HoldDataSource model
 */
export declare const createHoldDataSourceModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        holdId: string;
        sourceId: string;
        sourceName: string;
        sourceType: string;
        location: string;
        custodianId: string | null;
        preservationMethod: string;
        preservationDate: Date | null;
        collectionDate: Date | null;
        preservationStatus: string;
        volumeEstimate: string;
        collectionMethod: string | null;
        storageLocation: string | null;
        verificationDate: Date | null;
        verificationStatus: string | null;
        failureReason: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Legal Hold Audit Trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LegalHoldAuditLog model
 */
export declare const createLegalHoldAuditLogModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        entityType: string;
        entityId: string;
        holdId: string | null;
        action: string;
        userId: string;
        userName: string;
        changes: Record<string, any>;
        ipAddress: string;
        userAgent: string;
        readonly createdAt: Date;
    };
};
/**
 * Creates a new legal hold notice with custodians and scope.
 *
 * @param {LegalHoldNoticeData} noticeData - Hold notice data
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User creating hold
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<any>} Created legal hold
 *
 * @example
 * ```typescript
 * const hold = await createLegalHoldNotice({
 *   matterName: 'Smith v. Acme Corp',
 *   matterNumber: 'LIT-2024-001',
 *   issueDate: new Date(),
 *   effectiveDate: new Date(),
 *   description: 'Employment discrimination case',
 *   preservationScope: 'All communications related to performance reviews',
 *   relevantTimeframe: { startDate: new Date('2023-01-01') },
 *   keywords: ['performance', 'review', 'discrimination'],
 *   custodianIds: ['EMP001', 'EMP002'],
 *   dataSources: ['email', 'file_share'],
 *   issuedBy: 'legal-team',
 *   priority: 'high',
 *   status: 'active'
 * }, LegalHold, 'user123');
 * ```
 */
export declare const createLegalHoldNotice: (noticeData: LegalHoldNoticeData, LegalHold: any, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates legal hold notice with modifications and tracking.
 *
 * @param {string} holdId - Hold ID
 * @param {Partial<LegalHoldNoticeData>} updates - Updates to apply
 * @param {string} userId - User updating hold
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await updateLegalHoldNotice('hold-uuid', {
 *   keywords: ['performance', 'review', 'discrimination', 'termination']
 * }, 'user123', LegalHold);
 * ```
 */
export declare const updateLegalHoldNotice: (holdId: string, updates: Partial<LegalHoldNoticeData>, userId: string, LegalHold: any) => Promise<any>;
/**
 * Validates legal hold notice data for completeness and compliance.
 *
 * @param {LegalHoldNoticeData} noticeData - Notice data to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateLegalHoldNotice(noticeData);
 * if (!result.valid) {
 *   throw new Error(result.errors.join(', '));
 * }
 * ```
 */
export declare const validateLegalHoldNotice: (noticeData: LegalHoldNoticeData) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Activates a draft legal hold and triggers custodian notifications.
 *
 * @param {string} holdId - Hold ID
 * @param {string} userId - User activating hold
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Activated hold
 *
 * @example
 * ```typescript
 * const activeHold = await activateLegalHold('hold-uuid', 'user123', LegalHold);
 * ```
 */
export declare const activateLegalHold: (holdId: string, userId: string, LegalHold: any) => Promise<any>;
/**
 * Retrieves all active legal holds with filtering.
 *
 * @param {Object} filters - Filter criteria
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any[]>} Active legal holds
 *
 * @example
 * ```typescript
 * const activeHolds = await getActiveLegalHolds({ priority: 'high' }, LegalHold);
 * ```
 */
export declare const getActiveLegalHolds: (filters: {
    priority?: string;
    issuedBy?: string;
}, LegalHold: any) => Promise<any[]>;
/**
 * Adds custodians to legal hold with notification tracking.
 *
 * @param {string} holdId - Hold ID
 * @param {CustodianData[]} custodians - Custodian data array
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User adding custodians
 * @returns {Promise<any[]>} Created custodian records
 *
 * @example
 * ```typescript
 * const custodians = await addCustodiansToHold('hold-uuid', [
 *   {
 *     employeeId: 'EMP001',
 *     firstName: 'John',
 *     lastName: 'Smith',
 *     email: 'john.smith@example.com',
 *     department: 'Engineering',
 *     title: 'Senior Engineer',
 *     location: 'New York',
 *     status: 'active'
 *   }
 * ], HoldCustodian, LegalHold, 'user123');
 * ```
 */
export declare const addCustodiansToHold: (holdId: string, custodians: CustodianData[], HoldCustodian: any, LegalHold: any, userId: string) => Promise<any[]>;
/**
 * Records custodian acknowledgment of legal hold notice.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {string} method - Acknowledgment method
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} [ipAddress] - IP address of acknowledgment
 * @returns {Promise<any>} Updated custodian record
 *
 * @example
 * ```typescript
 * await recordCustodianAcknowledgment('hold-uuid', 'EMP001', 'email', HoldCustodian, LegalHold, '192.168.1.1');
 * ```
 */
export declare const recordCustodianAcknowledgment: (holdId: string, custodianId: string, method: "email" | "portal" | "in_person" | "certified_mail", HoldCustodian: any, LegalHold: any, ipAddress?: string) => Promise<any>;
/**
 * Sends reminder to custodians who haven't acknowledged.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {any} notificationService - Notification service
 * @returns {Promise<number>} Number of reminders sent
 *
 * @example
 * ```typescript
 * const reminderCount = await sendCustodianReminders('hold-uuid', HoldCustodian, notificationService);
 * ```
 */
export declare const sendCustodianReminders: (holdId: string, HoldCustodian: any, notificationService: any) => Promise<number>;
/**
 * Retrieves custodians pending acknowledgment.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any[]>} Pending custodians
 *
 * @example
 * ```typescript
 * const pending = await getPendingAcknowledgments('hold-uuid', HoldCustodian);
 * ```
 */
export declare const getPendingAcknowledgments: (holdId: string, HoldCustodian: any) => Promise<any[]>;
/**
 * Processes custodian exemption request.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {string} reason - Exemption reason
 * @param {boolean} approved - Approval decision
 * @param {string} approvedBy - User approving exemption
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any>} Updated custodian record
 *
 * @example
 * ```typescript
 * await processCustodianExemption('hold-uuid', 'EMP001', 'No relevant data', true, 'legal-counsel', HoldCustodian);
 * ```
 */
export declare const processCustodianExemption: (holdId: string, custodianId: string, reason: string, approved: boolean, approvedBy: string, HoldCustodian: any) => Promise<any>;
/**
 * Identifies and registers data sources for legal hold.
 *
 * @param {string} holdId - Hold ID
 * @param {DataSourceIdentification[]} dataSources - Data sources to identify
 * @param {Model} HoldDataSource - HoldDataSource model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User identifying sources
 * @returns {Promise<any[]>} Created data source records
 *
 * @example
 * ```typescript
 * const sources = await identifyDataSources('hold-uuid', [
 *   {
 *     sourceId: 'EMAIL-001',
 *     sourceName: 'Exchange Mailbox',
 *     sourceType: 'email',
 *     location: 'john.smith@example.com',
 *     custodianId: 'EMP001',
 *     preservationMethod: 'in_place',
 *     preservationStatus: 'identified',
 *     volumeEstimate: '10GB'
 *   }
 * ], HoldDataSource, LegalHold, 'user123');
 * ```
 */
export declare const identifyDataSources: (holdId: string, dataSources: DataSourceIdentification[], HoldDataSource: any, LegalHold: any, userId: string) => Promise<any[]>;
/**
 * Updates data source preservation status.
 *
 * @param {string} dataSourceId - Data source ID
 * @param {string} status - New preservation status
 * @param {Model} HoldDataSource - HoldDataSource model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User updating status
 * @returns {Promise<any>} Updated data source
 *
 * @example
 * ```typescript
 * await updateDataSourceStatus('source-uuid', 'preserved', HoldDataSource, LegalHold, 'user123');
 * ```
 */
export declare const updateDataSourceStatus: (dataSourceId: string, status: "identified" | "preserved" | "collected" | "failed" | "excluded", HoldDataSource: any, LegalHold: any, userId: string) => Promise<any>;
/**
 * Retrieves data sources by custodian.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any[]>} Custodian's data sources
 *
 * @example
 * ```typescript
 * const sources = await getDataSourcesByCustodian('hold-uuid', 'EMP001', HoldDataSource);
 * ```
 */
export declare const getDataSourcesByCustodian: (holdId: string, custodianId: string, HoldDataSource: any) => Promise<any[]>;
/**
 * Estimates total preservation volume for legal hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<{ totalSources: number; estimatedVolume: string; byType: Record<string, number> }>} Volume estimate
 *
 * @example
 * ```typescript
 * const volume = await estimatePreservationVolume('hold-uuid', HoldDataSource);
 * console.log(`Total volume: ${volume.estimatedVolume}`);
 * ```
 */
export declare const estimatePreservationVolume: (holdId: string, HoldDataSource: any) => Promise<{
    totalSources: number;
    estimatedVolume: string;
    byType: Record<string, number>;
}>;
/**
 * Marks data source as failed with reason.
 *
 * @param {string} dataSourceId - Data source ID
 * @param {string} reason - Failure reason
 * @param {Model} HoldDataSource - HoldDataSource model
 * @param {string} userId - User marking failure
 * @returns {Promise<any>} Updated data source
 *
 * @example
 * ```typescript
 * await markDataSourceFailed('source-uuid', 'Access denied - system unavailable', HoldDataSource, 'user123');
 * ```
 */
export declare const markDataSourceFailed: (dataSourceId: string, reason: string, HoldDataSource: any, userId: string) => Promise<any>;
/**
 * Defines preservation scope for legal hold.
 *
 * @param {PreservationScope} scope - Preservation scope definition
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await definePreservationScope({
 *   holdId: 'hold-uuid',
 *   scopeType: 'targeted',
 *   includedDataTypes: ['email', 'documents', 'instant_messages'],
 *   keywordTerms: ['discrimination', 'termination', 'performance'],
 *   dateRange: { startDate: new Date('2023-01-01'), endDate: new Date('2024-12-31') },
 *   custodianScope: 'specific',
 *   preservationRationale: 'Focused on HR-related communications'
 * }, LegalHold);
 * ```
 */
export declare const definePreservationScope: (scope: PreservationScope, LegalHold: any) => Promise<any>;
/**
 * Validates preservation scope for legal defensibility.
 *
 * @param {PreservationScope} scope - Scope to validate
 * @returns {{ valid: boolean; warnings: string[]; recommendations: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePreservationScope(scope);
 * if (!validation.valid) {
 *   console.log('Warnings:', validation.warnings);
 * }
 * ```
 */
export declare const validatePreservationScope: (scope: PreservationScope) => {
    valid: boolean;
    warnings: string[];
    recommendations: string[];
};
/**
 * Expands preservation scope with additional criteria.
 *
 * @param {string} holdId - Hold ID
 * @param {Partial<PreservationScope>} additions - Additional scope criteria
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User expanding scope
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await expandPreservationScope('hold-uuid', {
 *   keywordTerms: ['retaliation', 'complaint'],
 *   includedDataTypes: ['social_media']
 * }, LegalHold, 'user123');
 * ```
 */
export declare const expandPreservationScope: (holdId: string, additions: Partial<PreservationScope>, LegalHold: any, userId: string) => Promise<any>;
/**
 * Generates preservation scope summary report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Scope summary
 *
 * @example
 * ```typescript
 * const summary = await generateScopeSummary('hold-uuid', LegalHold, HoldDataSource);
 * ```
 */
export declare const generateScopeSummary: (holdId: string, LegalHold: any, HoldDataSource: any) => Promise<any>;
/**
 * Compares preservation scope across multiple holds.
 *
 * @param {string[]} holdIds - Array of hold IDs
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Scope comparison
 *
 * @example
 * ```typescript
 * const comparison = await comparePreservationScopes(['hold1', 'hold2'], LegalHold);
 * ```
 */
export declare const comparePreservationScopes: (holdIds: string[], LegalHold: any) => Promise<any>;
/**
 * Schedules custodian interview for data source identification.
 *
 * @param {CustodianInterview} interviewData - Interview data
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any>} Interview record
 *
 * @example
 * ```typescript
 * await scheduleCustodianInterview({
 *   holdId: 'hold-uuid',
 *   custodianId: 'EMP001',
 *   interviewDate: new Date('2024-06-01'),
 *   interviewer: 'legal-team',
 *   interviewMethod: 'video_conference',
 *   dataSources: [],
 *   relevantDocuments: [],
 *   notes: '',
 *   followUpRequired: false,
 *   completionStatus: 'scheduled'
 * }, HoldCustodian);
 * ```
 */
export declare const scheduleCustodianInterview: (interviewData: CustodianInterview, HoldCustodian: any) => Promise<any>;
/**
 * Records custodian interview completion and findings.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {Partial<CustodianInterview>} interviewResults - Interview results
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any>} Updated custodian
 *
 * @example
 * ```typescript
 * await recordInterviewCompletion('hold-uuid', 'EMP001', {
 *   notes: 'Identified 3 additional email accounts and shared drive',
 *   dataSources: [...],
 *   completionStatus: 'completed',
 *   followUpRequired: true
 * }, HoldCustodian);
 * ```
 */
export declare const recordInterviewCompletion: (holdId: string, custodianId: string, interviewResults: Partial<CustodianInterview>, HoldCustodian: any) => Promise<any>;
/**
 * Retrieves custodians pending interviews.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any[]>} Custodians pending interviews
 *
 * @example
 * ```typescript
 * const pending = await getPendingInterviews('hold-uuid', HoldCustodian);
 * ```
 */
export declare const getPendingInterviews: (holdId: string, HoldCustodian: any) => Promise<any[]>;
/**
 * Performs preservation verification audit.
 *
 * @param {PreservationVerification} verification - Verification data
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Verification results
 *
 * @example
 * ```typescript
 * const results = await performPreservationVerification({
 *   holdId: 'hold-uuid',
 *   verificationDate: new Date(),
 *   verifiedBy: 'compliance-team',
 *   dataSourcesVerified: ['source1', 'source2'],
 *   verificationMethod: 'sampling',
 *   custodianSampleSize: 10,
 *   complianceRate: 95,
 *   issuesFound: ['One mailbox not preserved'],
 *   remediationRequired: true,
 *   verificationStatus: 'partial'
 * }, LegalHold, HoldDataSource);
 * ```
 */
export declare const performPreservationVerification: (verification: PreservationVerification, LegalHold: any, HoldDataSource: any) => Promise<any>;
/**
 * Generates preservation compliance report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<ComplianceMetrics>} Compliance metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateComplianceReport('hold-uuid', LegalHold, HoldCustodian, HoldDataSource);
 * console.log(`Compliance score: ${metrics.complianceScore}`);
 * ```
 */
export declare const generateComplianceReport: (holdId: string, LegalHold: any, HoldCustodian: any, HoldDataSource: any) => Promise<ComplianceMetrics>;
/**
 * Identifies preservation compliance gaps.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any[]>} Compliance gaps
 *
 * @example
 * ```typescript
 * const gaps = await identifyComplianceGaps('hold-uuid', HoldCustodian, HoldDataSource);
 * ```
 */
export declare const identifyComplianceGaps: (holdId: string, HoldCustodian: any, HoldDataSource: any) => Promise<any[]>;
/**
 * Releases legal hold fully or partially.
 *
 * @param {HoldReleaseData} releaseData - Release data
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {string} userId - User releasing hold
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await releaseLegalHold({
 *   holdId: 'hold-uuid',
 *   releaseDate: new Date(),
 *   releaseReason: 'Matter settled',
 *   releaseType: 'full',
 *   approvedBy: 'legal-counsel',
 *   legalCounselApproval: true,
 *   dispositionInstructions: 'Delete data after 90 days'
 * }, LegalHold, HoldCustodian, 'user123');
 * ```
 */
export declare const releaseLegalHold: (releaseData: HoldReleaseData, LegalHold: any, HoldCustodian: any, userId: string) => Promise<any>;
/**
 * Validates release prerequisites before releasing hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<{ canRelease: boolean; blockers: string[] }>} Release validation
 *
 * @example
 * ```typescript
 * const validation = await validateReleasePrerequisites('hold-uuid', HoldDataSource);
 * if (!validation.canRelease) {
 *   console.log('Blockers:', validation.blockers);
 * }
 * ```
 */
export declare const validateReleasePrerequisites: (holdId: string, HoldDataSource: any) => Promise<{
    canRelease: boolean;
    blockers: string[];
}>;
/**
 * Generates certificate of disposition for released hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<string>} Certificate content
 *
 * @example
 * ```typescript
 * const certificate = await generateDispositionCertificate('hold-uuid', LegalHold);
 * ```
 */
export declare const generateDispositionCertificate: (holdId: string, LegalHold: any) => Promise<string>;
/**
 * Archives released legal hold for retention.
 *
 * @param {string} holdId - Hold ID
 * @param {number} retentionYears - Retention period in years
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Archived hold
 *
 * @example
 * ```typescript
 * await archiveReleasedHold('hold-uuid', 7, LegalHold);
 * ```
 */
export declare const archiveReleasedHold: (holdId: string, retentionYears: number, LegalHold: any) => Promise<any>;
/**
 * Creates escalation for non-compliance or issues.
 *
 * @param {EscalationWorkflow} escalation - Escalation data
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User creating escalation
 * @returns {Promise<any>} Escalation record
 *
 * @example
 * ```typescript
 * await createEscalation({
 *   holdId: 'hold-uuid',
 *   escalationType: 'non_acknowledgment',
 *   custodianId: 'EMP001',
 *   escalationDate: new Date(),
 *   escalatedTo: 'manager',
 *   escalationReason: 'No response after 3 reminders',
 *   priority: 'high',
 *   status: 'open'
 * }, LegalHold, 'user123');
 * ```
 */
export declare const createEscalation: (escalation: EscalationWorkflow, LegalHold: any, userId: string) => Promise<any>;
/**
 * Resolves escalation with outcome.
 *
 * @param {string} holdId - Hold ID
 * @param {string} escalationId - Escalation ID
 * @param {string} resolution - Resolution description
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User resolving escalation
 * @returns {Promise<any>} Resolved escalation
 *
 * @example
 * ```typescript
 * await resolveEscalation('hold-uuid', 'ESC-123', 'Custodian acknowledged after manager contact', LegalHold, 'user123');
 * ```
 */
export declare const resolveEscalation: (holdId: string, escalationId: string, resolution: string, LegalHold: any, userId: string) => Promise<any>;
/**
 * Retrieves open escalations for legal hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any[]>} Open escalations
 *
 * @example
 * ```typescript
 * const openEscalations = await getOpenEscalations('hold-uuid', LegalHold);
 * ```
 */
export declare const getOpenEscalations: (holdId: string, LegalHold: any) => Promise<any[]>;
/**
 * Generates escalation summary report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Escalation summary
 *
 * @example
 * ```typescript
 * const summary = await generateEscalationSummary('hold-uuid', LegalHold);
 * ```
 */
export declare const generateEscalationSummary: (holdId: string, LegalHold: any) => Promise<any>;
/**
 * Logs audit event for legal hold operations.
 *
 * @param {LegalHoldAuditEntry} auditData - Audit entry data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logLegalHoldAudit({
 *   entityType: 'hold',
 *   entityId: 'hold-uuid',
 *   holdId: 'hold-uuid',
 *   action: 'create',
 *   userId: 'user123',
 *   timestamp: new Date(),
 *   changes: { ... }
 * });
 * ```
 */
export declare const logLegalHoldAudit: (auditData: LegalHoldAuditEntry) => Promise<void>;
/**
 * Generates comprehensive legal hold status report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Status report
 *
 * @example
 * ```typescript
 * const report = await generateHoldStatusReport('hold-uuid', LegalHold, HoldCustodian, HoldDataSource);
 * ```
 */
export declare const generateHoldStatusReport: (holdId: string, LegalHold: any, HoldCustodian: any, HoldDataSource: any) => Promise<any>;
/**
 * Exports legal hold audit trail.
 *
 * @param {string} holdId - Hold ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} LegalHoldAuditLog - LegalHoldAuditLog model
 * @returns {Promise<string>} Audit trail CSV
 *
 * @example
 * ```typescript
 * const csv = await exportLegalHoldAuditTrail('hold-uuid', startDate, endDate, LegalHoldAuditLog);
 * ```
 */
export declare const exportLegalHoldAuditTrail: (holdId: string, startDate: Date, endDate: Date, LegalHoldAuditLog: any) => Promise<string>;
/**
 * Generates defensibility report for litigation readiness.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Defensibility report
 *
 * @example
 * ```typescript
 * const report = await generateDefensibilityReport('hold-uuid', LegalHold, HoldCustodian, HoldDataSource);
 * console.log(`Defensibility score: ${report.defensibilityScore}`);
 * ```
 */
export declare const generateDefensibilityReport: (holdId: string, LegalHold: any, HoldCustodian: any, HoldDataSource: any) => Promise<any>;
/**
 * NestJS Injectable service for Legal Hold management.
 *
 * @example
 * ```typescript
 * @Controller('legal-holds')
 * export class LegalHoldController {
 *   constructor(private readonly legalHoldService: LegalHoldService) {}
 *
 *   @Post()
 *   async createHold(@Body() data: LegalHoldNoticeData) {
 *     return this.legalHoldService.createHold(data);
 *   }
 * }
 * ```
 */
export declare class LegalHoldService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createHold(data: LegalHoldNoticeData, userId: string): Promise<any>;
    addCustodians(holdId: string, custodians: CustodianData[], userId: string): Promise<any[]>;
    generateStatusReport(holdId: string): Promise<any>;
    releaseHold(releaseData: HoldReleaseData, userId: string): Promise<any>;
}
/**
 * Default export with all legal hold utilities.
 */
declare const _default: {
    createLegalHoldModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            matterName: string;
            matterNumber: string;
            issueDate: Date;
            effectiveDate: Date;
            releaseDate: Date | null;
            description: string;
            preservationScope: string;
            relevantTimeframeStart: Date;
            relevantTimeframeEnd: Date | null;
            keywords: string[];
            issuedBy: string;
            legalCounsel: string;
            priority: string;
            status: string;
            totalCustodians: number;
            acknowledgedCustodians: number;
            totalDataSources: number;
            preservedDataSources: number;
            lastVerificationDate: Date | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createHoldCustodianModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            holdId: string;
            custodianId: string;
            firstName: string;
            lastName: string;
            email: string;
            department: string;
            title: string;
            location: string;
            manager: string;
            notificationSent: Date | null;
            acknowledgedDate: Date | null;
            acknowledgmentMethod: string | null;
            remindersSent: number;
            lastReminderDate: Date | null;
            exemptionRequested: boolean;
            exemptionReason: string | null;
            exemptionApproved: boolean;
            interviewCompleted: boolean;
            interviewDate: Date | null;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createHoldDataSourceModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            holdId: string;
            sourceId: string;
            sourceName: string;
            sourceType: string;
            location: string;
            custodianId: string | null;
            preservationMethod: string;
            preservationDate: Date | null;
            collectionDate: Date | null;
            preservationStatus: string;
            volumeEstimate: string;
            collectionMethod: string | null;
            storageLocation: string | null;
            verificationDate: Date | null;
            verificationStatus: string | null;
            failureReason: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createLegalHoldAuditLogModel: (sequelize: Sequelize) => {
        new (): {
            id: string;
            entityType: string;
            entityId: string;
            holdId: string | null;
            action: string;
            userId: string;
            userName: string;
            changes: Record<string, any>;
            ipAddress: string;
            userAgent: string;
            readonly createdAt: Date;
        };
    };
    createLegalHoldNotice: (noticeData: LegalHoldNoticeData, LegalHold: any, userId: string, transaction?: Transaction) => Promise<any>;
    updateLegalHoldNotice: (holdId: string, updates: Partial<LegalHoldNoticeData>, userId: string, LegalHold: any) => Promise<any>;
    validateLegalHoldNotice: (noticeData: LegalHoldNoticeData) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    activateLegalHold: (holdId: string, userId: string, LegalHold: any) => Promise<any>;
    getActiveLegalHolds: (filters: {
        priority?: string;
        issuedBy?: string;
    }, LegalHold: any) => Promise<any[]>;
    addCustodiansToHold: (holdId: string, custodians: CustodianData[], HoldCustodian: any, LegalHold: any, userId: string) => Promise<any[]>;
    recordCustodianAcknowledgment: (holdId: string, custodianId: string, method: "email" | "portal" | "in_person" | "certified_mail", HoldCustodian: any, LegalHold: any, ipAddress?: string) => Promise<any>;
    sendCustodianReminders: (holdId: string, HoldCustodian: any, notificationService: any) => Promise<number>;
    getPendingAcknowledgments: (holdId: string, HoldCustodian: any) => Promise<any[]>;
    processCustodianExemption: (holdId: string, custodianId: string, reason: string, approved: boolean, approvedBy: string, HoldCustodian: any) => Promise<any>;
    identifyDataSources: (holdId: string, dataSources: DataSourceIdentification[], HoldDataSource: any, LegalHold: any, userId: string) => Promise<any[]>;
    updateDataSourceStatus: (dataSourceId: string, status: "identified" | "preserved" | "collected" | "failed" | "excluded", HoldDataSource: any, LegalHold: any, userId: string) => Promise<any>;
    getDataSourcesByCustodian: (holdId: string, custodianId: string, HoldDataSource: any) => Promise<any[]>;
    estimatePreservationVolume: (holdId: string, HoldDataSource: any) => Promise<{
        totalSources: number;
        estimatedVolume: string;
        byType: Record<string, number>;
    }>;
    markDataSourceFailed: (dataSourceId: string, reason: string, HoldDataSource: any, userId: string) => Promise<any>;
    definePreservationScope: (scope: PreservationScope, LegalHold: any) => Promise<any>;
    validatePreservationScope: (scope: PreservationScope) => {
        valid: boolean;
        warnings: string[];
        recommendations: string[];
    };
    expandPreservationScope: (holdId: string, additions: Partial<PreservationScope>, LegalHold: any, userId: string) => Promise<any>;
    generateScopeSummary: (holdId: string, LegalHold: any, HoldDataSource: any) => Promise<any>;
    comparePreservationScopes: (holdIds: string[], LegalHold: any) => Promise<any>;
    scheduleCustodianInterview: (interviewData: CustodianInterview, HoldCustodian: any) => Promise<any>;
    recordInterviewCompletion: (holdId: string, custodianId: string, interviewResults: Partial<CustodianInterview>, HoldCustodian: any) => Promise<any>;
    getPendingInterviews: (holdId: string, HoldCustodian: any) => Promise<any[]>;
    performPreservationVerification: (verification: PreservationVerification, LegalHold: any, HoldDataSource: any) => Promise<any>;
    generateComplianceReport: (holdId: string, LegalHold: any, HoldCustodian: any, HoldDataSource: any) => Promise<ComplianceMetrics>;
    identifyComplianceGaps: (holdId: string, HoldCustodian: any, HoldDataSource: any) => Promise<any[]>;
    releaseLegalHold: (releaseData: HoldReleaseData, LegalHold: any, HoldCustodian: any, userId: string) => Promise<any>;
    validateReleasePrerequisites: (holdId: string, HoldDataSource: any) => Promise<{
        canRelease: boolean;
        blockers: string[];
    }>;
    generateDispositionCertificate: (holdId: string, LegalHold: any) => Promise<string>;
    archiveReleasedHold: (holdId: string, retentionYears: number, LegalHold: any) => Promise<any>;
    createEscalation: (escalation: EscalationWorkflow, LegalHold: any, userId: string) => Promise<any>;
    resolveEscalation: (holdId: string, escalationId: string, resolution: string, LegalHold: any, userId: string) => Promise<any>;
    getOpenEscalations: (holdId: string, LegalHold: any) => Promise<any[]>;
    generateEscalationSummary: (holdId: string, LegalHold: any) => Promise<any>;
    logLegalHoldAudit: (auditData: LegalHoldAuditEntry) => Promise<void>;
    generateHoldStatusReport: (holdId: string, LegalHold: any, HoldCustodian: any, HoldDataSource: any) => Promise<any>;
    exportLegalHoldAuditTrail: (holdId: string, startDate: Date, endDate: Date, LegalHoldAuditLog: any) => Promise<string>;
    generateDefensibilityReport: (holdId: string, LegalHold: any, HoldCustodian: any, HoldDataSource: any) => Promise<any>;
    LegalHoldService: typeof LegalHoldService;
};
export default _default;
//# sourceMappingURL=legal-hold-preservation-kit.d.ts.map