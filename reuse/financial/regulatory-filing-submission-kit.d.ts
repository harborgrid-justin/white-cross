/**
 * LOC: FINRF7654321
 * File: /reuse/financial/regulatory-filing-submission-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable financial utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Compliance management services
 *   - Regulatory reporting modules
 *   - Filing administration systems
 *   - Multi-jurisdiction submission handlers
 *   - Audit and compliance dashboards
 */
/**
 * Core filing information structure
 */
interface FilingData {
    filingId: string;
    jurisdiction: string;
    filingType: 'SEC_10K' | 'SEC_10Q' | 'IRS_990' | 'FINRA_4530' | 'FCA_MIFIR' | 'OTHER';
    submissionDate: Date;
    dueDate: Date;
    data: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Filing status and tracking information
 */
interface FilingStatus {
    filingId: string;
    status: 'draft' | 'submitted' | 'acknowledged' | 'accepted' | 'rejected' | 'amended' | 'archived';
    submissionTime?: Date;
    acknowledgedTime?: Date;
    rejectionReason?: string;
    rejectionDetails?: Record<string, string[]>;
    amendments: AmendmentRecord[];
    lastUpdated: Date;
}
/**
 * Amendment and correction tracking
 */
interface AmendmentRecord {
    amendmentId: string;
    originalFilingId: string;
    amendmentDate: Date;
    submissionDate?: Date;
    status: 'draft' | 'submitted' | 'accepted' | 'rejected';
    changes: Record<string, any>;
    reason: string;
    acknowledgedTime?: Date;
}
/**
 * Filing validation result
 */
interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: string[];
    completionPercentage: number;
    validatedAt: Date;
}
/**
 * Individual validation error
 */
interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'warning';
    code: string;
}
/**
 * Filing template structure
 */
