/**
 * LOC: CTFILE0001234
 * File: /reuse/legal/court-filing-docket-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable, Logger)
 *   - @nestjs/swagger (ApiOperation, ApiResponse, ApiProperty)
 *
 * DOWNSTREAM (imported by):
 *   - backend/legal/*
 *   - backend/services/court-filing.service.ts
 *   - backend/controllers/court-filing.controller.ts
 *   - backend/services/docket-tracking.service.ts
 */
/**
 * File: /reuse/legal/court-filing-docket-kit.ts
 * Locator: WC-LEGAL-CTFILE-001
 * Purpose: Court Filing & Docket Management - ECF integration, docket tracking, deadline calculations, court calendar, case status
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: Legal services, court filing controllers, case management systems, deadline tracking systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 41 production-ready functions for electronic court filing, docket management, deadline tracking, calendar management
 *
 * LLM Context: Enterprise-grade court filing and docket management utilities for legal case management systems.
 * Provides comprehensive electronic court filing (ECF) integration with retry logic, docket tracking and monitoring,
 * intelligent filing deadline calculations with court rules integration, court calendar management, case status tracking,
 * filing validation, document assembly, service tracking, appearance management, motion tracking, and comprehensive
 * audit trails. Essential for law firms, court systems, and legal departments managing complex litigation workflows.
 */
import { Sequelize, Transaction } from 'sequelize';
interface CourtSystemConfig {
    courtId: string;
    courtName: string;
    courtType: 'federal' | 'state' | 'local' | 'appellate' | 'supreme' | 'bankruptcy' | 'family' | 'probate';
    jurisdiction: string;
    ecfEnabled: boolean;
    ecfEndpoint?: string;
    ecfApiKey?: string;
    courtRules: CourtRulesConfig;
    businessHours: BusinessHoursConfig;
    timezone: string;
}
interface CourtRulesConfig {
    filingDeadlineRules: DeadlineRule[];
    extensionRules: ExtensionRule[];
    serviceRules: ServiceRule[];
    documentRequirements: DocumentRequirement[];
    filingFees: FilingFeeSchedule[];
    electronicFilingRules: ElectronicFilingRule[];
}
interface DeadlineRule {
    ruleId: string;
    ruleName: string;
    documentType: string;
    triggeringEvent: string;
    deadlineDays: number;
    deadlineType: 'calendar' | 'business' | 'court';
    excludeWeekends: boolean;
    excludeHolidays: boolean;
    extendableBy: number;
    extensionRequiresMotion: boolean;
}
interface ExtensionRule {
    documentType: string;
    maxExtensionDays: number;
    requiresCause: boolean;
    requiresCourtApproval: boolean;
    maxExtensionRequests: number;
}
interface ServiceRule {
    documentType: string;
    serviceMethods: Array<'electronic' | 'mail' | 'hand-delivery' | 'certified-mail' | 'publication'>;
    serviceDeadlineDays: number;
    proofOfServiceRequired: boolean;
}
interface DocumentRequirement {
    documentType: string;
    requiredFields: string[];
    requiredAttachments: string[];
    maximumPages?: number;
    formatRequirements: string[];
    signaturesRequired: number;
}
interface FilingFeeSchedule {
    documentType: string;
    baseFee: number;
    additionalFees: Array<{
        description: string;
        amount: number;
        condition?: string;
    }>;
}
interface ElectronicFilingRule {
    documentType: string;
    acceptedFormats: string[];
    maxFileSizeMB: number;
    requiresRedaction: boolean;
    redactionRules: string[];
}
interface BusinessHoursConfig {
    mondayToFriday: {
        open: string;
        close: string;
    };
    saturday?: {
        open: string;
        close: string;
    };
    sunday?: {
        open: string;
        close: string;
    };
    holidays: Array<{
        date: string;
        name: string;
    }>;
    courtClosures: Array<{
        startDate: string;
        endDate: string;
        reason: string;
    }>;
}
interface ECFFilingRequest {
    filingId: string;
    caseNumber: string;
    courtId: string;
    filingType: string;
    documentType: string;
    partyId: string;
    attorneyId: string;
    documents: FilingDocument[];
    serviceList: ServiceContact[];
    filingMetadata: Record<string, any>;
    urgentFiling: boolean;
    confidential: boolean;
}
interface FilingDocument {
    documentId: string;
    documentName: string;
    documentType: string;
    documentCategory: string;
    fileContent: Buffer | string;
    fileFormat: string;
    fileSizeMB: number;
    pageCount: number;
    requiresRedaction: boolean;
    redactionComplete: boolean;
    exhibits: Exhibit[];
}
interface Exhibit {
    exhibitNumber: string;
    exhibitDescription: string;
    fileContent: Buffer | string;
    fileFormat: string;
    pageCount: number;
}
interface ServiceContact {
    contactId: string;
    contactName: string;
    contactType: 'attorney' | 'party' | 'guardian' | 'trustee' | 'other';
    email: string;
    serviceMethod: 'electronic' | 'mail' | 'hand-delivery' | 'certified-mail';
    requiresConfirmation: boolean;
}
interface ECFFilingResponse {
    success: boolean;
    filingId: string;
    transactionId: string;
    confirmationNumber: string;
    filingDate: Date;
    filingTime: string;
    docketEntryNumber: string;
    stamppedDocuments: Array<{
        documentId: string;
        stamppedUrl: string;
        downloadUrl: string;
    }>;
    serviceStatus: Array<{
        contactId: string;
        status: 'sent' | 'delivered' | 'failed' | 'bounced';
        timestamp: Date;
    }>;
    errors?: Array<{
        code: string;
        message: string;
        field?: string;
    }>;
    warnings?: string[];
}
interface CourtCalendarEvent {
    eventId: string;
    caseNumber: string;
    eventType: 'hearing' | 'trial' | 'conference' | 'mediation' | 'settlement-conference' | 'status-conference' | 'motion-hearing';
    eventDate: Date;
    eventTime: string;
    courtroom: string;
    judge: string;
    estimatedDuration: number;
    parties: Array<{
        partyId: string;
        partyName: string;
        partyType: string;
    }>;
    attorneys: Array<{
        attorneyId: string;
        attorneyName: string;
        representing: string;
    }>;
    purpose: string;
    requiresAppearance: boolean;
    virtualHearingLink?: string;
    virtualHearingPlatform?: string;
    status: 'scheduled' | 'confirmed' | 'continued' | 'cancelled' | 'completed';
    continuanceReason?: string;
}
interface FilingValidationResult {
    isValid: boolean;
    errors: Array<{
        code: string;
        field: string;
        message: string;
        severity: 'error' | 'warning' | 'info';
    }>;
    warnings: string[];
    feeCalculation: {
        baseFee: number;
        additionalFees: Array<{
            description: string;
            amount: number;
        }>;
        totalFee: number;
    };
    deadlineCalculations: Array<{
        deadlineType: string;
        calculatedDate: Date;
        daysRemaining: number;
    }>;
}
interface DocketTrackingConfig {
    caseNumbers: string[];
    courtIds: string[];
    trackingFilters: {
        documentTypes?: string[];
        partyNames?: string[];
        dateRange?: {
            startDate: Date;
            endDate: Date;
        };
    };
    notificationPreferences: {
        email: boolean;
        sms: boolean;
        inApp: boolean;
        frequency: 'realtime' | 'daily-digest' | 'weekly-digest';
    };
    autoDownloadDocuments: boolean;
}
interface RetryConfig {
    maxRetries: number;
    retryDelay: number;
    retryableStatusCodes?: number[];
    retryableErrors?: string[];
    backoffStrategy?: 'fixed' | 'exponential' | 'linear';
    maxRetryDelay?: number;
}
/**
 * 1. Court Filing model for tracking all court filings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CourtFiling model
 *
 * @example
 * ```typescript
 * const CourtFiling = createCourtFilingModel(sequelize);
 * const filing = await CourtFiling.create({
 *   caseNumber: '2024-CV-12345',
 *   filingType: 'motion',
 *   documentType: 'motion-to-dismiss',
 *   status: 'pending'
 * });
 * ```
 */
