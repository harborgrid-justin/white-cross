/**
 * LOC: CTR-CUR-TXN-001
 * File: /reuse/financial/ctr-currency-transaction-reporting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *
 * DOWNSTREAM (imported by):
 *   - backend/compliance/ctr-submission.service.ts
 *   - backend/fincen/form-112-generator.service.ts
 *   - backend/controllers/ctr-management.controller.ts
 */
/**
 * File: /reuse/financial/ctr-currency-transaction-reporting-kit.ts
 * Locator: WC-CTR-CURR-001
 * Purpose: Enterprise-grade Currency Transaction Reporting (CTR) - FinCEN Form 112 compliance, threshold detection, XML filing
 *
 * Upstream: Sequelize 6.x, NestJS 10.x
 * Downstream: CTR services, compliance controllers, FinCEN submission handlers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, xml2js
 * Exports: 40 production-ready functions for CTR management competing with industry-leading solutions
 *
 * LLM Context: Enterprise-grade CTR utilities for FinCEN Form 112 compliance.
 * Provides CTR threshold detection, transaction aggregation, Form 112 generation, XML filing,
 * validation, exemption management, exempt customer tracking, submission workflows, amendments,
 * deadline tracking, batch processing, analytics, compliance verification, and historical retrieval.
 */
import { Sequelize } from 'sequelize';
interface CurrencyTransaction {
    transactionId: string;
    customerId: string;
    accountId: string;
    amount: number;
    currency: string;
    transactionDate: Date;
    transactionType: 'deposit' | 'withdrawal' | 'exchange' | 'wire' | 'check' | 'atm' | 'cashier_check';
    origin: 'domestic' | 'international';
    counterpartyInfo?: any;
    metadata?: Record<string, any>;
}
interface CTRThresholdData {
    customerId: string;
    accountId: string;
    aggregateAmount: number;
    transactionCount: number;
    timeWindow: 'daily' | 'calendar_day' | 'reporting_period';
    exceedsThreshold: boolean;
    thresholdAmount: number;
    exceedanceAmount: number;
    currencyCode: string;
}
interface FinCENForm112 {
    formId: string;
    filingPartyId: string;
    filerName: string;
    filerEIN: string;
    submissionType: 'initial' | 'amendment' | 'cancellation';
    reportingPeriodStartDate: Date;
    reportingPeriodEndDate: Date;
    formData: any;
    status: 'draft' | 'validated' | 'filed' | 'rejected' | 'accepted';
    submissionTimestamp?: Date;
    receiptNumber?: string;
}
interface ExemptionRecord {
    exemptionId: string;
    customerId: string;
    exemptionType: 'domestic_financial_institution' | 'customer_exemption' | 'cbp_exemption' | 'commodity_exempt';
    exemptionReason: string;
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'inactive' | 'pending' | 'revoked';
    approvedBy: string;
    approvalDate: Date;
    renewalDueDate?: Date;
}
interface ExemptCustomerRecord {
    recordId: string;
    customerId: string;
    customerName: string;
    exemptionId: string;
    ctlDate: Date;
    status: 'active' | 'inactive' | 'suspended' | 'terminated';
    ctlNumber?: string;
}
interface CTRSubmissionWorkflow {
    submissionId: string;
    formIds: string[];
    initiatedBy: string;
    initiatedAt: Date;
    currentStage: 'draft' | 'validation' | 'ready_for_submission' | 'submitted' | 'acknowledged' | 'rejected';
    dueDate: Date;
    submittedAt?: Date;
    acknowledgedAt?: Date;
    completionPercentage: number;
    validationErrors?: string[];
}
interface CTRAmendment {
    amendmentId: string;
    originalFormId: string;
    amendmentReason: string;
    changedFields: string[];
    createdBy: string;
    createdAt: Date;
    submittedAt?: Date;
    status: 'draft' | 'submitted' | 'accepted' | 'rejected';
    receiptNumber?: string;
}
interface DeadlineTracker {
    deadline_id: string;
    submission_type: 'annual' | 'quarterly' | 'special_report';
    due_date: Date;
    filing_requirement: string;
    lead_days: number;
    alert_threshold_days: number;
    status: 'pending' | 'approaching' | 'due_soon' | 'overdue' | 'completed';
    last_alert_sent?: Date;
}
interface BatchProcessingConfig {
    batchId: string;
    batchSize: number;
    processingStartTime: Date;
    processingEndTime?: Date;
    totalRecordsProcessed: number;
    successCount: number;
    failureCount: number;
    skippedCount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    errorLog?: any[];
}
interface ComplianceAnalytics {
    reportId: string;
    generatedAt: Date;
    reportingPeriod: string;
    totalTransactions: number;
    totalCTRs: number;
    exemptTransactions: number;
    complianceScore: number;
    filingTimeliness: number;
    dataQualityScore: number;
    anomalies: string[];
}
interface ComplianceVerificationResult {
    verificationId: string;
    status: 'compliant' | 'non_compliant' | 'needs_review';
    checkItems: Record<string, boolean>;
    issues: string[];
    recommendations: string[];
    verifiedAt: Date;
}
interface HistoricalFilingRecord {
    recordId: string;
    customerId: string;
    formId: string;
    filingDate: Date;
    reportingPeriod: string;
    receiptNumber: string;
    amount: number;
    currencyCode: string;
    status: 'accepted' | 'rejected' | 'amended' | 'cancelled';
    amendment_count: number;
}
/**
 * Currency Transaction Report (CTR) Model
 * Represents individual CTR filings and their lifecycle management
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CTRReport model
 */