interface FilingTemplate {
    templateId: string;
    jurisdiction: string;
    filingType: string;
    version: string;
    requiredFields: string[];
    optionalFields: string[];
    validationRules: Record<string, ValidationRule>;
    deadlineRules: DeadlineRule[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Validation rule for template field
 */
interface ValidationRule {
    type: 'string' | 'number' | 'date' | 'enum' | 'regex' | 'custom';
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: any[];
    customValidator?: (value: any) => boolean;
}
/**
 * Deadline rule for filing
 */
interface DeadlineRule {
    ruleId: string;
    description: string;
    daysFromEvent: number;
    eventType: 'fiscal_year_end' | 'quarter_end' | 'regulatory_change' | 'custom_event';
    priority: 'critical' | 'high' | 'normal';
}
/**
 * Filing acknowledgment from regulatory system
 */
interface FilingAcknowledgment {
    acknowledgmentId: string;
    filingId: string;
    receivedTime: Date;
    accessionNumber?: string;
    status: 'received' | 'processing' | 'accepted' | 'conditional' | 'rejected';
    message: string;
    details?: Record<string, any>;
}
/**
 * Rejection information
 */
interface RejectionInfo {
    rejectionId: string;
    filingId: string;
    rejectionTime: Date;
    reasons: RejectionReason[];
    allowedResubmissionDate?: Date;
    requiredCorrections: Record<string, string>;
}
/**
 * Individual rejection reason
 */
interface RejectionReason {
    code: string;
    category: 'format' | 'data_validation' | 'signature' | 'deadline' | 'compliance' | 'jurisdiction';
    message: string;
    affectedFields?: string[];
}
/**
 * Batch filing operation
 */
interface FilingBatch {
    batchId: string;
    jurisdiction: string;
    filingType: string;
    filings: FilingData[];
    status: 'pending' | 'processing' | 'submitted' | 'partially_successful' | 'failed' | 'completed';
    createdAt: Date;
    submittedAt?: Date;
    completedAt?: Date;
    successCount: number;
    failureCount: number;
    results: BatchFilingResult[];
}
/**
 * Result of single filing in batch
 */
interface BatchFilingResult {
    filingId: string;
    status: 'success' | 'failed' | 'pending';
    submissionId?: string;
    error?: string;
    timestamp: Date;
}
/**
 * Filing analytics
 */
interface FilingAnalytics {
    period: string;
    totalFilings: number;
    successfulFilings: number;
    rejectedFilings: number;
    amendedFilings: number;
    averageSubmissionTime: number;
    averageAcknowledgmentTime: number;
    commonRejectionReasons: {
        reason: string;
        count: number;
    }[];
    complianceRate: number;
}
/**
 * Regulatory calendar event
 */
interface RegulatoryEvent {
    eventId: string;
    jurisdiction: string;
    eventType: string;
    eventName: string;
    eventDate: Date;
    dueDate?: Date;
    relatedFilingTypes: string[];
    details?: Record<string, any>;
}
/**
 * Jurisdiction requirements
 */
interface JurisdictionRequirements {
    jurisdiction: string;
    supportedFilingTypes: string[];
    requiredFields: Record<string, string[]>;
    submissionMethods: SubmissionMethod[];
    fileFormats: string[];
    signatureRequired: boolean;
    encryptionRequired: boolean;
    deadline: string;
}
/**
 * Submission method
 */
interface SubmissionMethod {
    method: 'api' | 'sftp' | 'web_portal' | 'email';
    endpoint?: string;
    authentication: 'basic' | 'oauth2' | 'certificate' | 'token';
    isActive: boolean;
}
/**
 * Resubmission workflow
 */
interface ResubmissionWorkflow {
    workflowId: string;
    originalFilingId: string;
    rejectionId: string;
    corrections: Record<string, any>;
    validationStatus: ValidationResult;
    resubmissionAttempts: number;
    maxRetries: number;
    status: 'pending' | 'validated' | 'submitted' | 'completed' | 'failed';
    createdAt: Date;
    lastAttemptAt?: Date;
}
/**
 * Submission history entry
 */
interface SubmissionHistoryEntry {
    entryId: string;
    filingId: string;
    submissionTime: Date;
    method: 'api' | 'sftp' | 'web_portal' | 'email';
    status: 'submitted' | 'acknowledged' | 'failed';
    duration: number;
    responseCode?: string;
    metadata?: Record<string, any>;
}
/**
 * Filing signature
 */
interface FilingSignature {
    signatureId: string;
    filingId: string;
    signedBy: string;
    signedAt: Date;
    algorithm: string;
    signatureValue: string;
    certificateId?: string;
    isValid: boolean;
}
/**
 * Generates a new filing form structure based on template and jurisdiction
 * @param jurisdiction - Target regulatory jurisdiction
 * @param filingType - Type of filing (e.g., SEC_10K, IRS_990)
 * @param templateVersion - Version of template to use
 * @returns Structured filing form with validation rules
 * @throws Error if template not found or jurisdiction unsupported
 */
export declare function generateFilingForm(jurisdiction: string, filingType: string, templateVersion?: string): FilingTemplate;
/**
 * Creates a filing from an existing template with pre-populated structure
 * @param template - Filing template to use
 * @param initialData - Initial data values
 * @returns Complete filing data structure
 */
export declare function createFilingFromTemplate(template: FilingTemplate, initialData?: Record<string, any>): FilingData;
/**
 * Generates a preview of the filing in human-readable format
 * @param filing - Filing data to preview
 * @param format - Output format (text, html, json)
 * @returns Formatted preview string
 */
export declare function generateFilingPreview(filing: FilingData, format?: 'text' | 'html' | 'json'): string;
/**
 * Extracts structured data from a filing form
 * @param filing - Filing to extract data from
 * @param fieldsToExtract - Specific fields to extract (undefined = all)
 * @returns Extracted data object
 */
export declare function extractFilingData(filing: FilingData, fieldsToExtract?: string[]): Record<string, any>;
/**
 * Validates complete filing data against template rules
 * @param filing - Filing to validate
 * @param template - Template to validate against
 * @returns Validation result with errors and warnings
 */
export declare function validateFilingData(filing: FilingData, template: FilingTemplate): ValidationResult;
/**
 * Validates specific field value against rule
 * @param field - Field name
 * @param value - Value to validate
 * @param rule - Validation rule
 * @returns Array of validation errors (empty if valid)
 */
export declare function validateFieldValue(field: string, value: any, rule: ValidationRule): ValidationError[];
/**
 * Validates filing completeness against template
 * @param filing - Filing to check
 * @param template - Template requirements
 * @returns Completion status with percentage
 */
export declare function validateFilingCompleteness(filing: FilingData, template: FilingTemplate): {
    isComplete: boolean;
    percentage: number;
    missingFields: string[];
};
/**
 * Submits filing electronically to regulatory system
 * @param filing - Filing to submit
 * @param endpoint - Regulatory system endpoint
 * @param credentials - Submission credentials
 * @returns Submission ID and acknowledgment
 * @throws Error if submission fails
 */
export declare function submitFilingElectronically(filing: FilingData, endpoint: string, credentials: {
    username: string;
    password: string;
    clientId: string;
}): Promise<{
    submissionId: string;
    acknowledgmentId: string;
    timestamp: Date;
}>;
/**
 * Retries a failed filing submission with exponential backoff
 * @param filing - Filing to resubmit
 * @param endpoint - Regulatory system endpoint
 * @param credentials - Submission credentials
 * @param maxRetries - Maximum number of retries
 * @returns Final submission result or failure
 */
export declare function retryFailedSubmission(filing: FilingData, endpoint: string, credentials: {
    username: string;
    password: string;
    clientId: string;
}, maxRetries?: number): Promise<{
    success: boolean;
    submissionId?: string;
    error?: string;
    attempts: number;
}>;
/**
 * Tracks the progress of a submitted filing
 * @param submissionId - Submission identifier
 * @param endpoint - Status tracking endpoint
 * @returns Current submission status and progress
 */
export declare function trackSubmissionProgress(submissionId: string, endpoint: string): Promise<{
    status: string;
    progress: number;
    message: string;
    updatedAt: Date;
}>;
/**
 * Cancels a submitted filing that hasn't been accepted
 * @param submissionId - Submission to cancel
 * @param endpoint - Cancellation endpoint
 * @param reason - Cancellation reason
 * @returns Cancellation confirmation
 */
export declare function cancelSubmission(submissionId: string, endpoint: string, reason: string): Promise<{
    cancelled: boolean;
    cancellationId: string;
    timestamp: Date;
}>;
/**
 * Retrieves current status of a filing
 * @param filingId - Filing identifier
 * @param statusRepository - Data repository for status
 * @returns Current filing status
 */
export declare function getFilingStatus(filingId: string, statusRepository: Map<string, FilingStatus>): FilingStatus;
/**
 * Updates filing status with new state
 * @param filingId - Filing identifier
 * @param newStatus - New status value
 * @param statusRepository - Data repository
 * @param details - Additional status details
 * @returns Updated status record
 */
export declare function updateFilingStatus(filingId: string, newStatus: FilingStatus['status'], statusRepository: Map<string, FilingStatus>, details?: Record<string, any>): FilingStatus;
/**
 * Tracks multiple filings and returns batch status summary
 * @param filingIds - List of filing IDs to track
 * @param statusRepository - Data repository
 * @returns Summary of all filing statuses
 */
export declare function trackMultipleFilings(filingIds: string[], statusRepository: Map<string, FilingStatus>): {
    total: number;
    byStatus: Record<string, number>;
    filings: FilingStatus[];
};
/**
 * Retrieves historical status changes for a filing
 * @param filingId - Filing identifier
 * @param historyRepository - Historical data repository
 * @returns Array of status changes chronologically
 */
export declare function getStatusHistory(filingId: string, historyRepository: Map<string, FilingStatus[]>): FilingStatus[];
/**
 * Processes incoming filing acknowledgment from regulatory system
 * @param acknowledgmentData - Acknowledgment data received
 * @param filingId - Associated filing ID
 * @returns Processed acknowledgment record
 */
export declare function processAcknowledgment(acknowledgmentData: Record<string, any>, filingId: string): FilingAcknowledgment;
/**
 * Extracts key data from acknowledgment message
 * @param acknowledgment - Acknowledgment to parse
 * @returns Extracted key information
 */
export declare function extractAcknowledgmentData(acknowledgment: FilingAcknowledgment): {
    accessionNumber?: string;
    receivedTime: Date;
    status: string;
    requiresAction: boolean;
    actionItems: string[];
};
/**
 * Handles filing rejection and extracts correction requirements
 * @param rejectionData - Rejection information from regulatory system
 * @param originalFilingId - Original filing ID
 * @returns Rejection information with correction requirements
 */
export declare function handleRejection(rejectionData: Record<string, any>, originalFilingId: string): RejectionInfo;
/**
 * Creates an amendment to an existing filing
 * @param originalFilingId - Original filing to amend
 * @param changes - Changes to apply
 * @param reason - Reason for amendment
 * @returns New amendment record
 */
export declare function createAmendment(originalFilingId: string, changes: Record<string, any>, reason: string): AmendmentRecord;
/**
 * Submits an amendment for processing
 * @param amendment - Amendment to submit
 * @param endpoint - Submission endpoint
 * @param credentials - Submission credentials
 * @returns Submission result
 */
export declare function submitAmendment(amendment: AmendmentRecord, endpoint: string, credentials: {
    username: string;
    password: string;
    clientId: string;
}): Promise<{
    submissionId: string;
    status: 'submitted' | 'failed';
    timestamp: Date;
}>;
/**
 * Tracks status of an amendment submission
 * @param amendmentId - Amendment identifier
 * @param amendmentRepository - Data repository
 * @returns Current amendment status
 */
export declare function trackAmendmentStatus(amendmentId: string, amendmentRepository: Map<string, AmendmentRecord>): AmendmentRecord;
/**
 * Generates a correction form based on rejection reasons
 * @param rejection - Rejection information
 * @param originalFiling - Original filing data
 * @returns Correction form with pre-populated problem areas
 */
export declare function generateCorrectionForm(rejection: RejectionInfo, originalFiling: FilingData): Record<string, any>;
/**
 * Calculates deadline for filing based on type and jurisdiction
 * @param jurisdiction - Target jurisdiction
 * @param filingType - Type of filing
 * @param referenceDate - Reference date for calculation
 * @returns Calculated due date
 */
export declare function calculateDeadlines(jurisdiction: string, filingType: string, referenceDate?: Date): {
    dueDate: Date;
    warningDate: Date;
    criticalDate: Date;
};
/**
 * Retrieves upcoming filing deadlines
 * @param jurisdiction - Jurisdiction to query
 * @param daysAhead - Look-ahead period in days
 * @param eventRepository - Event data repository
 * @returns List of upcoming regulatory deadlines
 */
export declare function getUpcomingDeadlines(jurisdiction: string, daysAhead: number | undefined, eventRepository: Map<string, RegulatoryEvent[]>): RegulatoryEvent[];
/**
 * Creates a regulatory calendar entry for tracking
 * @param event - Event details
 * @param eventRepository - Repository to store event
 * @returns Created event record
 */
export declare function createRegulatoryCalendarEntry(event: Omit<RegulatoryEvent, 'eventId'>, eventRepository: Map<string, RegulatoryEvent[]>): RegulatoryEvent;
/**
 * Submits multiple filings in a batch operation
 * @param batch - Batch containing multiple filings
 * @param endpoint - Submission endpoint
 * @param credentials - Submission credentials
 * @returns Batch submission result with per-filing status
 */
export declare function batchSubmitFilings(batch: FilingBatch, endpoint: string, credentials: {
    username: string;
    password: string;
    clientId: string;
}): Promise<FilingBatch>;
/**
 * Validates all filings in a batch before submission
 * @param batch - Batch to validate
 * @param template - Template to validate against
 * @returns Validation results for each filing
 */
export declare function batchValidateFilings(batch: FilingBatch, template: FilingTemplate): Map<string, ValidationResult>;
/**
 * Generates comprehensive report for batch filing operation
 * @param batch - Completed batch
 * @returns Detailed batch operation report
 */
export declare function generateBatchReport(batch: FilingBatch): {
    summary: string;
    statistics: Record<string, any>;
    details: BatchFilingResult[];
};
/**
 * Converts filing data to XML format
 * @param filing - Filing to convert
 * @returns XML string representation
 */
export declare function convertToXML(filing: FilingData): string;
/**
 * Converts filing data to JSON format
 * @param filing - Filing to convert
 * @returns JSON string representation
 */
export declare function convertToJSON(filing: FilingData): string;
/**
 * Converts filing data to CSV format
 * @param filings - Filings to convert (array)
 * @param fields - Specific fields to include
 * @returns CSV string representation
 */
export declare function convertToCSV(filings: FilingData[], fields?: string[]): string;
/**
 * Signs a filing with digital signature
 * @param filing - Filing to sign
 * @param signingKey - Private key for signing
 * @param signedBy - Identity of signer
 * @returns Filing signature record
 */
export declare function signFiling(filing: FilingData, signingKey: string, signedBy: string): FilingSignature;
/**
 * Verifies the validity of a filing signature
 * @param signature - Signature to verify
 * @param filing - Original filing
 * @param publicKey - Public key for verification
 * @returns Verification result
 */
export declare function verifySignature(signature: FilingSignature, filing: FilingData, publicKey: string): {
    isValid: boolean;
    verifiedAt: Date;
    error?: string;
};
/**
 * Generates authentication token for filing submission
 * @param filing - Filing to generate token for
 * @param secret - Shared secret for token generation
 * @returns Authentication token and expiration
 */
export declare function generateSignatureToken(filing: FilingData, secret: string): {
    token: string;
    expiresAt: Date;
    algorithm: string;
};
/**
 * Generates analytics for filing submission patterns
 * @param period - Analysis period (YYYY-MM)
 * @param filingRepository - Filing data repository
 * @returns Filing analytics for the period
 */
export declare function generateFilingAnalytics(period: string, filingRepository: Map<string, FilingData>): FilingAnalytics;
/**
 * Retrieves compliance metrics for audit and reporting
 * @param filingRepository - Filing data repository
 * @param statusRepository - Status data repository
 * @returns Comprehensive compliance metrics
 */
export declare function getComplianceMetrics(filingRepository: Map<string, FilingData>, statusRepository: Map<string, FilingStatus>): {
    onTimeFilingRate: number;
    acceptanceRate: number;
    amendmentRate: number;
    rejectionRate: number;
    averageCorrectionTime: number;
};
/**
 * Validates filing for multi-jurisdiction compliance
 * @param filing - Filing to validate
 * @param jurisdictions - Target jurisdictions
 * @param requirementsRepository - Jurisdiction requirements repository
 * @returns Validation result for each jurisdiction
 */
export declare function validateMultiJurisdictionFiling(filing: FilingData, jurisdictions: string[], requirementsRepository: Map<string, JurisdictionRequirements>): Map<string, {
    isValid: boolean;
    errors: string[];
}>;
/**
 * Maps filing to specific jurisdiction and applies jurisdiction-specific rules
 * @param filing - Filing to map
 * @param sourceJurisdiction - Original jurisdiction
 * @param targetJurisdiction - Target jurisdiction
 * @param requirementsRepository - Requirements repository
 * @returns Mapped filing ready for target jurisdiction
 */
export declare function mapFilingToJurisdiction(filing: FilingData, sourceJurisdiction: string, targetJurisdiction: string, requirementsRepository: Map<string, JurisdictionRequirements>): FilingData;
/**
 * Retrieves specific requirements for a jurisdiction
 * @param jurisdiction - Target jurisdiction
 * @param filingType - Filing type
 * @param requirementsRepository - Requirements repository
 * @returns Jurisdiction-specific requirements
 */
export declare function getJurisdictionRequirements(jurisdiction: string, filingType: string, requirementsRepository: Map<string, JurisdictionRequirements>): JurisdictionRequirements;
/**
 * Generates detailed report of rejection reasons
 * @param rejection - Rejection information
 * @returns Formatted rejection report
 */
export declare function generateRejectionReport(rejection: RejectionInfo): string;
/**
 * Creates resubmission workflow to track correction and resubmission
 * @param rejectionId - Rejection identifier
 * @param originalFilingId - Original filing ID
 * @param maxRetries - Maximum resubmission attempts
 * @returns Resubmission workflow
 */
export declare function createResubmissionWorkflow(rejectionId: string, originalFilingId: string, maxRetries?: number): ResubmissionWorkflow;
/**
 * Retrieves complete submission history for a filing
 * @param filingId - Filing identifier
 * @param historyRepository - History data repository
 * @returns List of submission attempts chronologically
 */
export declare function getSubmissionHistory(filingId: string, historyRepository: Map<string, SubmissionHistoryEntry[]>): SubmissionHistoryEntry[];
export {};
//# sourceMappingURL=regulatory-filing-submission-kit.d.ts.map