export declare const createCourtFilingModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        filingNumber: string;
        caseNumber: string;
        courtId: string;
        filingType: string;
        documentType: string;
        filingDate: Date;
        filingTime: string;
        partyId: number;
        attorneyId: number;
        docketEntryNumber: string | null;
        confirmationNumber: string | null;
        ecfTransactionId: string | null;
        status: string;
        totalFee: number;
        paymentStatus: string;
        urgentFiling: boolean;
        confidential: boolean;
        serviceCompleted: boolean;
        serviceDate: Date | null;
        filingMetadata: Record<string, any>;
        createdBy: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * 2. Docket Entry model for tracking all docket entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DocketEntry model
 *
 * @example
 * ```typescript
 * const DocketEntry = createDocketEntryModel(sequelize);
 * const entry = await DocketEntry.create({
 *   caseNumber: '2024-CV-12345',
 *   entryNumber: 15,
 *   entryDate: new Date(),
 *   entryText: 'Motion to Dismiss filed by Defendant'
 * });
 * ```
 */
export declare const createDocketEntryModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        caseNumber: string;
        entryNumber: number;
        entryDate: Date;
        filingDate: Date;
        entryText: string;
        documentType: string;
        filingParty: string;
        filingAttorney: string;
        docketDescription: Text;
        paywallProtected: boolean;
        confidential: boolean;
        documentCount: number;
        filingId: number | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * 3. Filing Deadline model for tracking all filing deadlines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FilingDeadline model
 *
 * @example
 * ```typescript
 * const FilingDeadline = createFilingDeadlineModel(sequelize);
 * const deadline = await FilingDeadline.create({
 *   caseNumber: '2024-CV-12345',
 *   deadlineType: 'response',
 *   documentType: 'answer',
 *   deadlineDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare const createFilingDeadlineModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        caseNumber: string;
        deadlineType: string;
        documentType: string;
        description: string;
        triggeringEvent: string;
        triggeringDate: Date;
        deadlineDate: Date;
        deadlineTime: string;
        responsibleAttorney: string;
        responsibleParty: string;
        status: string;
        priority: string;
        extensionRequested: boolean;
        extensionGranted: boolean;
        extensionDate: Date | null;
        completedDate: Date | null;
        completedBy: string | null;
        notes: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * 4. Court Calendar model for tracking court events and hearings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CourtCalendar model
 *
 * @example
 * ```typescript
 * const CourtCalendar = createCourtCalendarModel(sequelize);
 * const event = await CourtCalendar.create({
 *   caseNumber: '2024-CV-12345',
 *   eventType: 'hearing',
 *   eventDate: new Date('2024-12-15'),
 *   courtroom: 'Courtroom 5A'
 * });
 * ```
 */
export declare const createCourtCalendarModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        caseNumber: string;
        eventType: string;
        eventDate: Date;
        eventTime: string;
        courtroom: string;
        judge: string;
        estimatedDuration: number;
        purpose: string;
        requiresAppearance: boolean;
        virtualHearingEnabled: boolean;
        virtualHearingLink: string | null;
        virtualHearingPlatform: string | null;
        status: string;
        continuanceReason: string | null;
        originalEventDate: Date | null;
        notificationSent: boolean;
        confirmationReceived: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * 5. Case Status model for tracking case information and status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CaseStatus model
 *
 * @example
 * ```typescript
 * const CaseStatus = createCaseStatusModel(sequelize);
 * const caseInfo = await CaseStatus.create({
 *   caseNumber: '2024-CV-12345',
 *   caseTitle: 'Smith v. Jones',
 *   caseType: 'civil',
 *   status: 'active'
 * });
 * ```
 */
export declare const createCaseStatusModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        caseNumber: string;
        caseTitle: string;
        caseType: string;
        courtId: string;
        filingDate: Date;
        status: string;
        phase: string;
        judge: string;
        magistrateJudge: string | null;
        jurisdiction: string;
        venueId: string;
        natureOfSuit: string;
        causeOfAction: string;
        demandAmount: number | null;
        juryDemand: boolean;
        lastActivityDate: Date;
        nextHearingDate: Date | null;
        trialDate: Date | null;
        statisticsDate: Date | null;
        closedDate: Date | null;
        disposition: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * 6. Filing Audit Log model for comprehensive audit trails.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FilingAuditLog model
 *
 * @example
 * ```typescript
 * const FilingAuditLog = createFilingAuditLogModel(sequelize);
 * await FilingAuditLog.create({
 *   filingId: 123,
 *   action: 'submitted',
 *   performedBy: 'attorney@firm.com',
 *   actionDescription: 'Filing submitted to ECF'
 * });
 * ```
 */
export declare const createFilingAuditLogModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        filingId: number;
        caseNumber: string;
        action: string;
        actionDescription: string;
        performedBy: string;
        performedAt: Date;
        ipAddress: string | null;
        userAgent: string | null;
        previousState: Record<string, any> | null;
        newState: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * 10. Executes function with retry logic.
 *
 * @param {() => Promise<T>} fn - Function to execute
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Function result
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(
 *   () => submitToECF(filingRequest),
 *   { maxRetries: 3, retryDelay: 1000, backoffStrategy: 'exponential' }
 * );
 * ```
 */