export declare const createCTRReportModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        accountId: string;
        aggregateAmount: number;
        transactionCount: number;
        reportingPeriod: string;
        currencyCode: string;
        formId: string;
        status: string;
        submissionDate?: Date;
        receiptNumber?: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Exemption Management Model
 * Tracks exemptions from CTR filing requirements
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CTRExemption model
 */
export declare const createCTRExemptionModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        customerId: string;
        exemptionType: string;
        status: string;
        startDate: Date;
        endDate?: Date;
        approvedBy: string;
        approvalDate: Date;
        renewalDueDate?: Date;
        documentPath?: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * FinCEN Form 112 Filing Model
 * Tracks FinCEN Form 112 submissions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FinCENForm112 model
 */
export declare const createFinCENForm112Model: (sequelize: Sequelize) => {
    new (): {
        id: string;
        filingPartyId: string;
        filerName: string;
        filerEIN: string;
        submissionType: string;
        reportingPeriodStartDate: Date;
        reportingPeriodEndDate: Date;
        status: string;
        submissionTimestamp?: Date;
        receiptNumber?: string;
        rejectionReason?: string;
        formData: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Detects if currency transactions exceed CTR reporting threshold
 *
 * @param transactions - Array of currency transactions
 * @param thresholdAmount - CTR reporting threshold (typically $10,000)
 * @param timeWindow - Aggregation time window
 * @returns CTRThresholdData for each customer/account combination
 *
 * @example
 * ```typescript
 * const results = detectCTRThreshold(transactions, 10000, 'calendar_day');
 * const thresholdExceeded = results.filter(r => r.exceedsThreshold);
 * ```
 */
export declare function detectCTRThreshold(transactions: CurrencyTransaction[], thresholdAmount?: number, timeWindow?: 'daily' | 'calendar_day' | 'reporting_period'): CTRThresholdData[];
/**
 * Aggregates transactions by customer for reporting period
 *
 * @param transactions - Transactions to aggregate
 * @param reportingPeriodStart - Start of reporting period
 * @param reportingPeriodEnd - End of reporting period
 * @returns Aggregated transaction data by customer
 *
 * @example
 * ```typescript
 * const aggregated = aggregateTransactionsByCustomer(txns, startDate, endDate);
 * ```
 */
export declare function aggregateTransactionsByCustomer(transactions: CurrencyTransaction[], reportingPeriodStart: Date, reportingPeriodEnd: Date): Map<string, {
    totalAmount: number;
    count: number;
    transactions: CurrencyTransaction[];
}>;
/**
 * Aggregates transactions by time period for analysis
 *
 * @param transactions - Transactions to aggregate
 * @param periodType - Type of period (daily, weekly, monthly)
 * @returns Map of periods to aggregated transaction data
 *
 * @example
 * ```typescript
 * const byPeriod = aggregateByTimePeriod(transactions, 'daily');
 * ```
 */
export declare function aggregateByTimePeriod(transactions: CurrencyTransaction[], periodType?: 'daily' | 'weekly' | 'monthly'): Map<string, {
    totalAmount: number;
    count: number;
    period: string;
}>;
/**
 * Generates FinCEN Form 112 from aggregated CTR data
 *
 * @param ctrData - CTR threshold data to report
 * @param filingParty - Filing party information
 * @param submissionType - Type of submission (initial, amendment, cancellation)
 * @returns Generated FinCEN Form 112
 *
 * @example
 * ```typescript
 * const form = generateFinCENForm112(ctrData, filingParty, 'initial');
 * ```
 */
export declare function generateFinCENForm112(ctrData: CTRThresholdData[], filingParty: {
    id: string;
    name: string;
    ein: string;
}, submissionType?: 'initial' | 'amendment' | 'cancellation'): FinCENForm112;
/**
 * Populates FinCEN Form 112 with filer information
 *
 * @param form - Form to populate
 * @param filingParty - Filing party details
 * @param contactInfo - Contact information
 * @returns Updated form
 *
 * @example
 * ```typescript
 * const populated = populateFilingPartyInfo(form, party, contact);
 * ```
 */
export declare function populateFilingPartyInfo(form: FinCENForm112, filingParty: any, contactInfo: any): FinCENForm112;
/**
 * Populates transaction details in Form 112
 *
 * @param form - Form to populate
 * @param transactions - Transactions to include
 * @returns Updated form
 *
 * @example
 * ```typescript
 * const populated = populateTransactionInfo(form, transactions);
 * ```
 */
export declare function populateTransactionInfo(form: FinCENForm112, transactions: CurrencyTransaction[]): FinCENForm112;
/**
 * Validates FinCEN Form 112 completeness and correctness
 *
 * @param form - Form to validate
 * @returns Validation result with errors and warnings
 *
 * @example
 * ```typescript
 * const validation = validateFormCompleteness(form);
 * if (!validation.isValid) console.log(validation.errors);
 * ```
 */
export declare function validateFormCompleteness(form: FinCENForm112): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * Generates XML representation of FinCEN Form 112
 *
 * @param form - Form to convert to XML
 * @returns XML string representation
 *
 * @example
 * ```typescript
 * const xml = convertToXMLSchema(form);
 * await fs.writeFile('form112.xml', xml);
 * ```
 */
export declare function convertToXMLSchema(form: FinCENForm112): string;
/**
 * Generates XML file for FinCEN submission
 *
 * @param forms - Forms to include in XML
 * @param filePath - Path to write XML file
 * @returns Success status and file location
 *
 * @example
 * ```typescript
 * const result = await generateXMLFile(forms, '/data/fincen/submission.xml');
 * ```
 */
export declare function generateXMLFile(forms: FinCENForm112[], filePath: string): Promise<{
    success: boolean;
    filePath: string;
    formCount: number;
}>;
/**
 * Validates XML structure for FinCEN compliance
 *
 * @param xmlContent - XML content to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateXMLStructure(xmlContent);
 * ```
 */
export declare function validateXMLStructure(xmlContent: string): {
    isValid: boolean;
    errors: string[];
};
/**
 * Validates customer information for CTR reporting
 *
 * @param customer - Customer data to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateCustomerInfo(customer);
 * ```
 */
export declare function validateCustomerInfo(customer: any): {
    isValid: boolean;
    errors: string[];
};
/**
 * Validates transaction data for CTR reporting
 *
 * @param transactions - Transactions to validate
 * @returns Validation result with item-level errors
 *
 * @example
 * ```typescript
 * const result = validateTransactionData(transactions);
 * ```
 */
export declare function validateTransactionData(transactions: CurrencyTransaction[]): {
    isValid: boolean;
    errors: Map<string, string[]>;
};
/**
 * Validates amount thresholds for CTR applicability
 *
 * @param amount - Amount to validate
 * @param thresholdAmount - Threshold to validate against
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateAmountThreshold(5000, 10000);
 * ```
 */
export declare function validateAmountThreshold(amount: number, thresholdAmount?: number): {
    isValid: boolean;
    meetsThreshold: boolean;
    message: string;
};
/**
 * Creates new exemption record
 *
 * @param customerId - Customer to exempt
 * @param exemptionType - Type of exemption
 * @param approverInfo - Approver details
 * @param exemptionReason - Reason for exemption
 * @returns Created exemption record
 *
 * @example
 * ```typescript
 * const exemption = createExemption('CUST123', 'domestic_financial_institution', approver, 'Bank entity');
 * ```
 */
export declare function createExemption(customerId: string, exemptionType: string, approverInfo: {
    name: string;
    id: string;
}, exemptionReason: string): ExemptionRecord;
/**
 * Updates existing exemption status
 *
 * @param exemptionId - Exemption to update
 * @param newStatus - New exemption status
 * @param notes - Update notes
 * @returns Updated exemption record
 *
 * @example
 * ```typescript
 * const updated = updateExemption('EXE-123', 'active', 'Approved by CFO');
 * ```
 */
export declare function updateExemption(exemptionId: string, newStatus: 'active' | 'inactive' | 'pending' | 'revoked', notes?: string): ExemptionRecord;
/**
 * Revokes exemption for customer
 *
 * @param exemptionId - Exemption to revoke
 * @param revocationReason - Reason for revocation
 * @returns Updated exemption record
 *
 * @example
 * ```typescript
 * const revoked = revokeExemption('EXE-123', 'Exemption criteria no longer met');
 * ```
 */
export declare function revokeExemption(exemptionId: string, revocationReason: string): ExemptionRecord;
/**
 * Adds customer to exempt customer list
 *
 * @param customerId - Customer to add
 * @param customerName - Customer name
 * @param exemptionId - Related exemption ID
 * @returns Exempt customer record
 *
 * @example
 * ```typescript
 * const exempt = addExemptCustomer('CUST123', 'John Doe', 'EXE-123');
 * ```
 */
export declare function addExemptCustomer(customerId: string, customerName: string, exemptionId: string): ExemptCustomerRecord;
/**
 * Removes customer from exempt customer list
 *
 * @param recordId - Exempt record to remove
 * @returns Updated record with inactive status
 *
 * @example
 * ```typescript
 * const removed = removeExemptCustomer('EC-123');
 * ```
 */
export declare function removeExemptCustomer(recordId: string): ExemptCustomerRecord;
/**
 * Checks exemption status for customer
 *
 * @param customerId - Customer to check
 * @param exemptionRecords - Available exemption records
 * @returns Exemption status details
 *
 * @example
 * ```typescript
 * const status = checkExemptionStatus('CUST123', exemptions);
 * ```
 */
export declare function checkExemptionStatus(customerId: string, exemptionRecords: ExemptionRecord[]): {
    isExempt: boolean;
    activeExemption?: ExemptionRecord;
    reason?: string;
};
/**
 * Initiates CTR submission workflow
 *
 * @param formIds - Form IDs to submit
 * @param initiatedBy - User initiating submission
 * @param dueDate - Submission due date
 * @returns Workflow record
 *
 * @example
 * ```typescript
 * const workflow = initiateSubmission(['FORM112-1', 'FORM112-2'], 'admin', dueDate);
 * ```
 */
export declare function initiateSubmission(formIds: string[], initiatedBy: string, dueDate: Date): CTRSubmissionWorkflow;
/**
 * Tracks CTR submission workflow progress
 *
 * @param workflowId - Workflow to track
 * @param newStage - New workflow stage
 * @param validationErrors - Any validation errors
 * @returns Updated workflow record
 *
 * @example
 * ```typescript
 * const updated = trackSubmissionStatus('SUB-123', 'validation', []);
 * ```
 */
export declare function trackSubmissionStatus(workflowId: string, newStage: 'draft' | 'validation' | 'ready_for_submission' | 'submitted' | 'acknowledged' | 'rejected', validationErrors?: string[]): CTRSubmissionWorkflow;
/**
 * Confirms receipt of submitted forms
 *
 * @param submissionId - Submission to confirm
 * @param receiptNumber - FinCEN receipt number
 * @returns Updated workflow with receipt confirmation
 *
 * @example
 * ```typescript
 * const confirmed = confirmSubmissionReceipt('SUB-123', 'FINCEN-2024-001');
 * ```
 */
export declare function confirmSubmissionReceipt(submissionId: string, receiptNumber: string): CTRSubmissionWorkflow;
/**
 * Creates amendment for previously filed form
 *
 * @param originalFormId - Original form ID
 * @param changedFields - Fields that changed
 * @param reason - Reason for amendment
 * @param createdBy - User creating amendment
 * @returns Amendment record
 *
 * @example
 * ```typescript
 * const amendment = createAmendment('FORM112-1', ['amount', 'date'], 'Correction', 'user123');
 * ```
 */
export declare function createAmendment(originalFormId: string, changedFields: string[], reason: string, createdBy: string): CTRAmendment;
/**
 * Tracks amendment history for form
 *
 * @param formId - Form to track amendments for
 * @param amendments - Amendment records
 * @returns Amendment history with counts and timeline
 *
 * @example
 * ```typescript
 * const history = trackAmendmentHistory('FORM112-1', amendments);
 * ```
 */
export declare function trackAmendmentHistory(formId: string, amendments: CTRAmendment[]): {
    formId: string;
    totalAmendments: number;
    submittedAmendments: number;
    timeline: Date[];
};
/**
 * Calculates CTR filing deadline based on reporting period
 *
 * @param reportingPeriodEnd - End date of reporting period
 * @param businessDaysToDeadline - Number of business days for deadline
 * @returns Deadline tracker record
 *
 * @example
 * ```typescript
 * const deadline = calculateFilingDeadline(periodEnd, 15);
 * ```
 */
export declare function calculateFilingDeadline(reportingPeriodEnd: Date, businessDaysToDeadline?: number): DeadlineTracker;
/**
 * Tracks deadline status and alerts
 *
 * @param deadlines - Deadlines to track
 * @returns Status summary with alerts
 *
 * @example
 * ```typescript
 * const status = trackDeadlineStatus(deadlines);
 * ```
 */
export declare function trackDeadlineStatus(deadlines: DeadlineTracker[]): {
    pending: number;
    approaching: number;
    overdue: number;
    alerts: DeadlineTracker[];
};
/**
 * Processes batch of transactions for CTR reporting
 *
 * @param transactions - Transactions to process
 * @param batchSize - Size of batches to process
 * @returns Batch processing results
 *
 * @example
 * ```typescript
 * const result = processBatch(transactions, 100);
 * ```
 */
export declare function processBatch(transactions: CurrencyTransaction[], batchSize?: number): Promise<BatchProcessingConfig>;
/**
 * Validates batch file integrity
 *
 * @param batchData - Batch data to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateBatchFile(batch);
 * ```
 */
export declare function validateBatchFile(batchData: any): {
    isValid: boolean;
    errors: string[];
    checksumValid: boolean;
};
/**
 * Generates analytics report for CTR compliance
 *
 * @param reportingPeriod - Period to analyze
 * @param forms - Forms filed during period
 * @param transactions - Transactions processed
 * @returns Compliance analytics
 *
 * @example
 * ```typescript
 * const analytics = generateComplianceReport('2024-Q1', forms, transactions);
 * ```
 */
export declare function generateComplianceReport(reportingPeriod: string, forms: FinCENForm112[], transactions: CurrencyTransaction[]): ComplianceAnalytics;
/**
 * Verifies compliance with CTR regulations
 *
 * @param customerId - Customer to verify
 * @param filingHistory - Customer filing history
 * @returns Compliance verification result
 *
 * @example
 * ```typescript
 * const result = verifyCompliance('CUST123', history);
 * ```
 */
export declare function verifyCompliance(customerId: string, filingHistory: HistoricalFilingRecord[]): ComplianceVerificationResult;
/**
 * Retrieves historical CTR filings for customer
 *
 * @param customerId - Customer to retrieve history for
 * @param startDate - Start of retrieval period
 * @param endDate - End of retrieval period
 * @returns Historical filing records
 *
 * @example
 * ```typescript
 * const history = retrieveHistoricalFilings('CUST123', startDate, endDate);
 * ```
 */
export declare function retrieveHistoricalFilings(customerId: string, startDate: Date, endDate: Date): HistoricalFilingRecord[];
/**
 * Searches filing history by criteria
 *
 * @param criteria - Search criteria
 * @param history - Historical records to search
 * @returns Matching filing records
 *
 * @example
 * ```typescript
 * const results = searchFilingHistory({ customerId: 'CUST123', status: 'accepted' }, history);
 * ```
 */
export declare function searchFilingHistory(criteria: Partial<HistoricalFilingRecord>, history: HistoricalFilingRecord[]): HistoricalFilingRecord[];
/**
 * NestJS-compatible service provider for CTR management
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class CTRManagementService extends CTRServiceProvider {}
 *
 * @Module({
 *   providers: [CTRManagementService]
 * })
 * export class CTRModule {}
 * ```
 */
export declare class CTRServiceProvider {
    private readonly sequelize;
    /**
     * Creates service instance with initialized models
     *
     * @param sequelize - Sequelize instance
     */
    constructor(sequelize: Sequelize);
    private initializeModels;
    /**
     * Detects CTR thresholds across transactions
     *
     * @param transactions - Transactions to analyze
     * @returns Threshold detection results
     */
    detectThresholds(transactions: CurrencyTransaction[]): CTRThresholdData[];
    /**
     * Generates Form 112 for filing
     *
     * @param ctrData - CTR data
     * @param filingParty - Filing party information
     * @returns Generated form
     */
    generateForm112(ctrData: CTRThresholdData[], filingParty: any): FinCENForm112;
    /**
     * Validates form completeness
     *
     * @param form - Form to validate
     * @returns Validation result
     */
    validateForm(form: FinCENForm112): ReturnType<typeof validateFormCompleteness>;
    /**
     * Converts form to XML
     *
     * @param form - Form to convert
     * @returns XML string
     */
    toXML(form: FinCENForm112): string;
}
export {};
//# sourceMappingURL=ctr-currency-transaction-reporting-kit.d.ts.map