export declare const executeWithRetry: <T>(fn: () => Promise<T>, config: RetryConfig) => Promise<T>;
/**
 * 11. Validates court filing before submission with comprehensive checks.
 *
 * @param {ECFFilingRequest} filing - Filing request to validate
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @returns {Promise<FilingValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateCourtFiling(filingRequest, courtConfig);
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export declare const validateCourtFiling: (filing: ECFFilingRequest, courtConfig: CourtSystemConfig) => Promise<FilingValidationResult>;
/**
 * 12. Validates document format and content requirements.
 *
 * @param {FilingDocument} document - Document to validate
 * @param {DocumentRequirement} requirements - Document requirements
 * @returns {Promise<{ isValid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateDocumentFormat(document, requirements);
 * if (!result.isValid) {
 *   console.error('Document validation errors:', result.errors);
 * }
 * ```
 */
export declare const validateDocumentFormat: (document: FilingDocument, requirements: DocumentRequirement) => Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * 13. Validates service list completeness.
 *
 * @param {ServiceContact[]} serviceList - Service contacts to validate
 * @param {ServiceRule} serviceRules - Service rules
 * @returns {Promise<{ isValid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateServiceList(serviceList, serviceRules);
 * if (!result.isValid) {
 *   console.error('Service list errors:', result.errors);
 * }
 * ```
 */
export declare const validateServiceList: (serviceList: ServiceContact[], serviceRules: ServiceRule) => Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * 14. Submits filing to Electronic Court Filing (ECF) system with retry logic.
 *
 * @param {ECFFilingRequest} filing - Filing request
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @param {RetryConfig} retryConfig - Retry configuration
 * @returns {Promise<ECFFilingResponse>} Filing response
 *
 * @example
 * ```typescript
 * const response = await submitToECF(filingRequest, courtConfig, {
 *   maxRetries: 3,
 *   retryDelay: 2000,
 *   backoffStrategy: 'exponential'
 * });
 * console.log('Confirmation:', response.confirmationNumber);
 * ```
 */
export declare const submitToECF: (filing: ECFFilingRequest, courtConfig: CourtSystemConfig, retryConfig: RetryConfig) => Promise<ECFFilingResponse>;
/**
 * 15. Checks ECF filing status.
 *
 * @param {string} transactionId - ECF transaction ID
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @returns {Promise<{ status: string; details: any }>} Status information
 *
 * @example
 * ```typescript
 * const status = await checkECFStatus('ECF-123456', courtConfig);
 * console.log('Filing status:', status.status);
 * ```
 */
export declare const checkECFStatus: (transactionId: string, courtConfig: CourtSystemConfig) => Promise<{
    status: string;
    details: any;
}>;
/**
 * 16. Downloads stamped documents from ECF.
 *
 * @param {string} documentId - Document ID
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @returns {Promise<Buffer>} Document content
 *
 * @example
 * ```typescript
 * const document = await downloadStamppedDocument('DOC-123', courtConfig);
 * fs.writeFileSync('stampped-motion.pdf', document);
 * ```
 */
export declare const downloadStamppedDocument: (documentId: string, courtConfig: CourtSystemConfig) => Promise<Buffer>;
/**
 * 17. Retrieves service confirmation from ECF.
 *
 * @param {string} filingId - Filing ID
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @returns {Promise<Array<{ contactId: string; status: string; timestamp: Date }>>} Service status
 *
 * @example
 * ```typescript
 * const serviceStatus = await getServiceConfirmation('FIL-123', courtConfig);
 * serviceStatus.forEach(s => console.log(`${s.contactId}: ${s.status}`));
 * ```
 */
export declare const getServiceConfirmation: (filingId: string, courtConfig: CourtSystemConfig) => Promise<Array<{
    contactId: string;
    status: string;
    timestamp: Date;
}>>;
/**
 * 18. Cancels or withdraws ECF filing (if permitted).
 *
 * @param {string} transactionId - ECF transaction ID
 * @param {string} reason - Cancellation reason
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @returns {Promise<{ success: boolean; message: string }>} Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelECFFiling('ECF-123', 'Filed in error', courtConfig);
 * if (result.success) {
 *   console.log('Filing cancelled successfully');
 * }
 * ```
 */
export declare const cancelECFFiling: (transactionId: string, reason: string, courtConfig: CourtSystemConfig) => Promise<{
    success: boolean;
    message: string;
}>;
/**
 * 19. Retrieves docket entries for a case.
 *
 * @param {string} caseNumber - Case number
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Query options
 * @returns {Promise<DocketEntry[]>} Docket entries
 *
 * @example
 * ```typescript
 * const entries = await getDocketEntries('2024-CV-12345', sequelize, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export declare const getDocketEntries: (caseNumber: string, sequelize: Sequelize, options?: {
    startDate?: Date;
    endDate?: Date;
    documentType?: string;
}) => Promise<any[]>;
/**
 * 20. Monitors docket for new entries (polling approach).
 *
 * @param {DocketTrackingConfig} config - Tracking configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(entries: DocketEntry[]) => void} callback - Callback for new entries
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await monitorDocketUpdates(trackingConfig, sequelize, (newEntries) => {
 *   console.log(`Found ${newEntries.length} new docket entries`);
 *   newEntries.forEach(entry => sendNotification(entry));
 * });
 * ```
 */
export declare const monitorDocketUpdates: (config: DocketTrackingConfig, sequelize: Sequelize, callback: (entries: any[]) => void) => Promise<void>;
/**
 * 21. Searches docket entries with advanced filters.
 *
 * @param {object} searchCriteria - Search criteria
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DocketEntry[]>} Matching docket entries
 *
 * @example
 * ```typescript
 * const entries = await searchDocketEntries({
 *   caseNumber: '2024-CV-12345',
 *   documentType: 'motion',
 *   filingParty: 'Plaintiff',
 *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
 * }, sequelize);
 * ```
 */
export declare const searchDocketEntries: (searchCriteria: {
    caseNumber?: string;
    documentType?: string;
    filingParty?: string;
    entryText?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
}, sequelize: Sequelize) => Promise<any[]>;
/**
 * 22. Exports docket entries to various formats.
 *
 * @param {string} caseNumber - Case number
 * @param {string} format - Export format (pdf, csv, json)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Buffer | string>} Exported data
 *
 * @example
 * ```typescript
 * const docketSheet = await exportDocketSheet('2024-CV-12345', 'pdf', sequelize);
 * fs.writeFileSync('docket-sheet.pdf', docketSheet);
 * ```
 */
export declare const exportDocketSheet: (caseNumber: string, format: "pdf" | "csv" | "json", sequelize: Sequelize) => Promise<Buffer | string>;
/**
 * 23. Compares docket entries across multiple sources for accuracy.
 *
 * @param {string} caseNumber - Case number
 * @param {any[]} externalEntries - External docket entries
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ matches: number; discrepancies: any[] }>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareDocketSources('2024-CV-12345', pacerEntries, sequelize);
 * console.log(`Found ${comparison.discrepancies.length} discrepancies`);
 * ```
 */
export declare const compareDocketSources: (caseNumber: string, externalEntries: any[], sequelize: Sequelize) => Promise<{
    matches: number;
    discrepancies: any[];
}>;
/**
 * 24. Calculates filing deadline based on court rules.
 *
 * @param {Date} triggeringDate - Date of triggering event
 * @param {DeadlineRule} rule - Deadline rule
 * @param {BusinessHoursConfig} businessHours - Court business hours
 * @returns {Promise<Date>} Calculated deadline date
 *
 * @example
 * ```typescript
 * const deadline = await calculateFilingDeadline(
 *   new Date('2024-11-01'),
 *   { deadlineDays: 21, excludeWeekends: true, excludeHolidays: true },
 *   courtBusinessHours
 * );
 * console.log('Response due:', deadline);
 * ```
 */
export declare const calculateFilingDeadline: (triggeringDate: Date, rule: DeadlineRule, businessHours: BusinessHoursConfig) => Promise<Date>;
/**
 * 25. Checks if date falls on court business day.
 *
 * @param {Date} date - Date to check
 * @param {BusinessHoursConfig} businessHours - Court business hours
 * @returns {Promise<boolean>} Whether date is a business day
 *
 * @example
 * ```typescript
 * const isBusinessDay = await isCourtBusinessDay(new Date('2024-12-25'), businessHours);
 * if (!isBusinessDay) {
 *   console.log('Court is closed on this date');
 * }
 * ```
 */
export declare const isCourtBusinessDay: (date: Date, businessHours: BusinessHoursConfig) => Promise<boolean>;
/**
 * 26. Gets next court business day after given date.
 *
 * @param {Date} date - Starting date
 * @param {BusinessHoursConfig} businessHours - Court business hours
 * @returns {Promise<Date>} Next business day
 *
 * @example
 * ```typescript
 * const nextBusinessDay = await getNextCourtBusinessDay(new Date(), businessHours);
 * console.log('Next court date:', nextBusinessDay);
 * ```
 */
export declare const getNextCourtBusinessDay: (date: Date, businessHours: BusinessHoursConfig) => Promise<Date>;
/**
 * 27. Calculates deadline extension based on extension rules.
 *
 * @param {Date} originalDeadline - Original deadline date
 * @param {number} extensionDays - Days to extend
 * @param {ExtensionRule} rule - Extension rule
 * @param {BusinessHoursConfig} businessHours - Court business hours
 * @returns {Promise<{ newDeadline: Date; isValid: boolean; errors: string[] }>} Extension result
 *
 * @example
 * ```typescript
 * const extension = await calculateDeadlineExtension(
 *   originalDeadline,
 *   14,
 *   extensionRule,
 *   businessHours
 * );
 * if (extension.isValid) {
 *   console.log('New deadline:', extension.newDeadline);
 * }
 * ```
 */
export declare const calculateDeadlineExtension: (originalDeadline: Date, extensionDays: number, rule: ExtensionRule, businessHours: BusinessHoursConfig) => Promise<{
    newDeadline: Date;
    isValid: boolean;
    errors: string[];
}>;
/**
 * 28. Gets upcoming deadlines for case or attorney.
 *
 * @param {object} filters - Filter criteria
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Upcoming deadlines
 *
 * @example
 * ```typescript
 * const deadlines = await getUpcomingDeadlines({
 *   caseNumber: '2024-CV-12345',
 *   daysAhead: 30,
 *   priority: 'high'
 * }, sequelize);
 * ```
 */
export declare const getUpcomingDeadlines: (filters: {
    caseNumber?: string;
    responsibleAttorney?: string;
    daysAhead?: number;
    priority?: string;
}, sequelize: Sequelize) => Promise<any[]>;
/**
 * 29. Schedules court event on calendar.
 *
 * @param {CourtCalendarEvent} event - Event to schedule
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Created event
 *
 * @example
 * ```typescript
 * const event = await scheduleCourtEvent({
 *   caseNumber: '2024-CV-12345',
 *   eventType: 'hearing',
 *   eventDate: new Date('2024-12-15'),
 *   eventTime: '10:00:00',
 *   courtroom: '5A',
 *   judge: 'Hon. Jane Smith'
 * }, sequelize);
 * ```
 */
export declare const scheduleCourtEvent: (event: Partial<CourtCalendarEvent>, sequelize: Sequelize, transaction?: Transaction) => Promise<any>;
/**
 * 30. Retrieves court calendar for date range.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {object} filters - Additional filters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Calendar events
 *
 * @example
 * ```typescript
 * const events = await getCourtCalendar(
 *   new Date('2024-12-01'),
 *   new Date('2024-12-31'),
 *   { judge: 'Hon. Jane Smith', courtroom: '5A' },
 *   sequelize
 * );
 * ```
 */
export declare const getCourtCalendar: (startDate: Date, endDate: Date, filters: {
    judge?: string;
    courtroom?: string;
    caseNumber?: string;
} | undefined, sequelize: Sequelize) => Promise<any[]>;
/**
 * 31. Continues (reschedules) court event.
 *
 * @param {number} eventId - Event ID
 * @param {Date} newDate - New event date
 * @param {string} newTime - New event time
 * @param {string} reason - Continuance reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated event
 *
 * @example
 * ```typescript
 * const continued = await continueCourtEvent(
 *   123,
 *   new Date('2024-12-20'),
 *   '14:00:00',
 *   'Conflict with another hearing',
 *   sequelize
 * );
 * ```
 */
export declare const continueCourtEvent: (eventId: number, newDate: Date, newTime: string, reason: string, sequelize: Sequelize) => Promise<any>;
/**
 * 32. Cancels court event.
 *
 * @param {number} eventId - Event ID
 * @param {string} reason - Cancellation reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated event
 *
 * @example
 * ```typescript
 * const cancelled = await cancelCourtEvent(123, 'Case settled', sequelize);
 * ```
 */
export declare const cancelCourtEvent: (eventId: number, reason: string, sequelize: Sequelize) => Promise<any>;
/**
 * 33. Checks for calendar conflicts.
 *
 * @param {Date} eventDate - Event date
 * @param {string} eventTime - Event time
 * @param {number} duration - Duration in minutes
 * @param {object} context - Context (attorney, courtroom, etc.)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ hasConflict: boolean; conflicts: any[] }>} Conflict check result
 *
 * @example
 * ```typescript
 * const check = await checkCalendarConflicts(
 *   new Date('2024-12-15'),
 *   '10:00:00',
 *   60,
 *   { courtroom: '5A' },
 *   sequelize
 * );
 * if (check.hasConflict) {
 *   console.log('Conflicts found:', check.conflicts);
 * }
 * ```
 */
export declare const checkCalendarConflicts: (eventDate: Date, eventTime: string, duration: number, context: {
    courtroom?: string;
    judge?: string;
    attorneyId?: string;
}, sequelize: Sequelize) => Promise<{
    hasConflict: boolean;
    conflicts: any[];
}>;
/**
 * 34. Updates case status and phase.
 *
 * @param {string} caseNumber - Case number
 * @param {string} newStatus - New status
 * @param {string} newPhase - New phase
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated case
 *
 * @example
 * ```typescript
 * const updated = await updateCaseStatus(
 *   '2024-CV-12345',
 *   'active',
 *   'discovery',
 *   sequelize
 * );
 * ```
 */
export declare const updateCaseStatus: (caseNumber: string, newStatus: string, newPhase: string, sequelize: Sequelize) => Promise<any>;
/**
 * 35. Retrieves case status and information.
 *
 * @param {string} caseNumber - Case number
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Case information
 *
 * @example
 * ```typescript
 * const caseInfo = await getCaseStatus('2024-CV-12345', sequelize);
 * console.log('Case status:', caseInfo.status, 'Phase:', caseInfo.phase);
 * ```
 */
export declare const getCaseStatus: (caseNumber: string, sequelize: Sequelize) => Promise<any>;
/**
 * 36. Gets case activity timeline.
 *
 * @param {string} caseNumber - Case number
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Activity timeline
 *
 * @example
 * ```typescript
 * const timeline = await getCaseTimeline('2024-CV-12345', sequelize);
 * timeline.forEach(event => console.log(event.date, event.description));
 * ```
 */
export declare const getCaseTimeline: (caseNumber: string, sequelize: Sequelize) => Promise<any[]>;
/**
 * 37. Searches cases with advanced filters.
 *
 * @param {object} searchCriteria - Search criteria
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Matching cases
 *
 * @example
 * ```typescript
 * const cases = await searchCases({
 *   courtId: 'CA-SUPERIOR',
 *   status: 'active',
 *   judge: 'Hon. Jane Smith',
 *   filingDateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
 * }, sequelize);
 * ```
 */
export declare const searchCases: (searchCriteria: {
    courtId?: string;
    status?: string;
    phase?: string;
    judge?: string;
    caseType?: string;
    filingDateRange?: {
        start: Date;
        end: Date;
    };
}, sequelize: Sequelize) => Promise<any[]>;
/**
 * 38. NestJS service for court filing operations.
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [CourtFilingService],
 *   exports: [CourtFilingService],
 * })
 * export class CourtFilingModule {}
 * ```
 */
export declare class CourtFilingService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * Submits a court filing with comprehensive validation and error handling.
     */
    submitFiling(filing: ECFFilingRequest, courtConfig: CourtSystemConfig): Promise<ECFFilingResponse>;
    /**
     * Retrieves upcoming deadlines with automatic status updates.
     */
    getDeadlinesWithStatusUpdate(filters: {
        caseNumber?: string;
        responsibleAttorney?: string;
        daysAhead?: number;
    }): Promise<any[]>;
    /**
     * Monitors docket and sends notifications for new entries.
     */
    startDocketMonitoring(config: DocketTrackingConfig, notificationCallback: (entries: any[]) => Promise<void>): Promise<void>;
}
/**
 * 39. Swagger decorator for filing submission endpoint.
 *
 * @example
 * ```typescript
 * @Post('/filings/submit')
 * @SwaggerFilingSubmit()
 * async submitFiling(@Body() request: ECFFilingRequest) {
 *   return await this.filingService.submitFiling(request, courtConfig);
 * }
 * ```
 */
export declare const SwaggerFilingSubmit: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * 40. Swagger decorator for docket retrieval endpoint.
 *
 * @example
 * ```typescript
 * @Get('/docket/:caseNumber')
 * @SwaggerGetDocket()
 * async getDocket(@Param('caseNumber') caseNumber: string) {
 *   return await this.filingService.getDocketEntries(caseNumber);
 * }
 * ```
 */
export declare const SwaggerGetDocket: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * 41. Swagger decorator for deadline calculation endpoint.
 *
 * @example
 * ```typescript
 * @Post('/deadlines/calculate')
 * @SwaggerCalculateDeadline()
 * async calculateDeadline(@Body() request: DeadlineCalculationRequest) {
 *   return await this.filingService.calculateDeadline(request);
 * }
 * ```
 */
export declare const SwaggerCalculateDeadline: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
declare const _default: {
    createCourtFilingModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            filingNumber: string;
            caseNumber: string;
            courtId: string;
            filingType: string;
            documentType: string;
            filingDate: Date;
            filingTime: string;
            partyId: number;
            attorneyId: number;
            docketEntryNumber: string | null;
            confirmationNumber: string | null;
            ecfTransactionId: string | null;
            status: string;
            totalFee: number;
            paymentStatus: string;
            urgentFiling: boolean;
            confidential: boolean;
            serviceCompleted: boolean;
            serviceDate: Date | null;
            filingMetadata: Record<string, any>;
            createdBy: string;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createDocketEntryModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            caseNumber: string;
            entryNumber: number;
            entryDate: Date;
            filingDate: Date;
            entryText: string;
            documentType: string;
            filingParty: string;
            filingAttorney: string;
            docketDescription: Text;
            paywallProtected: boolean;
            confidential: boolean;
            documentCount: number;
            filingId: number | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createFilingDeadlineModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            caseNumber: string;
            deadlineType: string;
            documentType: string;
            description: string;
            triggeringEvent: string;
            triggeringDate: Date;
            deadlineDate: Date;
            deadlineTime: string;
            responsibleAttorney: string;
            responsibleParty: string;
            status: string;
            priority: string;
            extensionRequested: boolean;
            extensionGranted: boolean;
            extensionDate: Date | null;
            completedDate: Date | null;
            completedBy: string | null;
            notes: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCourtCalendarModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            caseNumber: string;
            eventType: string;
            eventDate: Date;
            eventTime: string;
            courtroom: string;
            judge: string;
            estimatedDuration: number;
            purpose: string;
            requiresAppearance: boolean;
            virtualHearingEnabled: boolean;
            virtualHearingLink: string | null;
            virtualHearingPlatform: string | null;
            status: string;
            continuanceReason: string | null;
            originalEventDate: Date | null;
            notificationSent: boolean;
            confirmationReceived: boolean;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createCaseStatusModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            caseNumber: string;
            caseTitle: string;
            caseType: string;
            courtId: string;
            filingDate: Date;
            status: string;
            phase: string;
            judge: string;
            magistrateJudge: string | null;
            jurisdiction: string;
            venueId: string;
            natureOfSuit: string;
            causeOfAction: string;
            demandAmount: number | null;
            juryDemand: boolean;
            lastActivityDate: Date;
            nextHearingDate: Date | null;
            trialDate: Date | null;
            statisticsDate: Date | null;
            closedDate: Date | null;
            disposition: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createFilingAuditLogModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            filingId: number;
            caseNumber: string;
            action: string;
            actionDescription: string;
            performedBy: string;
            performedAt: Date;
            ipAddress: string | null;
            userAgent: string | null;
            previousState: Record<string, any> | null;
            newState: Record<string, any>;
            metadata: Record<string, any>;
            readonly createdAt: Date;
        };
    };
    validateCourtFiling: (filing: ECFFilingRequest, courtConfig: CourtSystemConfig) => Promise<FilingValidationResult>;
    validateDocumentFormat: (document: FilingDocument, requirements: DocumentRequirement) => Promise<{
        isValid: boolean;
        errors: string[];
    }>;
    validateServiceList: (serviceList: ServiceContact[], serviceRules: ServiceRule) => Promise<{
        isValid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    submitToECF: (filing: ECFFilingRequest, courtConfig: CourtSystemConfig, retryConfig: RetryConfig) => Promise<ECFFilingResponse>;
    checkECFStatus: (transactionId: string, courtConfig: CourtSystemConfig) => Promise<{
        status: string;
        details: any;
    }>;
    downloadStamppedDocument: (documentId: string, courtConfig: CourtSystemConfig) => Promise<Buffer>;
    getServiceConfirmation: (filingId: string, courtConfig: CourtSystemConfig) => Promise<Array<{
        contactId: string;
        status: string;
        timestamp: Date;
    }>>;
    cancelECFFiling: (transactionId: string, reason: string, courtConfig: CourtSystemConfig) => Promise<{
        success: boolean;
        message: string;
    }>;
    getDocketEntries: (caseNumber: string, sequelize: Sequelize, options?: {
        startDate?: Date;
        endDate?: Date;
        documentType?: string;
    }) => Promise<any[]>;
    monitorDocketUpdates: (config: DocketTrackingConfig, sequelize: Sequelize, callback: (entries: any[]) => void) => Promise<void>;
    searchDocketEntries: (searchCriteria: {
        caseNumber?: string;
        documentType?: string;
        filingParty?: string;
        entryText?: string;
        dateRange?: {
            start: Date;
            end: Date;
        };
    }, sequelize: Sequelize) => Promise<any[]>;
    exportDocketSheet: (caseNumber: string, format: "pdf" | "csv" | "json", sequelize: Sequelize) => Promise<Buffer | string>;
    compareDocketSources: (caseNumber: string, externalEntries: any[], sequelize: Sequelize) => Promise<{
        matches: number;
        discrepancies: any[];
    }>;
    calculateFilingDeadline: (triggeringDate: Date, rule: DeadlineRule, businessHours: BusinessHoursConfig) => Promise<Date>;
    isCourtBusinessDay: (date: Date, businessHours: BusinessHoursConfig) => Promise<boolean>;
    getNextCourtBusinessDay: (date: Date, businessHours: BusinessHoursConfig) => Promise<Date>;
    calculateDeadlineExtension: (originalDeadline: Date, extensionDays: number, rule: ExtensionRule, businessHours: BusinessHoursConfig) => Promise<{
        newDeadline: Date;
        isValid: boolean;
        errors: string[];
    }>;
    getUpcomingDeadlines: (filters: {
        caseNumber?: string;
        responsibleAttorney?: string;
        daysAhead?: number;
        priority?: string;
    }, sequelize: Sequelize) => Promise<any[]>;
    scheduleCourtEvent: (event: Partial<CourtCalendarEvent>, sequelize: Sequelize, transaction?: Transaction) => Promise<any>;
    getCourtCalendar: (startDate: Date, endDate: Date, filters: {
        judge?: string;
        courtroom?: string;
        caseNumber?: string;
    } | undefined, sequelize: Sequelize) => Promise<any[]>;
    continueCourtEvent: (eventId: number, newDate: Date, newTime: string, reason: string, sequelize: Sequelize) => Promise<any>;
    cancelCourtEvent: (eventId: number, reason: string, sequelize: Sequelize) => Promise<any>;
    checkCalendarConflicts: (eventDate: Date, eventTime: string, duration: number, context: {
        courtroom?: string;
        judge?: string;
        attorneyId?: string;
    }, sequelize: Sequelize) => Promise<{
        hasConflict: boolean;
        conflicts: any[];
    }>;
    updateCaseStatus: (caseNumber: string, newStatus: string, newPhase: string, sequelize: Sequelize) => Promise<any>;
    getCaseStatus: (caseNumber: string, sequelize: Sequelize) => Promise<any>;
    getCaseTimeline: (caseNumber: string, sequelize: Sequelize) => Promise<any[]>;
    searchCases: (searchCriteria: {
        courtId?: string;
        status?: string;
        phase?: string;
        judge?: string;
        caseType?: string;
        filingDateRange?: {
            start: Date;
            end: Date;
        };
    }, sequelize: Sequelize) => Promise<any[]>;
    CourtFilingService: typeof CourtFilingService;
    SwaggerFilingSubmit: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
    SwaggerGetDocket: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
    SwaggerCalculateDeadline: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
    executeWithRetry: <T>(fn: () => Promise<T>, config: RetryConfig) => Promise<T>;
};
export default _default;
//# sourceMappingURL=court-filing-docket-kit.d.ts.map